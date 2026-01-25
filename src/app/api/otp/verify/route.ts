import { NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otpStore";

export async function POST(req: Request) {
  const { phone, code } = await req.json();

  if (!phone || !code) {
    return NextResponse.json({ error: "Phone and code required" }, { status: 400 });
  }

  const ok = verifyOTP(phone, code);

  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
