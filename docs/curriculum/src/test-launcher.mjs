// The launcher page: every week is listed, links open the right deck, the next session is highlighted, works on a phone.
const { chromium } = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.mjs'));
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(here, '..', 'slides', 'index.html');
let pass = 0, fail = 0;
const ok = (c, n, x = '') => { c ? pass++ : fail++; console.log(`${c ? 'pass' : 'FAIL'}  ${n}${c ? '' : '   ' + x}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(String(e)));
// pretend today is mid-program so the "next" highlight is checked against a known answer
await page.clock.install({ time: new Date(2026, 11, 20, 12, 0, 0) });   // Dec 20, 2026
await page.goto(url); await page.evaluate(() => document.fonts.ready);

ok(await page.locator('.card').count() === 8, 'all eight weeks are listed');
const titles = await page.locator('.card h3').allTextContents();
ok(titles[0] === 'How hackathons are won' && titles[7] === 'Demo Day', 'weeks are in order', titles.join(' | '));
ok((await page.locator('.card.next h3').textContent()) === 'Make it real', 'on Dec 20 the next session is Week 5 (Dec 24)', await page.locator('.card.next h3').textContent());
ok(await page.locator('.card.next').count() === 1, 'exactly one card is marked next');
ok((await page.textContent('#days')) === '31', 'countdown to Jan 20 reads 31 days on Dec 20', await page.textContent('#days'));
ok((await page.locator('.card').nth(5).textContent()).includes('self-guided'), 'the take-home week says it is self-guided');

// every link points at a file that exists and opens a deck
const hrefs = await page.locator('.card a').evaluateAll(a => a.map(x => x.getAttribute('href')));
ok(hrefs.length === 16, 'each week has Open and Handout links', String(hrefs.length));
for (const [i, h] of [0, 5, 7].map(i => [i, hrefs[i * 2]])) {
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(new URL(h, url).href); await p.evaluate(() => document.fonts.ready);
  ok(await p.evaluate(() => typeof window.__deck === 'object' && window.__deck.count > 5) && errs.length === 0, `Open link for week ${i + 1} loads a working deck`, errs.join(' '));
  await p.close();
}
const hp = await ctx.newPage(); await hp.goto(new URL(hrefs[1], url).href); await hp.evaluate(() => document.fonts.ready);
ok(await hp.evaluate(() => document.body.classList.contains('handout')), 'the Handout link opens reading mode');
ok((await page.locator('a[href="../team-board.html"]').count()) === 1, 'the team board is linked');
const tb = await ctx.newPage(); await tb.goto(new URL('../team-board.html', url).href);
ok((await tb.title()).startsWith('Team board'), 'the team board link resolves');

const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const pp = await phone.newPage(); await pp.goto(url); await pp.evaluate(() => document.fonts.ready);
ok(await pp.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal scroll on a phone');
ok(errors.length === 0, 'no JavaScript errors', errors.join(' | '));
await browser.close(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
