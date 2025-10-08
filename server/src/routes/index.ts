import { Router } from "express";
import health from "./v1/health.route.js";
import auth from "./v1/auth.route.js";
import npk from "./v1/npk.route.js";
import storage from "./v1/storage.route.js";
import disease from "./v1/disease.route.js";
import market from "./v1/market.route.js";

const router = Router();

router.use("/v1/health", health);
router.use("/v1/auth", auth);
router.use("/v1/npk", npk);
router.use("/v1/storage", storage);
router.use("/v1/disease", disease);
router.use("/v1/market", market);

export default router;
