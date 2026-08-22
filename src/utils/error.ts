import { isAxiosError } from "axios";

type ApiErrorData = {
  error?: {
    message?: string;
  };
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<ApiErrorData>(error)) {
    return fallback;
  }

  return error.response?.data?.error?.message ?? fallback;
}
