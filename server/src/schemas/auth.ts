import { z } from "zod";

export const registerSchema = z.object({
  phone: z.string().min(8, "Phone required"),
  password: z.string().min(6, "Min 6 chars"),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  phone: z.string().min(8),
  password: z.string().min(6),
});
