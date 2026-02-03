import { NextResponse } from "next/server";
import { pollCdcConfig } from "@/app/services/cdcConfigPoller";

export async function POST() {
  try {
    await pollCdcConfig();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "CDC config poll failed" },
      { status: 500 },
    );
  }
}
