// Layout QA. For every slide in every deck: does anything spill outside the safe area?
//   node docs/curriculum/src/qa.mjs [--shots DIR] [deck.html ...]
// Uses a normal 'npm i playwright'; falls back to the global install this was written against.
const { chromium } = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.mjs'));
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const slidesDir = path.join(here, '..', 'slides');
const args = process.argv.slice(2);
const shotsIdx = args.indexOf('--shots');
const shots = shotsIdx >= 0 ? args[shotsIdx + 1] : null;
const decks = args.filter((a, i) => a.endsWith('.html') && i !== shotsIdx + 1);
const files = decks.length ? decks : fs.readdirSync(slidesDir).filter(f => f.endsWith('.html') && !f.startsWith('index')).sort();
if (shots) fs.mkdirSync(shots, { recursive: true });

const SAFE_BOTTOM = 676;    // bottom chrome lives at ~y=690; content must stop above it
const SAFE_RIGHT = 1280 - 60;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
let bad = 0, total = 0;
for (const f of files) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + path.join(slidesDir, f));
  await page.evaluate(() => document.fonts.ready);
  const n = await page.evaluate(() => window.__deck.count);
  const issues = [];
  for (let i = 0; i < n; i++) {
    total++;
    await page.evaluate(k => { window.__deck.show(k, true); document.querySelectorAll('.slide.active .step').forEach(s => s.classList.add('shown')); }, i);
    await page.waitForTimeout(60);
    const r = await page.evaluate(({ SAFE_BOTTOM, SAFE_RIGHT }) => {
      const s = document.querySelector('.slide.active'), st = document.querySelector('.stage').getBoundingClientRect();
      let maxB = 0, maxR = 0, culprit = '';
      s.querySelectorAll('.inner *').forEach(el => {
        if (el.closest('.notes') || el.closest('svg') && el.tagName !== 'svg') return;
        const b = el.getBoundingClientRect(); if (!b.width || !b.height) return;
        if (b.bottom - st.top > maxB) { maxB = b.bottom - st.top; culprit = el.tagName.toLowerCase() + '.' + (el.className && el.className.baseVal === undefined ? el.className : ''); }
        maxR = Math.max(maxR, b.right - st.left);
      });
      const inner = s.querySelector('.inner');
      return { maxB: Math.round(maxB), maxR: Math.round(maxR), culprit, title: s.dataset.title, scroll: inner.scrollHeight - inner.clientHeight };
    }, { SAFE_BOTTOM, SAFE_RIGHT });
    const kind = await page.evaluate(() => document.querySelector('.slide.active').dataset.kind);
    const limit = kind === 'cover' || kind === 'sect' ? 700 : SAFE_BOTTOM;
    if (r.maxB > limit || r.maxR > SAFE_RIGHT || r.scroll > 2) {
      bad++; issues.push(`  slide ${i + 1} "${r.title.slice(0, 48)}": bottom ${r.maxB}px (limit ${limit}) right ${r.maxR} scroll+${r.scroll} <- ${r.culprit}`);
    }
    if (shots) await page.screenshot({ path: path.join(shots, `${f.replace('.html', '')}-${String(i + 1).padStart(2, '0')}.png`) });
  }
  console.log(`${issues.length || errors.length ? 'CHECK' : 'ok   '} ${f}  (${n} slides)`);
  issues.forEach(x => console.log(x));
  errors.forEach(x => console.log('  js error:', x));
  await page.close();
}
await browser.close();
console.log(`\n${total} slides checked, ${bad} with layout problems`);
process.exit(bad ? 1 : 0);
