import createPostStyles from "./CreatePost.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile } from "@fortawesome/free-regular-svg-icons";
import { faClose, faTrash, faUserTag } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { isImage } from "../../helpers/isImage";
import { useDispatch } from "react-redux";
import { append } from "../../features/postSlice";
import GiphyGrid from "../giphyGrid/GiphyGrid";
import { createNewPost } from "../../services/postServices";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";

export default function CreatePost() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const wordsLimitForPostTextInput = 500;
  const captionTextAreaRef = useRef<null | HTMLTextAreaElement>(null);
  const categoryDropDownRef = useRef<null | HTMLSelectElement>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isGiphyActive, setIsGiphyActive] = useState<boolean>(false);
  const [giphySearchQuery, setGiphySearchQuery] = useState<string>("shazam");

  function clearForm() {
    captionTextAreaRef.current!.value = "";
    setUploadedImage(null);
    setWordCount(0);
  }

  async function handleCreateNewPost() {
    if (
      captionTextAreaRef.current === null ||
      categoryDropDownRef.current === null
    )
      return;
    if (!captionTextAreaRef.current.value.replaceAll(" ", "")) return;
    const postDetails: {
      caption: string;
      category: string;
      media?: File;
    } = {
      caption: captionTextAreaRef.current.value,
      category: categoryDropDownRef.current.value,
    };
    if (uploadedImage) {
      postDetails.media = uploadedImage;
    }
    createNewPost(postDetails, setIsPosting, (result) => {
      clearForm();
      dispatch(append({ newPosts: [result.data.data] }));
    });
  }

  return (
    <div className={createPostStyles.createPostContainer}>
      <div className={createPostStyles.headingAndCloseButtonContainer}>
        <h3>Create new post</h3>
        <button
          title="clear"
          className={buttonsStyles.trashIconButton}
          onClick={() => clearForm()}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className={createPostStyles.postInputTextAreaContainer}>
        <textarea
          placeholder="Write something..."
          ref={captionTextAreaRef}
          maxLength={wordsLimitForPostTextInput}
          className={createPostStyles.postInputTextArea}
          onChange={(e) => setWordCount(e.target.value.length)}
        />
        <span className={createPostStyles.wordCounter}>
          {wordCount}/{wordsLimitForPostTextInput}
        </span>
      </div>
      <div>
        <select
          ref={categoryDropDownRef}
          className={`${commonStyles.styledDropdown} ${createPostStyles.postCategoryDropdown}`}
        >
          <option value="general">General</option>
          <option value="query">Query</option>
        </select>
      </div>
      {isGiphyActive && (
        <div className={createPostStyles.giphyGridContainer}>
          <div className={createPostStyles.giphyTopBar}>
            <input
              value={giphySearchQuery}
              placeholder="search"
              className={createPostStyles.giphySearchBar}
              onChange={(e) => setGiphySearchQuery(e.target.value)}
            />
            <select className={commonStyles.styledDropdown}>
              <option value="gifs">Gifs</option>
              <option value="emojis">Emojis</option>
            </select>
          </div>
          <GiphyGrid searchTerm={giphySearchQuery} />
        </div>
      )}
      {uploadedImage && (
        <div
          className={createPostStyles.individualUploadedImagePreviewContainer}
        >
          <button className={createPostStyles.uploadedImagePreviewRemoveButton}>
            <FontAwesomeIcon
              icon={faClose}
              onClick={() => setUploadedImage(null)}
            />
          </button>
          <img
            className={createPostStyles.uploadedImagePreview}
            src={URL.createObjectURL(uploadedImage)}
          />
        </div>
      )}
      <div className={createPostStyles.utilitiesContainer}>
        <div className={createPostStyles.iconButtonsContainer}>
          <button>
            <FontAwesomeIcon icon={faUserTag} />
          </button>
          <button>
            <label
              htmlFor="post-image"
              className={createPostStyles.labelForPostImage}
            >
              <FontAwesomeIcon icon={faImage} />
              <input
                type="file"
                accept="image/*"
                id="post-image"
                className={createPostStyles.inputForPostImage}
                onChange={(e) => {
                  if (e.target.files) {
                    if (isImage(e.target.files[0])) {
                      setUploadedImage(e.target.files[0]);
                    }
                  }
                }}
              />
            </label>
          </button>
          <button onClick={() => setIsGiphyActive((prev) => !prev)}>
            <FontAwesomeIcon icon={faSmile} />
          </button>
        </div>
        <button
          className={buttonsStyles.primaryButton}
          onClick={() => handleCreateNewPost()}
        >
          {isPosting ? <ButtonSyncLoader /> : "Post"}
        </button>
      </div>
    </div>
  );
}
