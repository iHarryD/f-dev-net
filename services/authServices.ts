import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { UserWithStats } from "../interfaces/Common.interface";
import baseAxiosInstance from "./baseAxiosInstance";

export async function login(
  userCredentials: { username: string; password: string },
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{
      message: string;
      data: { user: UserWithStats; token: string };
    }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().post(
      "/auth/login",
      userCredentials
    );
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function signup(
  userCredentials: {
    name: string;
    email: string;
    username: string;
    password: string;
  },
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{
      message: string;
      data: { user: UserWithStats; token: string };
    }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().post(
      "/auth/signup",
      userCredentials
    );
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}
