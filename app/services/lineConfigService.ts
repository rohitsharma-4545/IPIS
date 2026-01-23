import { prisma } from "../lib/prisma";

export async function upsertLineConfig(lineConfList: any[]) {
  if (!lineConfList.length) return;
  const lineConf = lineConfList[0];

  await prisma.lineConfig.upsert({
    where: { id: 1 },
    update: {
      int: lineConf.INT,
      pto: lineConf.PTO,
      dtp: lineConf.DTP,
      chr: lineConf.CHR,
      eff: lineConf.EFF,
      spd: lineConf.SPD,
      vid: lineConf.VID,
      img: lineConf.IMG,
      tod: lineConf.TOD,
      rst: lineConf.RST,
    },
    create: {
      id: 1,
      int: lineConf.INT,
      pto: lineConf.PTO,
      dtp: lineConf.DTP,
      chr: lineConf.CHR,
      eff: lineConf.EFF,
      spd: lineConf.SPD,
      vid: lineConf.VID,
      img: lineConf.IMG,
      tod: lineConf.TOD,
      rst: lineConf.RST,
    },
  });
}
