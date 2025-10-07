import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "../../schemas/auth.js";
import { authController } from "../../controllers/auth.controller.js";
import { requireAuth } from "../../middlewares/auth.js";

const r = Router();

r.post("/register", validate({ body: registerSchema }), authController.register);
r.post("/login", validate({ body: loginSchema }), authController.login);
r.post("/refresh", authController.refresh);
r.post("/logout", authController.logout);
r.get("/me", requireAuth, authController.me);

export default r;
