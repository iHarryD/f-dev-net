import {
  faBookmark as faRBookmark,
  faComment,
  faHeart as faRHeart,
} from "@fortawesome/free-regular-svg-icons";
import {
  faShareNodes,
  faHeart as faSHeart,
  faBookmark as faSBookmark,
  faUpload,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import postCardStyles from "./PostCard.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import {
  Post,
  PostCategories,
  UpdatePost,
} from "../../interfaces/Common.interface";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import CommentBox from "../commentBox/CommentBox";
import {
  deletePost,
  likePost,
  postComment,
  toggleComments,
  unlikePost,
  updatePost,
} from "../../services/postServices";
import { useDispatch, useSelector } from "react-redux";
import { deletePost as deletePostAction } from "../../features/postSlice";
import UsernameLink from "../usernameLink/UsernameLink";
import Tooltip from "../tooltip/Tooltip";
import {
  addToBookmark,
  removeFromBookmark,
} from "../../services/bookmarkServices";
import { AppDispatch, RootState } from "../../store";
import { updateUser } from "../../features/userSlice";
import Image from "next/image";
import PostCategoryDropdown from "../postCategoryDropdown/PostCategoryDropdown";
import { isImage } from "../../helpers/isImage";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../../helpers/extractErrorMessage";
import { toastEmitterConfig } from "../../data/toastEmitterConfig";
import Tippy from "@tippyjs/react";

export default function PostCard({
  details,
  lastPostRef,
}: {
  details: Post;
  lastPostRef?: MutableRefObject<HTMLDivElement | null> | null;
}) {
  const [post, setPost] = useState<Post>(details);
  const { user } = useSelector((state: RootState) => state.userSlice);
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const postCategoryDropdownRef = useRef<HTMLSelectElement | null>(null);
  const [currentMedia, setCurrentMedia] = useState<string | File | null>(
    details.media
  );
  const updateCaptionInputRef = useRef<HTMLInputElement | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    setIsBookmarked(user ? user.savedPosts.includes(details._id) : false);
  }, [user]);

  function handleLikePost() {
    if (user === null)
      return toast.error("You need to login.", toastEmitterConfig);
    setPost((post) => ({ ...post, likes: [...post.likes, user.username] }));
    likePost(
      post._id,
      setIsLiking,
      (result) => setPost(result.data.data),
      (err) => {
        setPost((post) => ({
          ...post,
          likes: post.likes.filter((like) => like !== user.username),
        }));
        toast.error(extractErrorMessage(err), toastEmitterConfig);
      }
    );
  }

  function handleUnlikePost() {
    if (user === null)
      return toast.error("You need to login.", toastEmitterConfig);
    setPost((post) => ({
      ...post,
      likes: post.likes.filter((like) => like !== user.username),
    }));
    unlikePost(
      post._id,
      setIsLiking,
      (result) => setPost(result.data.data),
      (err) => {
        setPost((post) => ({ ...post, likes: [...post.likes, user.username] }));
        toast.error(extractErrorMessage(err), toastEmitterConfig);
      }
    );
  }

  function handleBookmarkPost() {
    if (user === null)
      return toast.error("You need to login.", toastEmitterConfig);
    setIsBookmarked(true);
    addToBookmark(
      post._id,
      setIsBookmarking,
      () => dispatch(updateUser()),
      (err) => {
        setIsBookmarked(false);
        toast.error(extractErrorMessage(err), toastEmitterConfig);
      }
    );
  }
  function handleRemoveBookmark() {
    if (user === null)
      return toast.error("You need to login.", toastEmitterConfig);
    setIsBookmarked(false);
    removeFromBookmark(
      post._id,
      setIsBookmarking,
      () => dispatch(updateUser()),
      (err) => {
        setIsBookmarked(true);
        toast.error(extractErrorMessage(err), toastEmitterConfig);
      }
    );
  }

  function handlePostComment() {
    if (user === null)
      return toast.error("You need to login.", toastEmitterConfig);
    if (!commentInputRef.current?.value.replaceAll(" ", "")) return;
    postComment(
      commentInputRef.current.value,
      post._id,
      setIsPostingComment,
      (result) => {
        if (commentInputRef.current) {
          commentInputRef.current.value = "";
        }
        setPost(result.data.data);
      },
      (err) => {
        toast.error(extractErrorMessage(err), toastEmitterConfig);
      }
    );
  }

  function handleDeletePost() {
    deletePost(
      post._id,
      undefined,
      (result) => {
        dispatch(deletePostAction({ postID: post._id }));
        dispatch(updateUser());
      },
      (err) => {
        toast.error(extractErrorMessage(err), toastEmitterConfig);
      }
    );
  }

  function handleUpdatePost() {
    if (updateCaptionInputRef.current && postCategoryDropdownRef.current) {
      const updatedPostData: UpdatePost = {};
      if (
        updateCaptionInputRef.current.value.replaceAll(" ", "") &&
        updateCaptionInputRef.current.value !== post.caption
      ) {
        updatedPostData.caption = updateCaptionInputRef.current.value;
      }
      if (postCategoryDropdownRef.current.value !== post.category) {
        updatedPostData.category = postCategoryDropdownRef.current
          .value as PostCategories;
      }
      if (currentMedia !== post.media) {
        if (currentMedia) {
          if (typeof currentMedia !== "string") {
            updatedPostData.media = currentMedia;
          }
        } else {
          updatedPostData.media = null;
        }
      }
      updatePost(
        post._id,
        updatedPostData,
        setIsUpdating,
        (result) => {
          setInEditMode(false);
          setPost(result.data.data);
        },
        (err) => {
          toast.error(extractErrorMessage(err), toastEmitterConfig);
        }
      );
    }
  }

  return (
    <>
      <div ref={lastPostRef} className={postCardStyles.postCardContainer}>
        <div className={postCardStyles.postCardHeader}>
          <div className={postCardStyles.postingAccountDetailsContainer}>
            <div>
              <img
                src={post.postedBy.image}
                alt={post.postedBy.username}
                className={postCardStyles.profilePicturePreview}
              />
            </div>
            <div>
              <p>{post.postedBy.name}</p>
              <UsernameLink username={post.postedBy.username} />
            </div>
          </div>
          {user?.username === post.postedBy.username && (
            <div>
              <Tooltip
                tooltipItems={[
                  {
                    tooltipChild: (
                      <span className={postCardStyles.deletePostText}>
                        Delete
                      </span>
                    ),
                    tooltipOnClickHandler: handleDeletePost,
                  },
                  {
                    tooltipChild: <span>Edit</span>,
                    tooltipOnClickHandler: () => setInEditMode((prev) => !prev),
                  },
                  {
                    tooltipChild: (
                      <span>
                        {post.commentsActive ? "Disable" : "Enable"} comments
                      </span>
                    ),
                    tooltipOnClickHandler: () =>
                      toggleComments(
                        post._id,
                        undefined,
                        (result) => {
                          setPost(result.data.data);
                        },
                        (err) =>
                          toast.error(
                            extractErrorMessage(err),
                            toastEmitterConfig
                          )
                      ),
                  },
                ]}
              />
            </div>
          )}
        </div>
        {inEditMode ? (
          currentMedia ? (
            <div className={postCardStyles.updateImagePreviewContainer}>
              <button
                className={buttonsStyles.removeImageButton}
                onClick={() => setCurrentMedia(null)}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
              <Image
                src={
                  typeof currentMedia === "string"
                    ? currentMedia
                    : URL.createObjectURL(currentMedia)
                }
                alt="update-image"
                layout="fill"
              />
              <label
                className={`${postCardStyles.changeImageLabel} ${postCardStyles.addImageLabel}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className={postCardStyles.addImageInput}
                  onChange={(e) => {
                    if (e.target.files) {
                      if (isImage(e.target.files[0])) {
                        setCurrentMedia(e.target.files[0]);
                      }
                    }
                  }}
                />
                <span>Change image</span>
              </label>
            </div>
          ) : (
            <label className={postCardStyles.addImageLabel}>
              <input
                type="file"
                accept="image/*"
                className={postCardStyles.addImageInput}
                onChange={(e) => {
                  if (e.target.files) {
                    if (isImage(e.target.files[0])) {
                      setCurrentMedia(e.target.files[0]);
                    }
                  }
                }}
              />
              <FontAwesomeIcon icon={faUpload} /> Add an image
            </label>
          )
        ) : (
          post.media && (
            <div className={postCardStyles.postMediaContainer}>
              <Image src={post.media} alt={post.media} layout="fill" />
            </div>
          )
        )}
        <div className={postCardStyles.postTextContentContainer}>
          <div className={postCardStyles.postWrittenTextContainer}>
            <div className={postCardStyles.postTitleCategoryContainer}>
              {inEditMode ? (
                <>
                  <input
                    ref={updateCaptionInputRef}
                    defaultValue={post.caption}
                    className={postCardStyles.updateCaptionInput}
                  />
                  <PostCategoryDropdown
                    background="#0c0c0c"
                    selectRef={postCategoryDropdownRef}
                  />
                </>
              ) : (
                <>
                  <span className={postCardStyles.caption}>{post.caption}</span>
                  <span className={postCardStyles.category}>
                    {post.category}
                  </span>
                </>
              )}
            </div>
            <span className={postCardStyles.postAge}>
              {new Date(post.lastModified).toLocaleDateString()}
            </span>
          </div>
          {inEditMode && (
            <>
              <button
                disabled={isUpdating}
                className={`${buttonsStyles.primaryButton} ${postCardStyles.updateButton}`}
                onClick={() => handleUpdatePost()}
              >
                {isUpdating ? <ButtonSyncLoader /> : "Update"}
              </button>
              <button
                disabled={isUpdating}
                className={postCardStyles.cancelEditButton}
                onClick={() => setInEditMode(false)}
              >
                Cancel
              </button>
            </>
          )}
          <div className={postCardStyles.actionBar}>
            <div>
              {(user ? post.likes.includes(user.username) : false) ? (
                <button
                  title={String(post.likes.length)}
                  disabled={isLiking}
                  className={buttonsStyles.buttonWithBadge}
                  onClick={() => handleUnlikePost()}
                >
                  <FontAwesomeIcon icon={faSHeart} color="#fd3b3b" />
                  <span
                    title={String(post.likes.length)}
                    className={buttonsStyles.buttonBadge}
                  >
                    {post.likes.length}
                  </span>
                </button>
              ) : (
                <button
                  title={String(post.likes.length)}
                  disabled={isLiking}
                  className={buttonsStyles.buttonWithBadge}
                  onClick={() => handleLikePost()}
                >
                  <FontAwesomeIcon icon={faRHeart} />
                  <span
                    title={String(post.likes.length)}
                    className={buttonsStyles.buttonBadge}
                  >
                    {post.likes.length}
                  </span>
                </button>
              )}
              <button
                title={String(post.comments.length)}
                onClick={() => {
                  if (post.comments.length)
                    setIsCommentBoxOpen((prev) => !prev);
                }}
              >
                <FontAwesomeIcon icon={faComment} />
              </button>
            </div>
            <div>
              {isBookmarked ? (
                <button
                  disabled={isBookmarking}
                  onClick={() => handleRemoveBookmark()}
                >
                  <FontAwesomeIcon icon={faSBookmark} />
                </button>
              ) : (
                <button
                  disabled={isBookmarking}
                  onClick={() => handleBookmarkPost()}
                >
                  <FontAwesomeIcon icon={faRBookmark} />
                </button>
              )}
              <Tippy content="not implemented yet">
                <button>
                  <FontAwesomeIcon icon={faShareNodes} />
                </button>
              </Tippy>
            </div>
          </div>
          <div className={postCardStyles.latestCommentsPreviewContainer}>
            {post.comments.length === 0 ? (
              <p>No comments</p>
            ) : isCommentBoxOpen && post.comments.length > 2 ? (
              <CommentBox comments={post.comments} />
            ) : (
              post.comments
                .slice(0, post.comments.length >= 2 ? 2 : 1)
                .map((comment) => (
                  <div
                    key={comment._id}
                    className={postCardStyles.latestCommentPreview}
                  >
                    <span>{comment.postedBy}: </span>
                    <span>{comment.comment}</span>
                  </div>
                ))
            )}
          </div>
          {post.comments.length > 2 && (
            <button
              className={buttonsStyles.textButton}
              onClick={() => setIsCommentBoxOpen((prev) => !prev)}
            >
              {isCommentBoxOpen ? "Hide" : "Show all"} comments
            </button>
          )}
          {post.commentsActive ? (
            <div className={postCardStyles.commentActionBar}>
              <input
                ref={commentInputRef}
                className={postCardStyles.addCommentInput}
                type="text"
                placeholder="Add a comment"
              />
              <button
                disabled={isPostingComment}
                className={`${buttonsStyles.primaryButton} ${postCardStyles.commentButton}`}
                onClick={() => handlePostComment()}
              >
                {isPostingComment ? <ButtonSyncLoader /> : "Comment"}
              </button>
            </div>
          ) : (
            <p className={postCardStyles.disabledCommentText}>
              Comments are disabled on this post.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
