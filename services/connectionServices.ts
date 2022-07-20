import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import baseAxiosInstance from "./baseAxiosInstance";

export async function initiateConnection(
  otherUserUsername: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: any }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().post("/connections", {
      otherUser: otherUserUsername,
    });
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function acceptConnection(
  otherUserUsername: string,
  connectionID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: any }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().patch(
      `/connections/${connectionID}`,
      { otherUser: otherUserUsername }
    );
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}
