import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors/AppError";

type RequestLocation = "body" | "query" | "params";

export const validate = (schema: ZodSchema, location: RequestLocation = "body") => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[location]);
      Object.defineProperty(req, location, {
        value: parsed,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          rule: issue.code,
        }));
        return next(new ValidationError("Request input validation failed", details));
      }
      next(error);
    }
  };
};
