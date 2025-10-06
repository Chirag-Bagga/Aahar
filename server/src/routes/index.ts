import { Router } from "express";
import health from "./v1/health.route.js";
const router = Router();

router.use("/v1/health", health);

export default router;
