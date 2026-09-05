import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { config } from "../config";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected server error occurred";
  let details: any[] | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof SyntaxError && "body" in err) {
    // Malformed JSON body
    statusCode = 400;
    code = "MALFORMED_JSON";
    message = "The request body contains invalid JSON syntax";
  } else if (err?.name === "CastError") {
    statusCode = 400;
    code = "INVALID_IDENTIFIER";
    message = `Invalid identifier format: ${err.value}`;
  } else {
    // Unexpected Error
    if (config.isDev && !config.isTest) {
      console.error("💥 Unhandled Error:", err);
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl || req.url,
    },
  });
};
