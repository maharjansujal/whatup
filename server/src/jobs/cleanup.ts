import cron from "node-cron";
import { userService } from "../modules/users/service";

export function startCleanupJobs() {
  cron.schedule("* * * * *", async () => {
    try {
      const deletedStatuses = await userService.cleanupExpiredStatuses();

      if (deletedStatuses.length > 0) {
        console.log(`Removed ${deletedStatuses.length} expired status(es).`);
      }
    } catch (error) {
      console.error("Cleanup job failed:", error);
    }
  });
}
