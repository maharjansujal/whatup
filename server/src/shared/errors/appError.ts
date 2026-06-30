export type AppError = {
  message: string;
  statusCode: number;
  isOperational: true;
};

export function createAppError(
  message: string,
  statusCode: number,
): AppError & Error {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  error.isOperational = true;

  return error;
}
