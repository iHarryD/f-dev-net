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

export default function CreatePost() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [wordCount, setWordCount] = useState<number>(0);
  const wordsLimitForPostTextInput = 500;
  const captionTextAreaRef = useRef<null | HTMLTextAreaElement>(null);
  const categoryDropDownRef = useRef<null | HTMLSelectElement>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const posts = useSelector((state: RootState) => state.postSlice);
  const dispatch = useDispatch();

  async function handleCreateNewPost() {
    if (
      captionTextAreaRef.current === null ||
      categoryDropDownRef.current === null
    )
      return;
    try {
      setIsPosting(true);
      const data = {
        caption: captionTextAreaRef.current.value,
        category: categoryDropDownRef.current.value,
        media: uploadedImages,
      };
      const result = await fetch("http://127.0.0.1:3000/api/posts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const resultJson = await result.json();
      captionTextAreaRef.current.value = "";
      setWordCount(0);
      dispatch(append({ newPosts: [resultJson.data] }));
    } catch (err) {
      console.log(err);
    } finally {
      setIsPosting(false);
    }
  }

  function removeImage(file: File) {
    setUploadedImages((prev) => prev.filter((item) => item !== file));
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
      {uploadedImages && (
        <div className={createPostStyles.uploadedImagesPreviewsContainer}>
          {uploadedImages.map((file) => (
            <div
              key={file.name}
              className={
                createPostStyles.individualUploadedImagePreviewsContainer
              }
            >
              <button
                className={createPostStyles.uploadedImagePreviewRemoveButton}
              >
                <FontAwesomeIcon
                  icon={faClose}
                  onClick={() => removeImage(file)}
                />
              </button>
              <img
                className={createPostStyles.uploadedImagePreview}
                src={URL.createObjectURL(file)}
              />
            </div>
          ))}
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
                  console.log(e.target.files![0]);
                  if (uploadedImages.length === 3) return;
                  if (e.target.files === null) return;
                  if (e.target.files.length === 0) return;
                  if (isImage(e.target.files[e.target.files.length - 1])) {
                    setUploadedImages((prev) => [
                      ...prev,
                      e.target.files![e.target.files!.length - 1],
                    ]);
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
