import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.js";
import * as auth from "../services/auth.service.js";
import { setRefreshCookie, clearRefreshCookie } from "../utils/cookies.js";

export const authController = {
  async register(req: Request, res: Response) {
    const { phone, password, name } = registerSchema.parse(req.body);
    const user = await auth.registerUser(phone, password, name);
    return res.status(201).json({ user: { id: user.id, phone: user.phone, name: user.name, role: user.role } });
  },

  async login(req: Request, res: Response) {
    const { phone, password } = loginSchema.parse(req.body);
    const ua = req.headers["user-agent"];
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || undefined;

    const { user, access, refresh } = await auth.loginUser(phone, password, ua, ip);
    setRefreshCookie(res, refresh);
    return res.json({ accessToken: access, user: { id: user.id, phone: user.phone, name: user.name, role: user.role } });
  },

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.["refresh_token"];
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    const ua = req.headers["user-agent"];
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || undefined;

    const { access, refresh, user } = await auth.refreshTokens(token, ua, ip);
    setRefreshCookie(res, refresh);
    return res.json({ accessToken: access, user: { id: user?.id, phone: user?.phone, name: user?.name, role: user?.role } });
  },

  async logout(req: Request, res: Response) {
    const token = req.cookies?.["refresh_token"];
    if (token) await auth.logout(token);
    clearRefreshCookie(res);
    return res.json({ ok: true });
  },

  async me(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
    const user = await auth.me(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  },
};
