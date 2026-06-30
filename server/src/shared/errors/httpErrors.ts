import { createError } from "./createError";

export const conflict = (msg = "Conflict") => createError(msg, 409);

export const badRequest = (msg = "Bad Request") => createError(msg, 400);

export const unauthorized = (msg = "Unauthorized") => createError(msg, 401);

export const notFound = (msg = "Not Found") => createError(msg, 404);
