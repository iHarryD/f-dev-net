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

export default function PostCard({
  details: { _id, caption, comments, likes, media, postedBy, timestamp },
}: {
  details: Post;
}) {
  const { data: session } = useSession();
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(
    session ? likes.includes(session.user.username) : false
  );
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    session ? session.user.savedPosts.includes(_id) : false
  );
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);

  async function handleLikePost() {
    if (session === null) return;
    try {
      setIsLiked(true);
      setIsLiking(true);
      const result = await fetch(
        `http://127.0.0.1:3000/api/posts/${_id}/likes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const resultJson = await result.json();
      console.log(resultJson);
    } catch (err) {
      console.log(err);
      setIsLiked(false);
    } finally {
      setIsLiking(false);
    }
  }

  async function handleUnlikePost() {
    if (session === null) return;
    try {
      setIsLiked(false);
      setIsLiking(true);
      const result = await fetch(
        `http://127.0.0.1:3000/api/posts/${_id}/likes`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const resultJson = await result.json();
      console.log(resultJson);
    } catch (err) {
      console.log(err);
      setIsLiked(true);
    } finally {
      setIsLiking(false);
    }
  }

  async function handleBookmarkPost() {
    if (session === null) return;
    try {
      setIsBookmarked(true);
      setIsBookmarking(true);
      const result = await fetch(
        `http://127.0.0.1:3000/api/profiles/bookmarks`,
        {
          method: "POST",
          body: JSON.stringify({
            postID: _id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const resultJson = await result.json();
      console.log(resultJson);
    } catch (err) {
      console.log(err);
      setIsBookmarked(false);
    } finally {
      setIsBookmarking(false);
    }
  }

  async function handleRemoveBookmark() {
    if (session === null) return;
    try {
      setIsBookmarked(false);
      setIsBookmarking(true);
      const result = await fetch(
        `http://127.0.0.1:3000/api/profiles/bookmarks`,
        {
          method: "DELETE",
          body: JSON.stringify({
            postID: _id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const resultJson = await result.json();
      console.log(resultJson);
    } catch (err) {
      console.log(err);
      setIsBookmarked(true);
    } finally {
      setIsBookmarking(false);
    }
  }

  async function handlePostComment() {
    if (!commentInputRef.current?.value.replaceAll(" ", "")) return;
    try {
      const data = {
        comment: commentInputRef.current.value,
      };
      setIsPostingComment(true);
      const result = await fetch(
        `http://127.0.0.1:3000/api/posts/${_id}/comments`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resultJson = await result.json();
      commentInputRef.current.value = "";
      console.log(resultJson);
    } catch (err) {
      console.log(err);
    } finally {
      setIsPostingComment(false);
    }
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
            {isLiked ? (
              <button disabled={isLiking} onClick={() => handleUnlikePost()}>
                <FontAwesomeIcon icon={faSHeart} color="#fd3b3b" />
              </button>
            ) : (
              <button disabled={isLiking} onClick={() => handleLikePost()}>
                <FontAwesomeIcon icon={faRHeart} />
              </button>
            )}
            <button>
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
          {comments.length ? (
            comments
              .slice(0, comments.length >= 2 ? 2 : 1)
              .map((comment) => (
                <p className={postCardStyles.latestCommentPreview}>
                  {comment.comment}
                </p>
              ))
          ) : (
            <p>No comments</p>
          )}
          {comments.length > 2 && (
            <div className={postCardStyles.viewAllCommentsButtonContainer}>
              <button className={buttonsStyles.textButton}>
                View all {comments.length} comments
              </button>
            </div>
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
