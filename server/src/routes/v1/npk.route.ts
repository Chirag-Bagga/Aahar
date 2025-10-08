import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { npkController } from "../../controllers/npk.controller.js";
import { validate } from "../../middlewares/validate.js";
import { npkInputSchema, listReadingsQuery } from "../../schemas/npk.js";

const r = Router();
r.use(requireAuth);

r.post("/readings", validate({ body: npkInputSchema }), npkController.create);
r.get("/readings", validate({ query: listReadingsQuery }), npkController.list);
r.post("/predict", npkController.predict);

export default r;
