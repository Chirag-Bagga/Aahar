import { z } from "zod";

export const npkInputSchema = z.object({
    c1: z.number(),
    hp1: z.number(),
    k1: z.number(),
    m1: z.number(),
    n1: z.number(),
    p1: z.number(),
    t1: z.number(),
    source: z.string().default("manual")
});

export const listReadingsQuery = z.object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20)
});