import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { getImageDataURL } from "../helpers/getImageDataURL";
import baseAxiosInstance from "./baseAxiosInstance";

export async function getUser(
  username: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: any }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().get(`/profiles/${username}`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function updateUser(
  updatedUserDetails: {
    name: string;
    bio: string;
    image?: File;
  },
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: any }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const base64ImageURL = updatedUserDetails.image
      ? await getImageDataURL(updatedUserDetails.image)
      : "";
    const data = {
      name: updatedUserDetails.name,
      bio: updatedUserDetails.bio,
      image: base64ImageURL,
    };
    const result = await baseAxiosInstance().patch("/profiles", data);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}
