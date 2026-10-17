import { createContactHandler } from "../server/contact.js";

export default { fetch: createContactHandler({ apiKey: () => process.env.RESEND_API_KEY }) };
