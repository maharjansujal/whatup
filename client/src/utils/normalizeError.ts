import axios from "axios";

type ApiError = {
  message?: string;
};

export function normalizeError(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    return (
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
