// capture-risk-propagation.mjs — the captures on article-risk-propagation-visualiser.html.
//
//   bash scripts/run-locally__riskmandate_ai.sh        # or any static server on site/, then
//   node scripts/site/capture-risk-propagation.mjs [http://localhost:10070]
//
// Needs Playwright with a Chromium (it is not a project dependency, and CI never runs this).
// Sets the blast-radius figure on article-who-owns-what-in-ai.html to each state the guide's
// captions name, photographs it at 1.5x, and writes WebP files into
// site/assets/articles/risk-propagation/ (PNGs first, converted with Pillow if present; keep
// the PNGs otherwise and convert by hand). Run it again after any change to the figure, or the
// guide's pictures will disagree with the figure they describe.
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
const BASE = process.argv[2] || 'http://localhost:10070';
const OUT = new URL('../../site/assets/articles/risk-propagation/', import.meta.url).pathname;
const PW = ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs'].find((p) => { try { return p.startsWith('/') ? existsSync(p) : true; } catch { return false; } });
const { chromium } = await import(PW);

const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 1.5 });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(BASE + '/article-who-owns-what-in-ai.html?t=' + Date.now());
await p.addStyleTag({ content: '.wo-halo,.wo-e,.wo-risk,.wo-conn rect,.wo-row circle,.wo-role,.wo-conn,.wo-agent,.wo-org,.wo-badge,.wo-row{transition:none !important}' });
const click = async (sel) => { await p.evaluate(s => document.querySelector(s).dispatchEvent(new Event('click', { bubbles: true })), sel); await p.waitForTimeout(60); };
const settle = () => p.waitForTimeout(1300);
const shot = async (sel, name) => { const el = await p.$(sel); await el.scrollIntoViewIfNeeded(); await settle(); await el.screenshot({ path: OUT + name + '.png' }); console.log('shot', name); };
const reset = async () => { await p.click('#wo-b-reset'); await p.waitForTimeout(100); };
const toggle = async (id) => { await p.click('#wo-t-' + id); await p.waitForTimeout(100); };
const clearSel = async () => { await p.evaluate(() => document.querySelector('#wo-figA svg').dispatchEvent(new Event('click'))); await p.waitForTimeout(60); };
const state = () => p.evaluate(() => ['grant','mandate','excess','unbounded','open','unaccepted','accepted','abp'].map(k => k + '=' + document.getElementById('wo-c-' + k).textContent).join(' '));
// 0 nothing
await shot('#wo-figA', '00-not-connected');
await shot('.wo-ctl', '01-controls');
await shot('.wo-legend', '02-legend');
// isolation
await toggle('crm'); console.log('crm', await state()); await shot('#wo-figA', '10-crm-only');
await click('.wo-conn[aria-label="CRM"]'); await shot('#wo-figA', '11-crm-selected'); await shot('#wo-figA-role', '11b-crm-panel'); await clearSel();
await click('.wo-role[aria-label="CEO"]'); await shot('#wo-figA-role', '12-ceo-panel-crm'); await clearSel();
await shot('#wo-figA-list', '13-crm-list'); await shot('.wo-counts.small', '13b-crm-counts');
await reset(); await toggle('mail'); console.log('mail', await state()); await shot('#wo-figA', '20-mail-only');
await click('.wo-risk[aria-label^="R0"]'); await shot('#wo-figA', '21-mail-r0-selected'); await clearSel();
await click('.wo-role[aria-label="Legal"]'); await shot('#wo-figA', '22-mail-legal-selected'); await shot('#wo-figA-role', '22b-legal-panel'); await clearSel();
await reset(); await toggle('cal'); console.log('cal', await state()); await shot('#wo-figA', '30-calendar-only');
await click('.wo-risk[aria-label^="R5"]'); await shot('#wo-figA-role', '31-r5-panel'); await clearSel();
// combined
await reset(); await toggle('mail'); await toggle('crm'); console.log('mail+crm', await state()); await shot('#wo-figA', '40-mail-crm');
await click('.wo-risk[aria-label^="R2"]'); await shot('#wo-figA', '41-r2-trifecta-selected'); await shot('#wo-figA-role', '41b-r2-panel'); await clearSel();
await toggle('cal'); console.log('all', await state()); await shot('#wo-figA', '42-all-three'); await shot('#wo-figA-list', '43-all-list'); await shot('.wo-counts.small', '43b-all-counts');
await click('.wo-role[aria-label="CEO"]'); await shot('#wo-figA', '44-ceo-selected'); await shot('#wo-figA-role', '44b-ceo-panel'); await clearSel();
await click('.wo-role[aria-label="The rep"]'); await shot('#wo-figA', '45-rep-selected'); await clearSel();
await click('.wo-role[aria-label="Board"]'); await shot('#wo-figA-role', '46-board-panel'); await clearSel();
// six weeks
await reset(); for (let i = 0; i < 3; i++) await p.click('#wo-b-next'); await p.waitForTimeout(100); await shot('#wo-figA', '50-day3-accepted'); await shot('.wo-status', '50b-day3-status');
await p.click('#wo-b-next'); await p.waitForTimeout(100); await shot('#wo-figA', '51-day4-crm-limit');
await p.click('#wo-b-next'); await p.waitForTimeout(100); await shot('#wo-figA', '52-day7-r5-moves-up'); await click('.wo-risk[aria-label^="R5"]'); await shot('#wo-figA-role', '52b-r5-at-ceo'); await clearSel();
await p.click('#wo-b-next'); await p.waitForTimeout(100); await shot('#wo-figA', '53-day10-calendar-narrowed');
await p.click('#wo-b-next'); await p.waitForTimeout(100); await shot('#wo-figA', '54-day15-approval');
await click('.wo-risk[aria-label^="G4"]'); await shot('#wo-figA-role', '54b-g4-panel'); await clearSel();
await p.click('#wo-b-next'); await p.click('#wo-b-next'); await p.waitForTimeout(100); await shot('#wo-figA', '55-day42-board'); await shot('#wo-figA-list', '55b-day42-list'); await shot('.wo-counts.small', '55c-day42-counts');
// remediation in isolation, from everything connected
const ctl = async (id, name) => { await reset(); await toggle('mail'); await toggle('crm'); await toggle('cal'); await toggle(id); console.log(name, await state()); await shot('#wo-figA', name); };
await ctl('approval', '60-control-approval'); await ctl('crmLimit', '61-control-crm-limit'); await ctl('noExport', '62-control-no-export'); await ctl('calOwn', '63-control-calendar-own');
await ctl('shared', '64-control-shared-inbox'); await ctl('proxy', '65-control-proxy'); await click('.wo-agent'); await shot('#wo-figA-role', '65b-proxy-agent-panel'); await clearSel();
await ctl('terms', '66-control-terms'); await ctl('cover', '67-control-cover');
await reset(); await toggle('mail'); await toggle('crm'); await toggle('cal'); await toggle('instr'); console.log('instr', await state()); await shot('#wo-figA', '68-instructions-only'); await shot('.wo-counts.small', '68b-instructions-counts');
await reset(); await p.click('#wo-b-all'); await p.waitForTimeout(100); console.log('all controls', await state()); await shot('#wo-figA', '70-every-control'); await shot('#wo-figA-list', '71-every-control-list'); await shot('.wo-counts.small', '71b-every-control-counts');
await toggle('proxy'); console.log('minus proxy', await state()); await shot('#wo-figA', '72-every-control-minus-proxy');
await shot('#wo-figB', '80-strip'); await shot('#wo-figC', '81-ontology');
console.log('errors:', errs.length ? errs : 'none'); await b.close();
// PNG → WebP, when Pillow is there
try { execSync(`python3 - <<'PY'
from PIL import Image
import os
d = ${JSON.stringify(OUT)}
for f in sorted(os.listdir(d)):
    if f.endswith('.png'):
        im = Image.open(d + f).convert('RGB'); im.save(d + f[:-4] + '.webp', 'WEBP', quality=84, method=6); os.remove(d + f)
PY`, { stdio: 'inherit' }); } catch (e) { console.error('WebP conversion skipped:', e.message); }
