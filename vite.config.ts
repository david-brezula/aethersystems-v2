import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createContactHandler } from "./server/contact";

export default defineConfig(({ mode }) => ({
  plugins: [react(), {
    name: "local-contact-api",
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");
      const handler = createContactHandler({ apiKey: () => env.RESEND_API_KEY });
      server.middlewares.use("/api/contact", async (req, res) => {
        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            const buffer = Buffer.from(chunk);
            size += buffer.length;
            if (size > 16000) { res.writeHead(413); res.end(); return; }
            chunks.push(buffer);
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(",") : value);
          headers.set("x-vercel-forwarded-for", req.socket.remoteAddress ?? "local");
          const response = await handler(new Request(`http://${req.headers.host}/api/contact`, {
            method: req.method, headers,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
          }));
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(await response.text());
        } catch { res.writeHead(500); res.end('{"success":false}'); }
      });
    },
  }],
  build: {
    rollupOptions: {
      output: { manualChunks: { three: ["three"] } },
    },
  },
}));
