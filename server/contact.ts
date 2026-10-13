import { createHash } from "node:crypto";

const scopes = ["Discovery / Strategy", "MVP / New product", "Integration / Automation", "Scaling / Modernization"];
const json = (status: number, error?: string) => Response.json(
  error ? { success: false, error } : { success: true },
  { status, headers: { "Cache-Control": "no-store" } },
);

export function createContactHandler(options: {
  apiKey: () => string | undefined;
  send?: typeof fetch;
  now?: () => number;
}) {
  const send = options.send ?? fetch;
  const now = options.now ?? Date.now;
  // A bounded, per-instance backstop; production also benefits from Vercel's firewall.
  const attempts = new Map<string, { count: number; expires: number }>();
  return async (request: Request) => {
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
    if (request.headers.get("origin") !== new URL(request.url).origin) return json(403, "origin");
    if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return json(415, "content_type");
    let data: Record<string, unknown>;
    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > 16000) return json(413, "too_large");
      data = JSON.parse(raw);
      if (!data || typeof data !== "object" || Array.isArray(data)) return json(400, "invalid");
    } catch { return json(400, "invalid"); }
    if (typeof data.website === "string" && data.website.trim()) return json(200);
    const read = (key: string, max: number, required = true) => {
      const value = data[key];
      if (!required && (value === undefined || value === "")) return "";
      return typeof value === "string" && value.trim().length <= max && (!required || value.trim()) ? value.trim() : null;
    };
    const name = read("name", 120);
    const email = read("email", 254);
    const company = read("company", 160, false);
    const scale = read("scale", 100);
    const message = read("message", 3000);
    const requestId = read("requestId", 36);
    if (!name || !email || company === null || !scale || !message || !requestId ||
      !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || /[\r\n]/.test(name + company) ||
      !scopes.includes(scale) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return json(400, "invalid");
    const apiKey = options.apiKey();
    if (!apiKey) return json(503, "unavailable");
    const time = now();
    for (const [key, entry] of attempts) if (entry.expires <= time) attempts.delete(key);
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ?? "local";
    const client = createHash("sha256").update(ip).digest("hex");
    const entry = attempts.get(client) ?? { count: 0, expires: time + 600000 };
    if (entry.count >= 5 || (!attempts.has(client) && attempts.size >= 1000)) return json(429, "rate_limited");
    entry.count++;
    attempts.set(client, entry);
    const payload = {
      from: "Aether Forms <no-reply@aethersystems.tech>",
      to: ["info@aethersystems.tech", "david.brezula@gmail.com"],
      reply_to: email,
      subject: "New project | AETHER Systems",
      text: [`Name: ${name}`, `Email: ${email}`, `Company: ${company || "-"}`, `Scope: ${scale}`, "", message].join("\n"),
    };
    // Stable retries, but changed form contents are a new message.
    const id = createHash("sha256").update(requestId + JSON.stringify(payload)).digest("hex");
    try {
      const response = await send("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `aether-contact-${id}` },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) {
        console.error("Contact provider status:", response.status);
        return json(502, "delivery_failed");
      }
      const result = await response.json();
      if (typeof result.id !== "string") return json(502, "delivery_failed");
      return json(200);
    } catch {
      console.error("Contact provider unavailable");
      return json(502, "delivery_failed");
    }
  };
}
