// Drives the real decks. Fails loudly if any interaction is broken.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const deck = path.join(here, '..', 'slides', process.argv[2] || '_sample.html');
const url = 'file://' + deck;

let pass = 0, fail = 0;
const ok = (cond, name, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'pass' : 'FAIL'}  ${name}${cond ? '' : '   ' + extra}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', e => errors.push(String(e)));
await page.goto(url); await page.evaluate(() => document.fonts.ready);
const st = () => page.evaluate(() => window.__deck.state());
const idx = () => page.evaluate(() => parseInt(document.getElementById('c-pos').textContent, 10) - 1);
const goTitle = async (t) => { const i = await page.evaluate(t => [...document.querySelectorAll('.slide')].findIndex(s => s.dataset.title.includes(t)), t); await page.evaluate(i => window.__deck.show(i), i); return i; };

// --- navigation
await page.keyboard.press('ArrowRight'); ok(await idx() === 1, 'ArrowRight advances');
await page.keyboard.press('ArrowLeft'); ok(await idx() === 0, 'ArrowLeft goes back');
await page.keyboard.press('End'); ok(await idx() === (await page.evaluate(() => window.__deck.count)) - 1, 'End jumps to last');
await page.keyboard.press('Home'); ok(await idx() === 0, 'Home jumps to first');
await page.keyboard.press('g'); ok(await page.evaluate(() => document.getElementById('ov-grid').classList.contains('on')), 'G opens overview');
const gridN = await page.evaluate(() => document.querySelectorAll('#ov-grid .grid-ov button').length);
ok(gridN === (await page.evaluate(() => window.__deck.count)), 'overview lists every slide', `${gridN}`);
await page.keyboard.press('Escape'); ok(!(await page.evaluate(() => document.getElementById('ov-grid').classList.contains('on'))), 'Esc closes overview');
await page.keyboard.press('?'); ok(await page.evaluate(() => document.getElementById('ov-help').classList.contains('on')), '? opens help');
await page.keyboard.press('Escape');

// --- step reveal
const si = await goTitle('Reveal one');
let s0 = await st(); ok(s0.steps === 2 && s0.shown === 0, 'step slide starts hidden', JSON.stringify(s0));
await page.keyboard.press('ArrowRight'); ok((await st()).shown === 1 && await idx() === si, 'first click reveals step 1, stays on slide');
await page.keyboard.press('ArrowRight'); ok((await st()).shown === 2, 'second click reveals step 2');
await page.keyboard.press('ArrowRight'); ok(await idx() === si + 1, 'third click moves on');
await page.keyboard.press('ArrowLeft'); ok(await idx() === si && (await st()).shown === 2, 'going back returns with steps still shown');

// --- quiz
await goTitle('Quick check');
await page.click('.slide.active .opt >> nth=1');
ok(await page.evaluate(() => document.querySelector('.slide.active .quiz').classList.contains('done')), 'quiz locks after answering');
ok(await page.evaluate(() => document.querySelector('.slide.active .opt.right') !== null), 'quiz marks the right answer');
await goTitle('Quick check'); await page.reload(); await page.evaluate(() => document.fonts.ready);
await goTitle('Quick check');
await page.click('.slide.active .opt >> nth=0');
ok(await page.evaluate(() => document.querySelector('.slide.active .opt.wrong') !== null && document.querySelector('.slide.active .opt.right') !== null), 'wrong answer shows wrong AND reveals right');
ok(await page.evaluate(() => getComputedStyle(document.querySelector('.slide.active .why')).display !== 'none'), 'explanation appears');

// --- checklist persistence
await goTitle('tasks');
await page.click('.slide.active ul.check li:nth-child(1) input');
await page.reload(); await page.evaluate(() => document.fonts.ready); await goTitle('tasks');
ok(await page.evaluate(() => document.querySelector('.slide.active ul.check input').checked), 'checklist survives a reload');

// --- git widget: scenarios, not clicks
await goTitle('Branches are');
const commits = () => page.evaluate(() => document.querySelectorAll('.slide.active svg.git circle').length);
const msg = () => page.evaluate(() => document.querySelector('.slide.active .wmsg').textContent);
ok(await commits() === 3, 'git sandbox starts with 3 commits', `${await commits()}`);
await page.click('.slide.active [data-a=commit]'); ok(await commits() === 4, 'commit adds a node');
await page.click('.slide.active [data-a=branch]');
ok((await page.evaluate(() => document.querySelector('.slide.active svg.git').textContent)).includes('HEAD > feature-1'), 'new branch becomes HEAD');
await page.click('.slide.active [data-a=commit]'); await page.click('.slide.active [data-a=commit]');
await page.selectOption('.slide.active [data-a=sw]', 'main'); await page.click('.slide.active [data-a=switch]');
await page.selectOption('.slide.active [data-a=mg]', 'feature-1'); await page.click('.slide.active [data-a=merge]');
ok((await msg()).includes('Fast-forward'), 'merging a branch ahead of main is a fast-forward', await msg());
ok(await page.evaluate(() => document.querySelectorAll('.slide.active svg.git circle.merge').length === 0), 'fast-forward creates no merge commit');
// diverge: commit on main, branch, commit on both, merge
await page.click('.slide.active [data-a=reset]');
await page.click('.slide.active [data-a=branch]'); await page.click('.slide.active [data-a=commit]');
await page.selectOption('.slide.active [data-a=sw]', 'main'); await page.click('.slide.active [data-a=switch]'); await page.click('.slide.active [data-a=commit]');
await page.selectOption('.slide.active [data-a=mg]', 'feature-1'); await page.click('.slide.active [data-a=merge]');
ok((await msg()).includes('Merge commit'), 'diverged branches produce a merge commit', await msg());
ok(await page.evaluate(() => document.querySelectorAll('.slide.active svg.git circle.merge').length === 1), 'merge commit is drawn distinctly');
await page.selectOption('.slide.active [data-a=mg]', 'feature-1'); await page.click('.slide.active [data-a=merge]');
ok((await msg()).includes('Already up to date'), 'merging again says already up to date', await msg());

// --- conflict widget
await goTitle('When two people');
await page.click('.slide.active [data-r=both]');
ok((await msg()).includes('Careful'), 'accept-both warns that it is usually wrong', await msg());
await page.click('.slide.active [data-r=cur]');
ok((await msg()).includes('Markers gone'), 'accept-current explains the next steps', await msg());

// --- idea scorer
await goTitle('Compare, then');
const tot = () => page.evaluate(() => [...document.querySelectorAll('.slide.active .scorer .tot')].map(e => parseInt(e.textContent, 10)));
ok((await tot()).every(v => v === 60), 'scorer starts neutral at 60');
const inputs = '.slide.active .scorer tbody tr:nth-child(2) input[type=number]';
for (let k = 0; k < 6; k++) await page.fill(`${inputs} >> nth=${k}`, '5');
const t = await tot(); ok(t[1] === 100 && t[0] === 60, 'all-5 idea scores 100', JSON.stringify(t));
ok(await page.evaluate(() => document.querySelector('.slide.active .scorer tbody tr:nth-child(2)').classList.contains('top')), 'highest idea is highlighted');

// --- presenter view stays in sync with the main window
const main = await ctx.newPage(); await main.goto(url + '#3'); await main.evaluate(() => document.fonts.ready);
const pres = await ctx.newPage(); await pres.goto(url + '?presenter#3'); await pres.waitForTimeout(300);
ok((await pres.textContent('#pv-title')).length > 0, 'presenter shows the current slide title');
ok((await pres.textContent('#pv-notes')).length > 0, 'presenter shows speaker notes');
await pres.click('#pv-next'); await main.waitForTimeout(300);
const mi = await main.evaluate(() => parseInt(document.getElementById('c-pos').textContent, 10));
ok(mi === 4, 'presenter Next advances the main window', `main on slide ${mi}`);
await main.evaluate(() => window.__deck.show(8)); await pres.waitForTimeout(300);
ok((await pres.textContent('#pv-pos')).includes('Slide 9'), 'main window updates the presenter', await pres.textContent('#pv-pos'));

// --- phone: handout mode, no sideways scroll
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const pp = await phone.newPage(); await pp.goto(url); await pp.evaluate(() => document.fonts.ready);
ok(await pp.evaluate(() => document.body.classList.contains('handout')), 'phone width switches to handout mode');
const dims = await pp.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, vis: [...document.querySelectorAll('.slide')].every(s => getComputedStyle(s).visibility === 'visible') }));
ok(dims.sw <= dims.iw + 1, 'no horizontal scroll on a phone', JSON.stringify(dims));
ok(dims.vis, 'every slide is readable in handout mode');

ok(errors.length === 0, 'no JavaScript errors', errors.join(' | '));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
