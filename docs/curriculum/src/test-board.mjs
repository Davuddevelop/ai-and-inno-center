// Tests the team board: scoring logic with known answers, safety of imports, persistence, limits.
// Uses a normal 'npm i playwright'; falls back to the global install this was written against.
const { chromium } = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.mjs'));
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(here, '..', process.argv[2] || 'team-board.html');

let pass = 0, fail = 0;
const ok = (cond, name, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'pass' : 'FAIL'}  ${name}${cond ? '' : '   ' + extra}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', e => errors.push(String(e)));
let dialogs = []; page.on('dialog', d => { dialogs.push(d.message()); d.accept(); });
await page.goto(url); await page.evaluate(() => document.fonts.ready);

// person builder inside the page: signals are the 5 observed numbers, ranks are the rank given to each of the 5 roles
const run = (people, wWant = 0.5, n = 3) => page.evaluate(([people, wWant, n]) => {
  const B = window.__board; const s = B.defaults().settings; s.wWant = wWant;
  const ps = people.map((p, i) => ({ id: 'p' + i, name: p.name, team: 't', obs: p.obs, rank: p.rank, note: '' }));
  const r = B.assign(ps, s, n);
  return r && r.map(x => ({ total: x.total, who: x.pairs.map(y => [y.slot.map(i => B.ROLES[i]).join('+'), y.person.name]) }));
}, [people, wWant, n]);
const who = (res, slot) => res[0].who.find(w => w[0] === slot)?.[1];

// --- known answers
// five people, each strong at exactly one signal and ranking the matching role first: the assignment must be the diagonal
const diag = [
  { name: 'A', obs: [5, 1, 1, 1, 1], rank: [1, 2, 3, 4, 5] },   // Decides -> Product Lead
  { name: 'B', obs: [1, 5, 1, 1, 1], rank: [5, 1, 2, 3, 4] },   // Interface -> Interface Builder
  { name: 'C', obs: [1, 1, 5, 1, 1], rank: [4, 5, 1, 2, 3] },   // Technical -> AI Engineer
  { name: 'D', obs: [1, 1, 1, 5, 1], rank: [3, 4, 5, 1, 2] },   // Reliable -> Platform Captain
  { name: 'E', obs: [1, 1, 1, 1, 5], rank: [2, 3, 4, 5, 1] }];  // Story -> Demo Producer
let r = await run(diag, 0.5, 3);
ok(who(r, 'Product Lead') === 'A' && who(r, 'Interface Builder') === 'B' && who(r, 'AI Engineer') === 'C' && who(r, 'Platform Captain') === 'D' && who(r, 'Demo Producer') === 'E', 'five aligned people get their own roles', JSON.stringify(r[0].who));

// two want AI Engineer first; the one with the stronger technical signal gets it, the other gets a sensible second
const clash = [
  { name: 'Strong', obs: [3, 3, 5, 3, 3], rank: [4, 5, 1, 2, 3] },
  { name: 'Weak', obs: [3, 3, 2, 3, 3], rank: [3, 4, 1, 5, 2] },
  { name: 'C', obs: [5, 2, 2, 3, 3], rank: [1, 3, 2, 4, 5] },
  { name: 'D', obs: [2, 5, 2, 3, 3], rank: [3, 1, 4, 5, 2] },
  { name: 'E', obs: [3, 3, 3, 5, 3], rank: [5, 4, 3, 1, 2] }];
r = await run(clash, 0.5, 3);
ok(who(r, 'AI Engineer') === 'Strong', 'clash on the same role goes to the stronger observed signal', JSON.stringify(r[0].who));

// one strong person who ranks Product Lead last, one weak person who ranks it first, three neutral people who do not want it
const pl = [
  { name: 'Strong', obs: [5, 3, 3, 5, 5], rank: [5, 1, 2, 3, 4] },
  { name: 'Asker', obs: [1, 3, 3, 3, 3], rank: [1, 2, 3, 4, 5] },
  { name: 'N1', obs: [3, 3, 3, 3, 3], rank: [4, 1, 2, 3, 5] }, { name: 'N2', obs: [3, 3, 3, 3, 3], rank: [5, 4, 1, 2, 3] }, { name: 'N3', obs: [3, 3, 3, 3, 3], rank: [3, 5, 4, 1, 2] }];
r = await run(pl, 0, 3);
ok(who(r, 'Product Lead') === 'Strong', 'at 0% want, the strongest observed profile gets the role', JSON.stringify(r[0].who));
r = await run(pl, 1, 3);
ok(who(r, 'Product Lead') === 'Asker', 'at 100% want, the person who asked for it gets the role', JSON.stringify(r[0].who));
r = await run(pl, 0.5, 3);
ok(['Strong', 'Asker'].includes(who(r, 'Product Lead')), 'at 50% the result is one of the two plausible choices', JSON.stringify(r[0].who));

// team sizes: 3, 4 combine roles; 2 and 6 are refused, not crashed
const mk = n => Array.from({ length: n }, (_, i) => ({ name: 'P' + i, obs: [3, 3, 3, 3, 3], rank: [1, 2, 3, 4, 5] }));
r = await run(mk(4), 0.5, 1); ok(r[0].who.length === 4 && r[0].who.some(w => w[0] === 'Product Lead+Demo Producer'), 'a team of 4 combines Product Lead and Demo Producer');
r = await run(mk(3), 0.5, 1); ok(r[0].who.length === 3 && r[0].who.some(w => w[0] === 'AI Engineer+Platform Captain'), 'a team of 3 combines two pairs of roles');
r = await run(mk(5), 0.5, 1); ok(r[0].who.length === 5, 'a team of 5 gets five separate roles');
ok(await run(mk(2), 0.5, 1) === null && await run(mk(6), 0.5, 1) === null, 'teams of 2 and 6 are refused rather than guessed at');
const all = await run(mk(5), 0.5, 3);
ok(all.length === 3 && all[0].total >= all[1].total && all[1].total >= all[2].total, 'alternatives come back best first');

// missing data is neutral, not zero or a crash
r = await run([{ name: 'Blank', obs: [null, null, null, null, null], rank: [null, null, null, null, null] }, ...mk(2)], 0.5, 1);
ok(r && Number.isFinite(r[0].total), 'a person with no data is scored as neutral');

// --- the page, end to end
await page.click('#b-demo');
ok(await page.locator('#tbl tbody tr').count() === 9, 'demo loads nine people');
ok(await page.locator('.team').count() === 2, 'demo shows two teams');
const bText = await page.locator('.team').nth(1).textContent();
ok(bText.includes('both ranked AI Engineer first'), 'the demo clash is called out in the flags', bText.slice(0, 300));
ok(await page.locator('.team .row').count() === 5 + 4, 'rows: five roles for team A, four slots for team B');

// changing a rank updates suggestions and flags duplicates
const before = await page.locator('.team').first().textContent();
await page.locator('#tbl tbody tr').first().locator('td select').nth(5).selectOption('5');   // first person: Product Lead rank 1 -> 5 (now a duplicate)
ok(await page.locator('#tbl tbody tr').first().locator('select.dupe').count() >= 1, 'a repeated rank is highlighted');
ok((await page.locator('.team').first().textContent()) !== before, 'editing a rank changes the suggestion');

// weights
await page.locator('#wwant').fill('100');
ok((await page.textContent('#rv')) === '100%', 'the want slider updates its label');

// persistence across reload
const people = await page.evaluate(() => window.__board.state().people.length);
await page.reload(); await page.evaluate(() => document.fonts.ready);
ok(await page.evaluate(() => window.__board.state().people.length) === people && await page.evaluate(() => window.__board.state().settings.wWant) === 1, 'people and weights survive a reload');

// export / import round trip
const exported = await page.evaluate(() => window.__board.exportJSON());
await page.click('#b-clear'); ok(await page.locator('#tbl tbody tr:not(:has(td.empty))').count() === 0, 'clear removes everyone (after confirm)');
ok(dialogs.length === 1, 'clear asks for confirmation first');
const imp = await page.evaluate(t => window.__board.importJSON(t), exported);
ok(imp.ok && imp.people === 9, 'export then import restores everyone', JSON.stringify(imp));

// hostile or broken files
ok((await page.evaluate(() => window.__board.importJSON('not json'))).ok === false, 'invalid JSON is rejected');
ok((await page.evaluate(() => window.__board.importJSON('{"people":"nope"}'))).ok === false, 'wrong shape is rejected');
ok((await page.evaluate(() => window.__board.importJSON('[1,2,3]'))).ok === false, 'an array is rejected');
const hostile = i => ({ id: '<script>', name: '<img src=x onerror="window.__pwned=1">' + i, team: 'T', obs: [99, -1, 'x', null, 2.4], rank: [1, 1, 1, 7, 'a'], note: '<svg onload="window.__pwned=1">' });
// three of them on one team, so their names reach the suggestion rows and the flags, not just an input box
const evil = JSON.stringify({ people: [hostile(1), hostile(2), hostile(3)], settings: { wWant: 9, mix: [[1]] } });
const ev = await page.evaluate(t => window.__board.importJSON(t), evil);
await page.waitForTimeout(400);
ok(await page.locator('.team .row').count() === 3, 'the hostile names do reach the suggestion rows (so the test is meaningful)');
ok(ev.ok === true, 'a hostile file is accepted but cleaned');
ok(await page.evaluate(() => window.__pwned === undefined), 'names are shown as text, not run as HTML');
const clean = await page.evaluate(() => { const p = window.__board.state().people[0]; return { obs: p.obs, rank: p.rank, w: window.__board.state().settings.wWant, mix: window.__board.state().settings.mix.length }; });
ok(JSON.stringify(clean.obs) === '[null,null,null,null,2]', 'out-of-range or non-numeric ratings are dropped, decimals rounded', JSON.stringify(clean.obs));
ok(JSON.stringify(clean.rank) === '[1,1,1,null,null]', 'invalid ranks are dropped', JSON.stringify(clean.rank));
ok(clean.w === 1, 'an out-of-range weight is clamped to 100%', String(clean.w));
ok(clean.mix === 5, 'a malformed weight table falls back to the defaults', String(clean.mix));
ok(await page.evaluate(() => /^[a-z0-9]{3,16}$/.test(window.__board.state().people[0].id)), 'a bad id is replaced');

// layout: no sideways scroll on the page itself at laptop width (the table scrolls inside its own box)
ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal page scroll at 1280px');
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const pp = await phone.newPage(); await pp.goto(url); await pp.evaluate(() => document.fonts.ready);
ok(await pp.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal page scroll on a phone');

ok(errors.length === 0, 'no JavaScript errors', errors.join(' | '));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
