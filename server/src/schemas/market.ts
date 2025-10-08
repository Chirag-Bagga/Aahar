import { z } from "zod";

export const upsertCartItemSchema = z.object({
  productId: z.string(),
  qty: z.number().int().min(1).max(999)
});
