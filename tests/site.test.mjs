import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseHTML } from 'linkedom';
import { build } from 'esbuild';

const routes = JSON.parse(await readFile('dist/routes.json', 'utf8'));
const sourceRoutes = ['/', '/data-engineering', '/ai-engineering', '/analytics', '/migration', '/managed-services', '/databricks-consulting', '/microsoft-data-ai-consulting', '/migration-to-databricks', '/migration-to-fabric', '/ssrs-to-power-bi-migration', '/case-studies', '/about', '/careers', '/contact', '/privacy', '/terms', ...['databricks-multi-source-delivery', 'healthcare-fabric-data-platform', 'lakehouse-plant-telemetry', 'streaming-parcel-events', 'synapse-to-databricks-migration', 'governed-knowledge-agent', 'pricing-desk-databricks-app', 'metadata-driven-ingestion-framework'].map(slug => `/case-studies/${slug}`)];
const documents = new Map(await Promise.all(routes.map(async route => [route, parseHTML(await readFile(path.join('dist', route.slice(1), 'index.html'), 'utf8')).document])));

test('every reference route has a distinct, populated HTML document and metadata', () => {
  const titles = new Set();
  for (const route of sourceRoutes) assert.ok(routes.includes(route), `Missing reference route: ${route}`);
  for (const [route, document] of documents) {
    assert.equal(document.querySelectorAll('main h1').length, 1, `${route}: one page heading`);
    assert.ok(document.querySelector('main').textContent.length > 150, `${route}: substantive page content`);
    assert.ok(document.querySelector('meta[name="description"]').getAttribute('content').length > 15);
    assert.ok(!titles.has(document.title), `${route}: unique title`);
    titles.add(document.title);
  }
});

test('all local page links and fragment targets resolve, and every page is reachable from home', () => {
  const graph = new Map();
  for (const [route, document] of documents) {
    const links = new Set();
    for (const anchor of document.querySelectorAll('a[href]')) {
      const url = new URL(anchor.getAttribute('href'), `https://aether.example${route}`);
      if (url.origin !== 'https://aether.example') continue;
      const target = url.pathname.replace(/\/$/, '') || '/';
      assert.ok(documents.has(target), `${route}: broken page ${url.pathname}`);
      if (url.hash) assert.ok(documents.get(target).getElementById(decodeURIComponent(url.hash.slice(1))), `${route}: broken fragment ${url.href}`);
      links.add(target);
    }
    graph.set(route, links);
  }
  const visited = new Set(['/']);
  const pending = ['/'];
  while (pending.length) for (const target of graph.get(pending.shift())) if (!visited.has(target)) { visited.add(target); pending.push(target); }
  assert.equal(visited.size, routes.length, `Unreachable: ${routes.filter(route => !visited.has(route)).join(', ')}`);
});

test('contact has labelled required fields, project scope and privacy link', () => {
  const document = documents.get('/contact');
  for (const name of ['name','email','scale','message']) {
    const field = document.querySelector(`form [name="${name}"]`);
    assert.ok(field.hasAttribute('required'));
    assert.ok(field.closest('label').textContent.trim().length > 0);
  }
  assert.equal(document.querySelector('[name="email"]').getAttribute('type'), 'email');
  assert.ok(document.querySelector('form a[href="/privacy"]'));
});

test('unknown paths have a genuine not-found document with a home link', async () => {
  const { document } = parseHTML(await readFile('dist/404.html','utf8'));
  assert.ok(document.title.includes('404'));
  assert.ok(document.querySelector('.not-found a[href="/"]'));
});

test('project email preserves newlines and punctuation without allowing additional mail headers', async () => {
  const result = await build({stdin:{contents:'export { createProjectMailto } from "./src/PageContent";',resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
  const { createRequire } = await import('node:module');
  const module = {exports:{}};
  new Function('require','module','exports',result.outputFiles[0].text)(createRequire(import.meta.url),module,module.exports);
  const data = new FormData();
  data.set('name','Test & Co'); data.set('email','test@example.com'); data.set('company','A+B'); data.set('scale','MVP');
  data.set('message','Line one\nLine two &bcc=other@example.com?subject=changed');
  const url = new URL(module.exports.createProjectMailto(data,'en'));
  assert.equal(url.pathname,'info@aethersystems.tech');
  assert.deepEqual([...url.searchParams.keys()],['subject','body']);
  assert.ok(url.searchParams.get('body').includes('Line one\nLine two &bcc=other@example.com?subject=changed'));
});

const wakeBundle = await build({ entryPoints: ['src/liquidWake.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { LiquidWake, liquidPoint, WAKE_COUNT, WAKE_LIFETIME } = await import(`data:text/javascript;base64,${Buffer.from(wakeBundle.outputFiles[0].text).toString('base64')}`);

test('liquid pointer uses canvas bounds, scroll position and consistent aspect ratio', () => {
  const bounds = { left: 20, top: -200, width: 1200, height: 1000 };
  assert.deepEqual(liquidPoint(620, 300, bounds), { x: 0, y: 0 });
  assert.ok(Math.abs(liquidPoint(720, 300, bounds).x - liquidPoint(620, 200, bounds).y) < 1e-12);
  assert.equal(liquidPoint(10, 300, bounds), null);
  assert.equal(liquidPoint(620, 801, bounds), null);
  assert.equal(liquidPoint(0, 0, { left: 0, top: 0, width: 0, height: 0 }), null);
});

test('liquid wake follows motion without a click, stays bounded and dissipates', () => {
  const wake = new LiquidWake();
  wake.move(0, 0, 0);
  assert.ok(wake.ages.every(age => age >= WAKE_LIFETIME));
  wake.move(0.1, 0.05, 32);
  assert.equal(wake.ages[0], 0);
  assert.ok(Math.abs(wake.segments[2] - 0.1) < 0.00001);
  assert.ok(Math.abs(wake.segments[3] - 0.05) < 0.00001);
  for (let i = 2; i < 100; i++) wake.move(i * 0.1, i * 0.05, i * 32);
  assert.equal(wake.segments.length, WAKE_COUNT * 4);
  assert.equal(wake.ages.length, WAKE_COUNT);
  wake.advance(3);
  assert.ok(wake.ages.every(age => age >= WAKE_LIFETIME));
});

test('stationary pointers, entry, reentry, idle and jumps do not cause splashes', () => {
  const wake = new LiquidWake();
  wake.move(0, 0, 0);
  wake.move(0, 0, 32);
  wake.move(0.1, 0.1, 500);
  wake.move(2, 2, 532);
  wake.leave();
  wake.move(-1, -1, 564);
  assert.ok(wake.ages.every(age => age >= WAKE_LIFETIME));
  wake.move(-0.9, -0.9, 596);
  assert.equal(wake.ages[0], 0);
  wake.clear();
  assert.ok(wake.segments.every(value => value === 0));
  assert.ok(wake.ages.every(age => age >= WAKE_LIFETIME));
});

test('high-frequency input accumulates distance until the next wake sample', () => {
  const wake = new LiquidWake();
  wake.move(0, 0, 0);
  for (let i = 1; i <= 24; i++) wake.move(i * 0.01, 0, i);
  assert.equal(wake.ages[0], 0);
  assert.ok(Math.abs(wake.segments[2] - 0.24) < 0.00001);
  assert.ok(wake.ages.slice(1).every(age => age >= WAKE_LIFETIME));
});
