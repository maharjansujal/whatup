import { Request, Response, NextFunction } from "express";

type AppErrorShape = {
  message: string;
  statusCode: number;
  isOperational: true;
};

function isAppError(err: unknown): err is AppErrorShape {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as any).isOperational === true &&
    typeof (err as any).statusCode === "number"
  );
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}
