import axios from "axios";
import { prisma } from "../lib/prisma";
import { CDC_CONFIG } from "../config/cdc";
import { upsertTrains } from "./trainService";
import { upsertLineConfig } from "./lineConfigService";
import { CdcResponseSchema } from "./schemas";

const PLATFORM = "2";

export async function pollCDC() {
  try {
    const pdcDevice = await prisma.pdcDevice.findUnique({
      where: {
        pf: PLATFORM,
      },
    });

    if (!pdcDevice) {
      throw new Error(`No PDC device found for platform ${PLATFORM}`);
    }

    const displayDevices = await prisma.displayDevice.findMany({
      where: { pf: PLATFORM },
    });

    const payload = {
      Device: [
        {
          vendor: pdcDevice.vendor,
          device: pdcDevice.device,
          IP: pdcDevice.ip,
          PF: pdcDevice.pf,
          TotalDB: displayDevices.length,
        },
      ],
      DisplayList: displayDevices.map((d) => ({
        vendor: d.vendor,
        device: d.device,
        IP: d.ip,
        INT: d.int,
        HSR: d.hsr,
      })),
    };
    const url = `http://${CDC_CONFIG.IP}:${CDC_CONFIG.PORT}/IPIS/LiveData`;

    const { data } = await axios.post(url, payload, {
      timeout: 4000,
      headers: {
        Station_Code: CDC_CONFIG.STATION_CODE,
      },
    });

    const parsed = CdcResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.warn("CDC sent invalid data, using defaults");
    }

    const fixed = CdcResponseSchema.parse(data);

    const { TrainList, LineConf } = fixed;

    await Promise.all([upsertTrains(TrainList), upsertLineConfig(LineConf)]);

    console.log("✅ CDC polled successfully:", new Date().toISOString());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "❌ CDC poll failed:",
        error.response?.data || error.message,
      );
    } else {
      console.error("❌ CDC poll failed:", error);
    }
  }
}
