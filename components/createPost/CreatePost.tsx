import createPostStyles from "./CreatePost.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile } from "@fortawesome/free-regular-svg-icons";
import { faClose, faUserTag } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { isImage } from "../../helpers/isImage";
import SyncLoader from "react-spinners/SyncLoader";
import { loaderCSSOverrides } from "../../database/loaderCSS";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { append } from "../../features/postSlice";
import { getImageDataURL } from "../../helpers/getImageDataURL";

export default function CreatePost() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const wordsLimitForPostTextInput = 500;
  const captionTextAreaRef = useRef<null | HTMLTextAreaElement>(null);
  const categoryDropDownRef = useRef<null | HTMLSelectElement>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const dispatch = useDispatch();

  async function handleCreateNewPost() {
    if (
      captionTextAreaRef.current === null ||
      categoryDropDownRef.current === null
    )
      return;
    try {
      setIsPosting(true);
      const base64ImageURL = uploadedImage
        ? await getImageDataURL(uploadedImage)
        : "";
      const data = {
        caption: captionTextAreaRef.current.value,
        category: categoryDropDownRef.current.value,
        media: base64ImageURL,
      };
      const result = await fetch("http://127.0.0.1:3000/api/posts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (result.status === 200) {
        const resultJson = await result.json();
        captionTextAreaRef.current.value = "";
        setUploadedImage(null);
        setWordCount(0);
        dispatch(append({ newPosts: [resultJson.data] }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className={createPostStyles.createPostContainer}>
      <div className={createPostStyles.headingAndCloseButtonContainer}>
        <h3>Create new post</h3>
        <button className={buttonsStyles.closeIconButton}>
          <FontAwesomeIcon icon={faClose} />
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
      <div className={createPostStyles.postCategoryDropdownContainer}>
        <select
          ref={categoryDropDownRef}
          className={`${commonStyles.styledDropdown} ${createPostStyles.postCategoryDropdown}`}
        >
          <option value="general">General</option>
          <option value="query">Query</option>
        </select>
      </div>
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
          <button>
            <FontAwesomeIcon icon={faSmile} />
          </button>
        </div>
        <button
          className={buttonsStyles.primaryButton}
          onClick={() => handleCreateNewPost()}
        >
          {isPosting ? (
            <div className={commonStyles.buttonLoaderContainer}>
              <SyncLoader
                size="6"
                color="#fff"
                loading={isPosting}
                cssOverride={loaderCSSOverrides}
              />
            </div>
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
}
