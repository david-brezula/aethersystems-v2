import { createContactHandler } from "../server/contact";

export default { fetch: createContactHandler({ apiKey: () => process.env.RESEND_API_KEY }) };
