import cron from "node-cron";
import { userService } from "../modules/users/service";
import { getIO } from "../socket";
import { SOCKET_EVENTS } from "../socket/socket_events";

export function startCleanupJobs() {
  cron.schedule("* * * * *", async () => {
    try {
      const deletedStatuses = await userService.cleanupExpiredStatuses();
      deletedStatuses.forEach(({ user_id }) => {
        getIO().emit(SOCKET_EVENTS.STATUS_CLEAR, {
          userId: user_id,
        });
      });

      if (deletedStatuses.length > 0) {
        console.log(`Removed ${deletedStatuses.length} expired status(es).`);
      }
    } catch (error) {
      console.error("Cleanup job failed:", error);
    }
  });
}
