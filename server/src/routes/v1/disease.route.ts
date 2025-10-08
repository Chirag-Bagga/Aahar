import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { diseaseController } from "../../controllers/disease.controller.js";

const r = Router();
r.use(requireAuth);

r.post("/reports", diseaseController.createReport);
r.get("/reports/:id", diseaseController.getReport);

export default r;
