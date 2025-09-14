import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebaseAdmin";
// import { verifyAdminRequest } from "@/lib/adminAuth";
// import { sendNewsletter } from "@/lib/email";

export async function POST(req: Request) {
//   const ok = await verifyAdminRequest(req);
//   if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { subject, html, plain } = body;
    if (!subject || !html) return NextResponse.json({ error: "subject and html required" }, { status: 400 });

    // read subscribers
    const snap = await rtdb.ref("subscribers").get();
    const subsData = snap.exists() ? snap.val() : {};
    const emails = Object.values(subsData).map((s: any) => s.email).filter(Boolean);

    if (emails.length === 0) return NextResponse.json({ ok: true, note: "no-subscribers" });

    // send newsletter with safe defaults (batch & delays)
    // const results = await sendNewsletter({
    //   subject,
    //   html,
    //   plain,
    //   recipients: emails,
    //   batchSize: 30,
    //   delayMsBetweenBatches: 1500,
    //   concurrency: 5,
    // });

    return NextResponse.json({ ok: true });
    // return NextResponse.json({ ok: true, resultsCount: results.length, results });
  } catch (err: any) {
    console.error("Send newsletter error:", err);
    return NextResponse.json({ error: err.message || "Internal" }, { status: 500 });
  }
}
