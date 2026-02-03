import cron from "node-cron";
import { pollCDC } from "./cdcPoller";
import { pollCdcConfig } from "./cdcConfigPoller";

export function startScheduler() {
  // cron.schedule("*/5 * * * * *", async () => {
  //   await pollCDC();
  // });
  cron.schedule("*/30 * * *", async () => {
    await pollCdcConfig();
  });
}
