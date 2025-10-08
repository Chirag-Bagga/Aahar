import { Router } from "express";
import { marketController } from "../../controllers/market.controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { upsertCartItemSchema } from "../../schemas/market.js";

const r = Router();

r.get("/products", marketController.listProducts);
r.get("/cart", requireAuth, marketController.getCart);
r.post("/cart/item", requireAuth, validate({ body: upsertCartItemSchema }), marketController.upsertItem);
r.delete("/cart/item/:itemId", requireAuth, marketController.removeItem);

export default r;
