import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lagos, others } = body;

    if (lagos == null || others == null) {
      return NextResponse.json({ error: "Both fees required" }, { status: 400 });
    }

    // await rtdb.set(ref(db, "deliveryFees"), { lagos, others });

    await rtdb.ref("deliveryFees").set({ lagos, others });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to set delivery fees" }, { status: 500 });
  }
}
