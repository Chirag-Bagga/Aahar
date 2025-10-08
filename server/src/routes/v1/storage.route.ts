import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { storageController } from "../../controllers/storage.controller.js";

const r = Router();
r.use(requireAuth);
r.post("/presign", storageController.presign);
export default r;
    