import { Router } from "express";
import health from "./v1/health.route.js";
import auth from "./v1/auth.route.js";

const router = Router();
router.use("/v1/health", health);
router.use("/v1/auth", auth);

export default router;
