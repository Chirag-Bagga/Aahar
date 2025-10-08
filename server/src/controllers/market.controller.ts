import type { Request, Response } from "express";
import * as svc from "../services/market.service.js";
import { upsertCartItemSchema } from "../schemas/market.js";

type ItemParams = { itemId: string };

export const marketController = {
  async listProducts(_req: Request, res: Response) {
    const products = await svc.listProducts();
    res.json({ products });
  },

  async getCart(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const out = await svc.getCart(req.user.id);
    res.json(out);
  },

  async upsertItem(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const body = upsertCartItemSchema.parse(req.body);
    const item = await svc.upsertCartItem(req.user.id, body.productId, body.qty);
    res.status(201).json({ item });
  },

  async removeItem(req: Request<ItemParams>, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { itemId } = req.params; // itemId is string here
    await svc.removeItem(req.user.id, itemId);
    res.json({ ok: true });
  }
};
