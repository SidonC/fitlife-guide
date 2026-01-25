import { NextResponse } from "next/server";
import { createOTP } from "@/lib/otpStore";

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const code = createOTP(phone);

  console.log("OTP para", phone, ":", code);

  return NextResponse.json({ ok: true });
}
