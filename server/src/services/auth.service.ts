import argon2 from "argon2";
import { prisma } from "../config/prisma.js";
import { newJti, signAccessToken, signRefreshToken, verifyRefresh } from "../utils/tokens.js";

export async function registerUser(phone: string, password: string, name?: string) {
  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { phone, passwordHash, name },
  });
  return user;
}

export async function loginUser(phone: string, password: string, userAgent?: string, ip?: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw new Error("Invalid credentials");

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) throw new Error("Invalid credentials");

  const jti = newJti();
  await prisma.session.create({
    data: { userId: user.id, refreshJti: jti, userAgent, ip },
  });

  const access = signAccessToken(user.id, user.role);
  const refresh = signRefreshToken(user.id, jti);

  return { user, access, refresh };
}

export async function me(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, phone: true, name: true, role: true, createdAt: true } });
}

export async function refreshTokens(refreshToken: string, userAgent?: string, ip?: string) {
  const payload = verifyRefresh(refreshToken); // throws if invalid/expired
  const session = await prisma.session.findUnique({ where: { refreshJti: payload.jti } });
  if (!session || session.revokedAt) throw new Error("Refresh invalid");

  // rotate: revoke old, create new
  const newJ = newJti();
  await prisma.$transaction([
    prisma.session.update({ where: { refreshJti: payload.jti }, data: { revokedAt: new Date() } }),
    prisma.session.create({ data: { userId: payload.sub, refreshJti: newJ, userAgent, ip } }),
  ]);

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  const access = signAccessToken(payload.sub, user?.role);
  const refresh = signRefreshToken(payload.sub, newJ);
  return { access, refresh, user };
}

export async function logout(refreshToken: string) {
  try {
    const payload = verifyRefresh(refreshToken);
    await prisma.session.update({
      where: { refreshJti: payload.jti },
      data: { revokedAt: new Date() },
    });
  } catch {
    // token invalid/expired: nothing to do
  }
}
