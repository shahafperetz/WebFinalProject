import type { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong"
): string => {
  if (!error) return fallback;

  const axiosError = error as AxiosError<ApiErrorResponse>;

  return axiosError?.response?.data?.message || axiosError?.message || fallback;
};
