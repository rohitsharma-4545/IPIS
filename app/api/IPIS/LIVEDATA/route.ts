import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateRequest } from "@/app/lib/validate";
import { LiveDataSchema } from "../schemas";
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

    const validated = await validateRequest(req, LiveDataSchema);

    if (validated instanceof NextResponse) {
      return validated;
    }

    const { vendor, device, ip, pf, int, hsr, pno } = validated;

    const display = await prisma.displayDevice.findUnique({
      where: { ip },
    });

    if (!display) {
      return NextResponse.json(
        { error: "Display not registered" },
        { status: 404 },
      );
    }

    // Update display device
    await prisma.displayDevice.update({
      where: { ip },
      data: {
        vendor,
        device,
        pf,
        int,
        hsr,
        pno,
      },
    });

    const trains = await prisma.train.findMany({
      where: { pno: String(pf) },
      orderBy: { eat: "asc" },
    });

    const lastDigitOfIP = Number(ip.split(".").pop());

    const TrainList =
      device === "CGD"
        ? trains.map((t) => {
            const ccdArray = t.ccd.split(",").map((c) => c.trim());
            const key = lastDigitOfIP % ccdArray.length;

            return {
              TNO: t.tno,
              NOC: ccdArray.filter(Boolean).length,
              CCD: ccdArray[key - 2],
            };
          })
        : trains.map((t) => ({
            TNO: t.tno,
            TNE: t.tne,
            TNH: t.tnh,
            TNR: t.tnr,
            ADF: t.adf,
            EAT: t.eat,
            EDT: t.edt,
            PNO: t.pno,
            STA: t.sta,
            CCD: t.ccd,
          }));

    const lineConf = await prisma.lineConfig.findFirst();

    return NextResponse.json({
      TrainList,
      LineConf: lineConf
        ? [
            {
              INT: lineConf.int,
              PTO: lineConf.pto,
              dto: lineConf.dto,
              CHR: lineConf.chr,
              EFF: lineConf.eff,
              SPD: lineConf.spd,
              TOD: lineConf.tod,
              RST: lineConf.rst,
            },
          ]
        : [],
    });
  } catch (err) {
    console.error("IPIS LiveData error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
