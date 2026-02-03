import { NextResponse } from "next/server";
import { pollCDC } from "@/app/services/cdcPoller";

export async function POST() {
  try {
    await pollCDC();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "CDC poll failed" },
      { status: 500 },
    );
  }
}
