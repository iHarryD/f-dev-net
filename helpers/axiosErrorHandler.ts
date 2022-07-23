import { BasicAxiosError } from "../interfaces/Common.interface";

export function axiosErrorHandler(errorBody: BasicAxiosError) {
  const errorMessage = errorBody.response?.data?.message;
  if (errorMessage) return errorMessage;
  switch (errorBody.response?.status) {
    case 400:
      return "Data validation failed.";
    case 401:
      return "You need to login.";
    case 403:
      return "Prohibited action.";
    case 404:
      return "Requested data not found.";
    case 408:
      return "Request timeout. Try again later.";
    default:
      return "Something went wrong.";
  }
}
