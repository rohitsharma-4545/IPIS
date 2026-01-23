import cron from "node-cron";
import { pollCDC } from "./cdcPoller";

export function startScheduler() {
  cron.schedule("*/5 * * * * *", async () => {
    await pollCDC();
  });
}
