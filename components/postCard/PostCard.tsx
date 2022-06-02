import {
  faBookmark,
  faComment,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import postCardStyles from "./PostCard.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";

export default function PostCard() {
  return (
    <div className={postCardStyles.postCardContainer}>
      <div className={postCardStyles.postingAccountDetailsContainer}>
        <div className={postCardStyles.profilePicturePreview}></div>
        <div>
          <span>Harry</span>
          <span className={postCardStyles.username}>@harry</span>
        </div>
      </div>
      <div className={postCardStyles.demoPostPicture}></div>
      <div className={postCardStyles.postCaptionContainer}>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio,
          adipisci!
        </p>
        <span className={postCardStyles.postAge}>2 days ago</span>
      </div>
      <div className={postCardStyles.actionBarCommentInputContainer}>
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
      <div className={postCardStyles.latestCommentsPreview}>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium,
          et sequi? Dolore quibusdam id iusto a delectus saepe tempore at aut
          consequatur, totam et repellat vero debitis inventore magnam illo
          sequi, ea soluta.
        </p>
      </div>
      <div className={postCardStyles.viewAllCommentsButtonContainer}>
        <button className={buttonsStyles.textButton}>
          View all 291 comments
        </button>
      </div>
    </div>
  );
}
