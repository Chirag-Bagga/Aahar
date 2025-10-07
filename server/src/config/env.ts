// server/src/config/env.ts
import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  // JWT/session
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET too short"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET too short"),
  ACCESS_TTL: z.string().default("15m"),
  REFRESH_TTL: z.string().default("7d"),
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z.enum(["true", "false"]).default("false"),

  // DB (Prisma also reads this, but keep for completeness)
  DATABASE_URL: z.string().url().or(z.string().startsWith("mysql://")),
});

export const env = EnvSchema.parse(process.env);
