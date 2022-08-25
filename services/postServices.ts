import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { getImageDataURL } from "../helpers/getImageDataURL";
import {
  Post,
  PostCategories,
  PostSortingOptions,
  UpdatePost,
  UserPostFilter,
} from "../interfaces/Common.interface";
import baseAxiosInstance from "./baseAxiosInstance";

export async function getPosts(
  sortedBy: PostSortingOptions,
  filterBy?: PostCategories,
  user?: string,
  userRelationQuery?: UserPostFilter,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post[] }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().get(
      `/posts?sort=${sortedBy}${filterBy ? `&filter=${filterBy}` : ""}${
        user ? `&user=${user}` : ""
      }${userRelationQuery ? `&relation=${userRelationQuery}` : ""}`
    );
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function getPost(
  postID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().get(`/posts/${postID}`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function createNewPost(
  postDetails: {
    caption: string;
    category: PostCategories;
    media?: File;
  },
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const base64ImageURL = postDetails.media
      ? await getImageDataURL(postDetails.media)
      : "";
    const data = {
      caption: postDetails.caption,
      category: postDetails.category,
      media: base64ImageURL,
    };
    const result = await baseAxiosInstance().post("/posts", data);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function updatePost(
  postID: string,
  postDetails: UpdatePost,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const data: {
      caption?: string;
      category?: PostCategories;
      media?: string | null;
    } = {};
    if (postDetails.caption) data.caption = postDetails.caption;
    if (postDetails.category) data.category = postDetails.category;
    if (postDetails.media || postDetails.media === null) {
      if (postDetails.media) {
        data.media = (await getImageDataURL(postDetails.media)) as string;
      } else {
        data.media = null;
      }
    }
    const result = await baseAxiosInstance().patch(`/posts/${postID}`, data);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function likePost(
  postID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().post(`/posts/${postID}/likes`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function unlikePost(
  postID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().delete(`/posts/${postID}/likes`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function postComment(
  comment: string,
  postID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().post(`/posts/${postID}/comments`, {
      comment,
    });
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function deletePost(
  postID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: null }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().delete(`/posts/${postID}`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}

export async function toggleComments(
  postID: string,
  loadingState?: Dispatch<SetStateAction<boolean>>,
  successCallback?: (
    result: AxiosResponse<{ message: string; data: Post }>
  ) => void,
  failureCallback?: (err: unknown) => void
) {
  try {
    if (loadingState) loadingState(true);
    const result = await baseAxiosInstance().patch(`/posts/${postID}/comments`);
    if (successCallback) successCallback(result);
  } catch (err) {
    if (failureCallback) failureCallback(err);
  } finally {
    if (loadingState) loadingState(false);
  }
}
