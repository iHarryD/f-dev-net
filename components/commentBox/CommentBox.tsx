import { PostComment } from "../../interfaces/Common.interface";
import commentBoxStyles from "./CommentBox.module.css";

export default function CommentBox({ comments }: { comments: PostComment[] }) {
  return (
    <div className={commentBoxStyles.commentsContainer}>
      {comments.map((comment) => (
        <div>
          <span className={commentBoxStyles.commentPostedBy}>
            {comment.postedBy}:
          </span>
          <span>{comment.comment}</span>
        </div>
      ))}
    </div>
  );
}
