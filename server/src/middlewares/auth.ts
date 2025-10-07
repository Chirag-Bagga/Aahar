import type { NextFunction, Request, Response } from "express";
import { verifyAccess } from "../utils/tokens.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });
  try {
    const payload = verifyAccess(hdr.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
