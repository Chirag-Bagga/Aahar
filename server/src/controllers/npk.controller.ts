import type { Request, Response } from "express";
import { npkInputSchema, listReadingsQuery } from "../schemas/npk.js";
import * as svc from "../services/npk.service.js";

export const npkController = {
  async create(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const body = npkInputSchema.parse(req.body);
    const reading = await svc.createReading(req.user.id, body);
    return res.status(201).json({ reading });
  },

  async list(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const q = listReadingsQuery.parse(req.query);
    const out = await svc.listReadings(req.user.id, q);
    return res.json(out);
  },

  async predict(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const out = await svc.predictFromLatest(req.user.id);
    return res.json(out);
  }
};
