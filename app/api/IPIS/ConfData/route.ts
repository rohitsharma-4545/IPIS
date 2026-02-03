import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ConfDataSchema } from "../schemas";
import { validateRequest } from "@/app/lib/validate";
import { CDC_CONFIG } from "@/app/config/cdc";

export async function POST(req: Request) {
  try {
    const stationCode = req.headers.get("Station_Code");

    if (stationCode !== CDC_CONFIG.STATION_CODE) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid Station Code" },
        { status: 401 },
      );
    }

    const validated = await validateRequest(req, ConfDataSchema);

    if (validated instanceof NextResponse) {
      return validated;
    }

    const { ip } = validated;

    const display = await prisma.displayDevice.findUnique({
      where: { ip },
    });

    if (!display) {
      return NextResponse.json(
        { error: "Display not registered" },
        { status: 404 },
      );
    }

    const config = await prisma.pdcConfig.findFirst();

    return NextResponse.json({
      DeviceList: [
        { NOD: 1 },
        {
          IP: ip,
          INT: display.int,
          PNO: display.pno,
        },
      ],
      DevConf: [
        {
          TOD: config?.tod ?? "00:00:00",
          RST: config?.rst ?? "N",
        },
      ],
    });
  } catch (error) {
    console.error("❌ ConfData POST failed:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
