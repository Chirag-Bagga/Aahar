import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Simulate async ML processing for now
async function simulateMl(imageKey: string) {
  // Fake label/confidence
  const labels = ["blight", "rust", "mildew", "healthy"];
  const label = labels[Math.floor(Math.random() * labels.length)];
  const confidence = Number((0.6 + Math.random() * 0.4).toFixed(2));
  return { label, confidence, modelVer: "disease-stub-0.1" };
}

export const diseaseController = {
  async createReport(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const imageKey = req.body?.imageKey as string;
    if (!imageKey) return res.status(400).json({ message: "imageKey is required" });

    const report = await prisma.diseaseReport.create({
      data: { userId: req.user.id, imageKey, status: "PENDING" }
    });

    // Async "worker": process in background (stub). Replace with Azure Queue/Worker later.
    setTimeout(async () => {
      try {
        const { label, confidence, modelVer } = await simulateMl(imageKey);
        await prisma.diseaseReport.update({
          where: { id: report.id },
          data: { status: "DONE", label, confidence, modelVer }
        });
      } catch {
        await prisma.diseaseReport.update({ where: { id: report.id }, data: { status: "FAILED" } });
      }
    }, 1500);

    return res.status(202).json({ reportId: report.id, status: report.status });
  },

  async getReport(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const id = req.params.id;
    const report = await prisma.diseaseReport.findFirst({ where: { id, userId: req.user.id } });
    if (!report) return res.status(404).json({ message: "Not found" });
    return res.json({ report });
  }
};
