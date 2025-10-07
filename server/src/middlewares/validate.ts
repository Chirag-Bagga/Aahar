import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";
import type { ParsedQs } from "qs";
import type { ParamsDictionary } from "express-serve-static-core";

export const validate =
  (schema: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body)   req.body   = schema.body.parse(req.body);
      if (schema.query)  req.query  = schema.query.parse(req.query)   as unknown as ParsedQs;
      if (schema.params) req.params = schema.params.parse(req.params)  as unknown as ParamsDictionary;
      next();
    } catch (e: any) {
      return res.status(400).json({ message: "Validation error", issues: e?.errors ?? e });
    }
  };
