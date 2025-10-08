import cron from "node-cron";
import { prisma } from "../config/prisma.js";

// simple random walk within bounds
function jitter(v: number, pct = 0.05, min = 0, max = 300) {
  const delta = v * pct * (Math.random() * 2 - 1);
  const x = Math.min(max, Math.max(min, v + delta));
  return Number(x.toFixed(2));
}

export function startNpkIngestionJob() {
  // every 2 minutes
  cron.schedule("*/2 * * * *", async () => {
    // pick all users that have at least one reading; if none, skip
    const users = await prisma.user.findMany({
      select: { id: true },
    });
    if (users.length === 0) return;
    for (const u of users) {
      const last = await prisma.npkReading.findFirst({ where: { userId: u.id }, orderBy: { readAt: "desc" } });
      if (!last) {
        // seed a default baseline once
        await prisma.npkReading.create({
          data: {
            userId: u.id,
            c1: 154, hp1: 12, k1: 81, m1: 18, n1: 29, p1: 40, t1: 30,
            source: "ingestion"
          }
        });
      } else {
        await prisma.npkReading.create({
          data: {
            userId: u.id,
            c1: jitter(last.c1, 0.02, 100, 200),
            hp1: jitter(last.hp1, 0.05, 5, 30),
            k1: jitter(last.k1, 0.08, 20, 150),
            m1: jitter(last.m1, 0.05, 5, 40),
            n1: jitter(last.n1, 0.08, 5, 100),
            p1: jitter(last.p1, 0.08, 5, 100),
            t1: jitter(last.t1, 0.02, 10, 45),
            source: "ingestion"
          }
        });
      }
    }
    // optional: you could auto-predict after creating, if desired
  });
}
