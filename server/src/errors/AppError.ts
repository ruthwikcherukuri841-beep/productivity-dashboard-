export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any[];
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_SERVER_ERROR",
    details?: any[]
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", details?: any[]) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource", id?: string) {
    const message = id ? `${resource} with ID '${id}' was not found` : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict detected", details?: any[]) {
    super(message, 409, "CONFLICT", details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: any[]) {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}
