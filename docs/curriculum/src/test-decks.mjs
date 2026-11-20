// Runs against every real deck (not the sample): loads clean, steps through, quizzes and checklists behave,
// state persists, timers run, the phone handout fits, and the presenter view shows notes.
const { chromium } = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.mjs'));
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const slidesDir = path.join(here, '..', 'slides');
const manifest = JSON.parse(fs.readFileSync(path.join(slidesDir, '_manifest.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (c, n, x = '') => { c ? pass++ : fail++; if (!c) console.log(`FAIL  ${n}   ${x}`); };
const browser = await chromium.launch();

for (const d of manifest) {
  const url = 'file://' + path.join(slidesDir, d.file);
  const tag = `week ${d.week}`;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.clock.install({ time: new Date(2026, 11, 20, 12, 0, 0) });
  await page.goto(url); await page.evaluate(() => document.fonts.ready);

  ok(await page.evaluate(() => window.__deck.count) === d.slides, `${tag}: slide count matches the manifest`);

  // every slide can be shown, exactly one is active, and the counter agrees
  let bad = [];
  for (let i = 0; i < d.slides; i++) {
    await page.evaluate(i => window.__deck.show(i), i);
    const r = await page.evaluate(() => [document.querySelectorAll('.slide.active').length, parseInt(document.getElementById('c-pos').textContent, 10)]);
    if (r[0] !== 1 || r[1] !== i + 1) bad.push(`${i}:${r}`);
  }
  ok(bad.length === 0, `${tag}: every slide shows alone with the right counter`, bad.join(' '));

  // arrow keys reach the end, and Home returns
  await page.evaluate(() => window.__deck.show(0));
  let presses = 0; while (presses < d.slides * 8) { const s = await page.evaluate(() => window.__deck.state()); if (s.idx === d.slides - 1 && s.shown >= s.steps) break; await page.keyboard.press('ArrowRight'); presses++; }
  ok((await page.evaluate(() => window.__deck.state().idx)) === d.slides - 1, `${tag}: the arrow key reaches the last slide`, `after ${presses} presses`);
  await page.keyboard.press('Home'); ok(await page.evaluate(() => window.__deck.state().idx) === 0, `${tag}: Home returns to the cover`);

  // quizzes: valid answer index, explanation present, clicking the right answer marks it, only it
  const quizzes = await page.evaluate(() => [...document.querySelectorAll('.quiz')].map(q => ({ n: q.querySelectorAll('.opt').length, c: parseInt(q.dataset.correct, 10), why: q.querySelector('.why')?.textContent.trim().length })));
  ok(quizzes.every(q => q.c >= 0 && q.c < q.n && q.n >= 2 && q.why > 10), `${tag}: every quiz has a valid answer and an explanation`, JSON.stringify(quizzes));
  const marked = await page.evaluate(() => [...document.querySelectorAll('.quiz')].map(qz => { qz.querySelectorAll('.opt')[parseInt(qz.dataset.correct, 10)].click(); return [qz.querySelectorAll('.opt.right').length, qz.querySelectorAll('.opt.wrong').length]; }));
  ok(marked.every(m => m[0] === 1 && m[1] === 0), `${tag}: choosing the right answer marks only that one`, JSON.stringify(marked));

  // checklists: unique keys inside the deck, and a ticked box survives a reload
  const keys = await page.evaluate(() => [...document.querySelectorAll('ul.check')].map(u => u.dataset.key));
  ok(keys.every(k => k && /^[\w-]+$/.test(k)) && new Set(keys).size === keys.length, `${tag}: checklist keys are unique`, keys.join(','));
  if (keys.length) {
    await page.evaluate(() => { const cb = document.querySelector('ul.check input'); cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.reload(); await page.evaluate(() => document.fonts.ready);
    ok(await page.evaluate(() => document.querySelector('ul.check input').checked), `${tag}: a ticked checklist box survives a reload`);
  }

  // timers: start counts down
  const timers = await page.locator('[data-widget=timer]').count();
  if (timers) {
    await page.evaluate(() => { const i = [...document.querySelectorAll('.slide')].findIndex(s => s.querySelector('[data-widget=timer]')); window.__deck.show(i); });
    const first = page.locator('.slide.active [data-widget=timer] [data-t=go]').first();
    const before = await page.locator('.slide.active .timer .digits').first().textContent();
    await first.click(); await page.clock.runFor(2000);
    const after = await page.locator('.slide.active .timer .digits').first().textContent();
    ok(before !== after, `${tag}: a timer counts down`, `${before} -> ${after}`);
  }

  // presenter view: shows a title and notes for the current slide
  const pres = await ctx.newPage(); await pres.goto(url + '?presenter#2'); await pres.waitForTimeout(250);
  ok((await pres.textContent('#pv-title')).length > 0 && (await pres.textContent('#pv-notes')).trim().length > 20, `${tag}: presenter view shows a title and notes`);
  await pres.close();

  // print view: every slide is laid out
  const pr = await ctx.newPage(); await pr.goto(url + '?print'); await pr.evaluate(() => document.fonts.ready);
  ok(await pr.evaluate(() => document.querySelectorAll('.slide.active').length) === d.slides, `${tag}: print view lays out every slide`);
  await pr.close();

  // phone: handout mode, nothing wider than the screen, every slide readable
  const ph = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const pp = await ph.newPage(); await pp.goto(url); await pp.evaluate(() => document.fonts.ready);
  const dims = await pp.evaluate(() => ({ handout: document.body.classList.contains('handout'), sw: document.documentElement.scrollWidth, iw: innerWidth, vis: [...document.querySelectorAll('.slide')].every(s => getComputedStyle(s).visibility === 'visible') }));
  ok(dims.handout && dims.sw <= dims.iw + 1 && dims.vis, `${tag}: the phone handout fits and shows every slide`, JSON.stringify(dims));
  await ph.close();

  ok(errs.length === 0, `${tag}: no JavaScript errors`, errs.join(' | '));
  await ctx.close();
  console.log(`done  week ${d.week}`);
}
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
