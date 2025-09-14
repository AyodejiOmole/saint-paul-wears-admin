// app/api/admin/subscribers/route.ts
import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebaseAdmin";
// import { verifyAdminRequest } from "@/lib/adminAuth";

export async function GET(req: Request) {
  // require admin
//   const ok = await verifyAdminRequest(req);
//   if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const snap = await rtdb.ref("subscribers").get();
    if (!snap.exists()) return NextResponse.json({ subscribers: [] });
    const data = snap.val();
    const subs = Object.values(data).map((v: any) => v.email);
    return NextResponse.json({ subscribers: subs });
  } catch (err: any) {
    console.error("List subscribers error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
