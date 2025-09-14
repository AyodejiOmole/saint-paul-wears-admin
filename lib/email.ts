// import nodemailer from "nodemailer";
// import { rtdb } from "@/lib/firebaseAdmin";

// const smtpHost = process.env.SMTP_HOST!;
// const smtpPort = Number(process.env.SMTP_PORT || 587);
// const smtpUser = process.env.SMTP_USER!;
// const smtpPass = process.env.SMTP_PASS!;
// const emailFrom = process.env.EMAIL_FROM!;

// if (!smtpHost || !smtpUser || !smtpPass || !emailFrom) {
//   console.warn("SMTP env not fully configured. Newsletter sending will fail until configured.");
// }

// const transporter = nodemailer.createTransport({
//   host: smtpHost,
//   port: smtpPort,
//   secure: smtpPort === 465, // true for 465, false for 587/other
//   auth: {
//     user: smtpUser,
//     pass: smtpPass,
//   },
//   pool: true,            // use pooled connections
//   maxConnections: 5,     // concurrent SMTP connections
//   maxMessages: 1000,     // total messages per connection (not enforced by all providers)
// });

// type SendNewsletterOpts = {
//   subject: string;
//   html: string; // newsletter HTML
//   plain?: string; // optional plain text fallback
//   recipients: string[]; // array of emails
//   batchSize?: number; // default 20
//   delayMsBetweenBatches?: number; // default 1000 (1s)
//   concurrency?: number; // number of parallel sends (default 5)
// };

// async function sleep(ms: number) {
//   return new Promise((res) => setTimeout(res, ms));
// }

// export async function sendNewsletter(opts: SendNewsletterOpts) {
//   const {
//     subject,
//     html,
//     plain,
//     recipients,
//     batchSize = 20,
//     delayMsBetweenBatches = 1000,
//     concurrency = 5,
//   } = opts;

//   // split recipients into batches
//   const batches: string[][] = [];
//   for (let i = 0; i < recipients.length; i += batchSize) {
//     batches.push(recipients.slice(i, i + batchSize));
//   }

//   const results: Array<{ email: string; ok: boolean; info?: any; error?: string }> = [];

//   for (let bi = 0; bi < batches.length; bi++) {
//     const batch = batches[bi];

//     // send batch with limited concurrency
//     const workers: Promise<void>[] = [];
//     let idx = 0;

//     const sendOne = async (email: string) => {
//       try {
//         const info = await transporter.sendMail({
//           from: emailFrom,
//           to: email,
//           subject,
//           text: plain || undefined,
//           html,
//         });
//         results.push({ email, ok: true, info });
//         // log in DB (mailLogs)
//         await rtdb.ref(`mailLogs/${Date.now()}_${Math.random().toString(36).slice(2)}`).set({
//           email,
//           subject,
//           status: "sent",
//           info,
//           createdAt: Date.now(),
//         });
//       } catch (err: any) {
//         console.error("Mail send failed for", email, err?.message || err);
//         results.push({ email, ok: false, error: err?.message || String(err) });
//         await rtdb.ref(`mailLogs/${Date.now()}_${Math.random().toString(36).slice(2)}`).set({
//           email,
//           subject,
//           status: "failed",
//           error: err?.message || String(err),
//           createdAt: Date.now(),
//         });
//       }
//     };

//     // simple concurrency pool
//     for (let i = 0; i < Math.min(concurrency, batch.length); i++) {
//       const worker = (async function workerLoop() {
//         while (idx < batch.length) {
//           const cur = batch[idx++];
//           await sendOne(cur);
//         }
//       })();
//       workers.push(worker);
//     }

//     // wait for batch sends to finish
//     await Promise.all(workers);

//     // small delay between batches to avoid throttling
//     if (bi < batches.length - 1) {
//       await sleep(delayMsBetweenBatches);
//     }
//   }

//   return results;
// }
