import axios from "axios";
import { BasicAxiosError } from "../interfaces/Common.interface";
import { axiosErrorHandler } from "./axiosErrorHandler";

export function extractErrorMessage(errorBody: unknown) {
  if (axios.isAxiosError(errorBody)) {
    return axiosErrorHandler(errorBody as BasicAxiosError);
  } else if (errorBody instanceof Error) {
    return errorBody.message;
  } else {
    return "Something went wrong.";
  }
}
