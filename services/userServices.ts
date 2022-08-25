import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { User, UserWithStats } from "../interfaces/Common.interface";
import baseAxiosInstance from "./baseAxiosInstance";

export async function updateSavedUserData(): Promise<
  AxiosResponse<{ message: string; data: UserWithStats }>
> {
  return await baseAxiosInstance().get("/profiles");
}

export async function searchUsers(
  query: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{
      message: string;
      data: User[];
    }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().get(`/users/search/${query}`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}
