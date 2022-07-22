import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { Post } from "../interfaces/Common.interface";
import baseAxiosInstance from "./baseAxiosInstance";

export async function getBookmarkPosts(
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post[] }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    const result = await baseAxiosInstance().get(`/posts/bookmarks`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function addToBookmark(
  postID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post[] }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    const result = await baseAxiosInstance().post(`/posts/bookmarks`, {
      postID,
    });
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}
