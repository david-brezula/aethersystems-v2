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
