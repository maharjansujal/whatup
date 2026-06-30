import { RequestHandler } from "express";
import { z, ZodType } from "zod";

export const validate =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: z.treeifyError(result.error),
      });
    }

    req.body = result.data;
    next();
  };
