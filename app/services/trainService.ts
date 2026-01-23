import { prisma } from "../lib/prisma";

export async function upsertTrains(trainList: any[]) {
  for (const train of trainList) {
    await prisma.train.upsert({
      where: { tno: train.TNO },
      update: {
        tne: train.TNE,
        tnh: train.TNH,
        tnr: train.TNR,
        adf: train.ADF,
        sat: train.SAT ?? train.EAT,
        sdt: train.SDT ?? train.EDT,
        pno: train.PNO,
        sta: train.STA,
        ccd: train.CCD,
        colors: train.COL,
      },
      create: {
        tno: train.TNO,
        tne: train.TNE,
        tnh: train.TNH,
        tnr: train.TNR,
        adf: train.ADF,
        sat: train.SAT ?? train.EAT,
        sdt: train.SDT ?? train.EDT,
        pno: train.PNO,
        sta: train.STA,
        ccd: train.CCD,
        colors: train.COL,
      },
    });
  }
}
