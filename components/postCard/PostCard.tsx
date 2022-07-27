import {
  faBookmark as faRBookmark,
  faComment,
  faHeart as faRHeart,
} from "@fortawesome/free-regular-svg-icons";
import {
  faShareNodes,
  faHeart as faSHeart,
  faBookmark as faSBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import postCardStyles from "./PostCard.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import { Post } from "../../interfaces/Common.interface";
import { useEffect, useRef, useState } from "react";
import CommentBox from "../commentBox/CommentBox";
import {
  deletePost,
  likePost,
  postComment,
  unlikePost,
} from "../../services/postServices";
import { useDispatch, useSelector } from "react-redux";
import {
  updateComments,
  like,
  unlike,
  deletePost as deletePostAction,
} from "../../features/postSlice";
import UsernameLink from "../usernameLink/UsernameLink";
import Tooltip from "../tooltip/Tooltip";
import {
  addToBookmark,
  removeFromBookmark,
} from "../../services/bookmarkServices";
import { AppDispatch, RootState } from "../../store";
import { updateUser } from "../../features/userSlice";

export default function PostCard({
  details: { _id, caption, comments, likes, media, postedBy, timestamp },
}: {
  details: Post;
}) {
  const { user } = useSelector((state: RootState) => state.userSlice);
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setIsBookmarked(user ? user.savedPosts.includes(_id) : false);
  }, [user]);

  function handleLikePost() {
    if (user === null) return;
    dispatch(like({ postID: _id, username: user.username }));
    likePost(_id, setIsLiking, undefined, () =>
      dispatch(unlike({ postID: _id, username: user!.username }))
    );
  }

  function handleUnlikePost() {
    if (user === null) return;
    dispatch(unlike({ postID: _id, username: user.username }));
    unlikePost(_id, setIsLiking, undefined, () =>
      dispatch(like({ postID: _id, username: user!.username }))
    );
  }

  function handleBookmarkPost() {
    if (user === null) return;
    setIsBookmarked(true);
    addToBookmark(
      _id,
      setIsBookmarking,
      () => dispatch(updateUser()),
      () => setIsBookmarked(false)
    );
  }
  function handleRemoveBookmark() {
    if (user === null) return;
    setIsBookmarked(false);
    removeFromBookmark(
      _id,
      setIsBookmarking,
      () => dispatch(updateUser()),
      () => setIsBookmarked(true)
    );
  }

  function handlePostComment() {
    if (!commentInputRef.current?.value.replaceAll(" ", "")) return;
    postComment(
      commentInputRef.current.value,
      _id,
      setIsPostingComment,
      (result) => {
        dispatch(updateComments({ postID: _id, comments: result.data.data }));
        commentInputRef.current!.value = "";
      }
    );
  }

  function handleDeletePost() {
    deletePost(_id, undefined, (result) => {
      dispatch(deletePostAction({ postID: _id }));
    });
  }

  return (
    <div className={postCardStyles.postCardContainer}>
      <div className={postCardStyles.postCardHeader}>
        <div className={postCardStyles.postingAccountDetailsContainer}>
          <div>
            <img
              src={postedBy.image}
              alt={postedBy.username}
              className={postCardStyles.profilePicturePreview}
            />
          </div>
          <div>
            <p>{postedBy.name}</p>
            <UsernameLink username={postedBy.username} />
          </div>
        </div>
        {user?.username === postedBy.username && (
          <div>
            <Tooltip
              tooltipItems={[
                {
                  tooltipChild: <span>Delete </span>,
                  tooltipOnClickHandler: handleDeletePost,
                },
              ]}
            />
          </div>
        )}
      </div>
      {media && (
        <div>
          <img
            src={media}
            alt={media}
            className={postCardStyles.demoPostPicture}
          />
        </div>
      )}
      <div className={postCardStyles.postTextContentContainer}>
        <div className={postCardStyles.postWrittenTextContainer}>
          <p>{caption}</p>
          <span className={postCardStyles.postAge}>
            {new Date(timestamp).toLocaleDateString()}
          </span>
        </div>
        <div className={postCardStyles.actionBar}>
          <div>
            {(user ? likes.includes(user.username) : false) ? (
              <button
                disabled={isLiking}
                className={buttonsStyles.buttonWithBadge}
                onClick={() => handleUnlikePost()}
              >
                <FontAwesomeIcon icon={faSHeart} color="#fd3b3b" />
                <span
                  title={String(likes.length)}
                  className={buttonsStyles.buttonBadge}
                >
                  {likes.length}
                </span>
              </button>
            ) : (
              <button
                disabled={isLiking}
                className={buttonsStyles.buttonWithBadge}
                onClick={() => handleLikePost()}
              >
                <FontAwesomeIcon icon={faRHeart} />
                <span
                  title={String(likes.length)}
                  className={buttonsStyles.buttonBadge}
                >
                  {likes.length}
                </span>
              </button>
            )}
            <button
              onClick={() => {
                if (comments.length) setIsCommentBoxOpen((prev) => !prev);
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
            <button>
              <FontAwesomeIcon icon={faShareNodes} />
            </button>
          </div>
        </div>
        <div className={postCardStyles.latestCommentsPreviewContainer}>
          {comments.length === 0 ? (
            <p>No comments</p>
          ) : isCommentBoxOpen && comments.length > 2 ? (
            <CommentBox comments={comments} />
          ) : (
            comments.slice(0, comments.length >= 2 ? 2 : 1).map((comment) => (
              <p
                key={comment._id}
                className={postCardStyles.latestCommentPreview}
              >
                {comment.comment}
              </p>
            ))
          )}
        </div>
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
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
