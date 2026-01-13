import cron from "node-cron";
import { prisma } from "../lib/prisma.js";


export function startReminderWorker() {
  // Every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    const due = await prisma.reminder.findMany({
      where: { sentAt: null, remindAt: { lte: now } },
      take: 50
    });

    if (!due.length) return;

    for (const r of due) {
      // Mark sent (in-app)
      await prisma.reminder.update({
        where: { id: r.id },
        data: { sentAt: new Date() }
      });
    }
  });
}
