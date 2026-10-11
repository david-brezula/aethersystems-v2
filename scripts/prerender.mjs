import { build } from "esbuild";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";

const temp = path.resolve("node_modules/.cache/aether-prerender");
await mkdir(temp, { recursive: true });
await build({
  entryPoints: ["src/App.tsx", "src/pages.ts"],
  outdir: temp,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  jsx: "automatic",
});
const { default: App } = await import(pathToFileURL(path.join(temp, "App.js")));
const { pages } = await import(pathToFileURL(path.join(temp, "pages.js")));
const template = await readFile("dist/index.html", "utf8");
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const route of ["/", ...pages.map((page) => page.path), "/404"]) {
  const page = pages.find((page) => page.path === route);
  const title = page
    ? `${page.title.sk} ${page.strong.sk} | AETHER Systems`
    : route === "/"
      ? "AETHER Systems | Vaša vízia. Náš systém."
      : "404 | AETHER Systems";
  const content = renderToString(
    React.createElement(App, { initialPath: route }),
  );
  let html = template
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
    .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`);
  if (page)
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/s,
      `<meta name="description" content="${escape(page.intro.sk)}" />`,
    );
  const directory = route === "/" ? "dist" : path.join("dist", route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
  if (route === "/404") await writeFile("dist/404.html", html);
}
await writeFile(
  "dist/routes.json",
  JSON.stringify(["/", ...pages.map((page) => page.path)], null, 2),
);
await rm(temp, { recursive: true, force: true });
console.log(`Prerendered ${pages.length + 1} pages and a 404 document.`);
