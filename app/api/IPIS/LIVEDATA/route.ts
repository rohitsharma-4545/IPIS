import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateRequest } from "@/app/lib/validate";
import { DisplayLiveDataSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const validated = await validateRequest(req, DisplayLiveDataSchema);

    if (validated instanceof NextResponse) {
      return validated;
    }

    const { vendor, device, ip, pf, int, hsr } = validated;

    const displayDevice = await prisma.displayDevice.findFirst({
      where: {
        vendor,
        device,
        ip,
        pf: String(pf),
        int,
        hsr,
      },
    });

    if (!displayDevice) {
      return NextResponse.json(
        { error: "No display device present with the provided details" },
        { status: 404 },
      );
    }

    // 1️⃣ Register / Update display device
    // await prisma.displayDevice.upsert({
    //   where: { ip: ip },
    //   update: {
    //     vendor,
    //     device,
    //     pf: String(pf),
    //     int: int,
    //     hsr: hsr,
    //   },
    //   create: {
    //     vendor,
    //     device,
    //     ip: ip,
    //     pf: String(pf),
    //     int: int,
    //     hsr: hsr,
    //   },
    // });

    const trains = await prisma.train.findMany({
      where: { pno: String(pf) },
      orderBy: { sat: "asc" },
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
              CCD: ccdArray[key],
            };
          })
        : trains.map((t) => ({
            TNO: t.tno,
            TNE: t.tne,
            TNH: t.tnh,
            TNR: t.tnr,
            ADF: t.adf,
            SAT: t.sat,
            SDT: t.sdt,
            PNO: t.pno,
            STA: t.sta,
            CCD: t.ccd,
            COL: t.colors,
          }));

    const lineConf = await prisma.lineConfig.findFirst();

    return NextResponse.json({
      TrainList,
      LineConf: lineConf
        ? [
            {
              INT: lineConf.int,
              PTO: lineConf.pto,
              DTP: lineConf.dtp,
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
