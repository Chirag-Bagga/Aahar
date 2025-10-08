import { prisma } from "../config/prisma";
import type { User } from "@prisma/client";

export function predictNpk(input: { n1: number; p1: number; k1: number; c1: number; hp1: number; m1: number; t1: number }) {
  // weights for soil conditions; tweak to your domain later
  // Replace this logic with model outputs
  const soilFactor = 1 + (input.c1 - 100) / 500 - (input.hp1 / 1000) + (input.m1 - 20) / 400;
  const tempFactor = 1 + (input.t1 - 25) / 200;

  const recommendedN = Math.max(0, input.n1 * 0.7 * soilFactor * tempFactor + 10);
  const recommendedP = Math.max(0, input.p1 * 0.8 * soilFactor + 5);
  const recommendedK = Math.max(0, input.k1 * 0.85 * soilFactor + 5);

  return {
    recommendedN: Number(recommendedN.toFixed(2)),
    recommendedP: Number(recommendedP.toFixed(2)),
    recommendedK: Number(recommendedK.toFixed(2)),
    modelVer: "npk-stub-0.1"
  };
}

export async function createReading(userId: string, data: {
  c1: number; hp1: number; k1: number; m1: number; n1: number; p1: number; t1: number; source: string;
}) {
  const reading = await prisma.npkReading.create({
    data: { ...data, userId }
  });
  return reading;
}

export async function listReadings(userId: string, q: { from?: Date; to?: Date; page: number; pageSize: number }) {
  const where: any = { userId };
  if (q.from || q.to) where.readAt = {};
  if (q.from) where.readAt.gte = q.from;
  if (q.to) where.readAt.lte = q.to;

  const [items, total] = await Promise.all([
    prisma.npkReading.findMany({
      where,
      orderBy: { readAt: "desc" },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize
    }),
    prisma.npkReading.count({ where })
  ]);
  return { items, total, page: q.page, pageSize: q.pageSize };
}

export async function predictFromLatest(userId: string) {
  const latest = await prisma.npkReading.findFirst({
    where: { userId },
    orderBy: { readAt: "desc" }
  });
  if (!latest) throw new Error("No readings yet");

  const { recommendedN, recommendedP, recommendedK, modelVer } = predictNpk(latest);
  const pred = await prisma.npkPrediction.create({
    data: {
      readingId: latest.id,
      recommendedN,
      recommendedP,
      recommendedK,
      modelVer
    }
  });
  return { reading: latest, prediction: pred };
}