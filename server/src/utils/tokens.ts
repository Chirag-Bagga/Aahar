import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env"

type AccessPayload  = { sub: string; role?: string };
type RefreshPayload = { sub: string; jti: string };

// --- read & validate secrets once ---
const ACCESS_SECRET: Secret  = process.env.JWT_ACCESS_SECRET ?? "";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET ?? "";
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not set (JWT_ACCESS_SECRET / JWT_REFRESH_SECRET).");
}

// ExpiresIn can be number | string
const ACCESS_TTL  = (process.env.ACCESS_TTL  ?? "15m") as SignOptions["expiresIn"];
const REFRESH_TTL = (process.env.REFRESH_TTL ?? "7d")  as SignOptions["expiresIn"];

export function newJti(): string {
  return crypto.randomUUID();
}

export function signAccessToken(userId: string, role?: string): string {
  const payload: AccessPayload = { sub: userId };
  if (role) payload.role = role;

  const opts: SignOptions = {
    expiresIn: ACCESS_TTL,
    algorithm: "HS256",            // force a real algorithm
  };

  return jwt.sign(payload, ACCESS_SECRET, opts);
}

export function signRefreshToken(userId: string, jti: string): string {
  const payload: RefreshPayload = { sub: userId, jti };

  const opts: SignOptions = {
    expiresIn: REFRESH_TTL,
    algorithm: "HS256",
  };

  return jwt.sign(payload, REFRESH_SECRET, opts);
}

export function verifyAccess(token: string): AccessPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessPayload;
}

export function verifyRefresh(token: string): RefreshPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
}
