import {
  faBookmark,
  faComment,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import postCardStyles from "./PostCard.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { Post } from "../../interfaces/Common.interface";

export default function PostCard({
  details: { _id, caption, comments, likes, media, postedBy, timestamp },
}: {
  details: Post;
}) {
  return (
    <div className={postCardStyles.postCardContainer}>
      <div className={postCardStyles.postingAccountDetailsContainer}>
        <div className={postCardStyles.profilePicturePreview}></div>
        <div>
          <p>{postedBy.name}</p>
          <span className={commonStyles.username}>@{postedBy.username}</span>
        </div>
      </div>
      {media.length > 0 && (
        <div className={postCardStyles.demoPostPicture}></div>
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
            <button>
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button>
              <FontAwesomeIcon icon={faComment} />
            </button>
          </div>
          <div>
            <button>
              <FontAwesomeIcon icon={faBookmark} />
            </button>
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
            className={postCardStyles.addCommentInput}
            type="text"
            placeholder="Add a comment"
          />
          <button
            className={`${buttonsStyles.primaryButton} ${postCardStyles.commentButton}`}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
