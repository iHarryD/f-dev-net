import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { getImageDataURL } from "../helpers/getImageDataURL";
import baseAxiosInstance from "./baseAxiosInstance";

export async function updateUser(
  updatedUserDetails: {
    name: string;
    bio: string;
    profilePicture?: File;
  },
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: any }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const base64ImageURL = updatedUserDetails.profilePicture
      ? await getImageDataURL(updatedUserDetails.profilePicture)
      : "";
    const data = {
      name: updatedUserDetails.name,
      bio: updatedUserDetails.bio,
      media: base64ImageURL,
    };
    const result = await baseAxiosInstance().patch("/profiles", data);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}
