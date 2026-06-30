import { AppError } from "./appError";

export function createError(message: string, statusCode: number): AppError {
  return {
    message,
    statusCode,
    isOperational: true,
  };
}
