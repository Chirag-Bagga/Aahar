import type { Response, CookieOptions } from "express";

export function setRefreshCookie(res: Response, token: string) {
  const secure = process.env.COOKIE_SECURE === "true";
  const domain = process.env.COOKIE_DOMAIN || "localhost";
  const opts: CookieOptions = {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    domain,
    path: "/",
    // let the JWT control expiry; cookie maxAge is optional
  };
  res.cookie("refresh_token", token, opts);
}

export function clearRefreshCookie(res: Response) {
  const secure = process.env.COOKIE_SECURE === "true";
  const domain = process.env.COOKIE_DOMAIN || "localhost";
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    domain,
    path: "/",
  });
}
