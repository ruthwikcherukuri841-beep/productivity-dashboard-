import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/AppError";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
};
