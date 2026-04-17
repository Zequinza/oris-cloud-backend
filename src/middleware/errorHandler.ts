import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: error.errors,
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
  });
};
