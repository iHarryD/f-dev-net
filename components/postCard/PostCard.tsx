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
import commonStyles from "../../styles/Common.module.css";
import { Post } from "../../interfaces/Common.interface";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import CommentBox from "../commentBox/CommentBox";
import {
  bookmarkPost,
  likePost,
  postComment,
  unlikePost,
} from "../../services/postServices";
import { useDispatch } from "react-redux";
import { updateComments, like, unlike } from "../../features/postSlice";

export default function PostCard({
  details: { _id, caption, comments, likes, media, postedBy, timestamp },
}: {
  details: Post;
}) {
  const { data: session } = useSession();
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    session ? session.user.savedPosts.includes(_id) : false
  );
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  function handleLikePost() {
    if (session === null) return;
    dispatch(like({ postID: _id, username: session.user.username }));
    likePost(_id, setIsLiking, undefined, () =>
      dispatch(unlike({ postID: _id, username: session.user.username }))
    );
  }

  function handleUnlikePost() {
    if (session === null) return;
    dispatch(unlike({ postID: _id, username: session.user.username }));
    unlikePost(_id, setIsLiking, undefined, () =>
      dispatch(like({ postID: _id, username: session.user.username }))
    );
  }

  function handleBookmarkPost() {
    if (session === null) return;
    bookmarkPost(_id, setIsBookmarking);
  }
  function handleRemoveBookmark() {
    if (session === null) return;
    bookmarkPost(_id, setIsBookmarking);
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

  return (
    <div className={postCardStyles.postCardContainer}>
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
          <span className={commonStyles.username}>@{postedBy.username}</span>
        </div>
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
            {(session ? likes.includes(session.user.username) : false) ? (
              <button disabled={isLiking} onClick={() => handleUnlikePost()}>
                <FontAwesomeIcon icon={faSHeart} color="#fd3b3b" />
              </button>
            ) : (
              <button disabled={isLiking} onClick={() => handleLikePost()}>
                <FontAwesomeIcon icon={faRHeart} />
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
            comments
              .slice(0, comments.length >= 2 ? 2 : 1)
              .map((comment) => (
                <p className={postCardStyles.latestCommentPreview}>
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
