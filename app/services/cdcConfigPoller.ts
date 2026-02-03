import axios from "axios";
import { prisma } from "../lib/prisma";
import { CDC_CONFIG } from "../config/cdc";
import { CdcConfigResponseSchema } from "./schemas";
import { resolveDeviceTypeFromIP } from "./deviceResolver";

const PLATFORM = "2";

export async function pollCdcConfig() {
  try {
    const pdc = await prisma.pdcDevice.findUnique({
      where: { pf: PLATFORM },
    });

    if (!pdc) throw new Error("PDC not registered");

    const payload = {
      vendor: pdc.vendor,
      device: "PDC",
      IP: pdc.ip,
    };

    const url = `http://${CDC_CONFIG.IP}:${CDC_CONFIG.PORT}/IPIS/ConfData`;

    const { data } = await axios.post(url, payload, {
      timeout: 4000,
      headers: {
        Station_Code: CDC_CONFIG.STATION_CODE,
      },
    });

    const parsed = CdcConfigResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.log("CDC sent invalid data, using defaults");
    }

    const fixed = CdcConfigResponseSchema.parse(data);

    const { DeviceList, DevConf } = fixed;

    const nod = DeviceList.find((d) => "NOD" in d)?.NOD ?? 0;

    const devices = DeviceList.filter((d) => "IP" in d) as any[];

    for (const d of devices) {
      const deviceType = resolveDeviceTypeFromIP(d.IP);
      await prisma.displayDevice.upsert({
        where: { ip: d.IP },
        update: {
          int: d.INT,
          pno: d.PNO,
        },
        create: {
          vendor: pdc.vendor,
          device: deviceType,
          ip: d.IP,

          pf: pdc.pf,
          pno: d.PNO,

          int: d.INT,
          hsr: "ALL OK",
        },
      });
    }

    await prisma.pdcConfig.upsert({
      where: { id: 1 },
      update: {
        nod,
        tod: DevConf[0].TOD,
        rst: DevConf[0].RST,
      },
      create: {
        id: 1,
        nod,
        tod: DevConf[0].TOD,
        rst: DevConf[0].RST,
      },
    });

    console.log("✅ CDC Config synced");
  } catch (err) {
    console.error("❌ CDC Config poll failed", err);
  }
}
