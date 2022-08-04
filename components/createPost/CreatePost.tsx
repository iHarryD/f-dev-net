import createPostStyles from "./CreatePost.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile } from "@fortawesome/free-regular-svg-icons";
import { faClose, faTrash, faUserTag } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { isImage } from "../../helpers/isImage";
import { useDispatch } from "react-redux";
import { append } from "../../features/postSlice";
import GiphyGrid from "../giphyGrid/GiphyGrid";
import { createNewPost, getPost } from "../../services/postServices";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";
import { PostCategories } from "../../interfaces/Common.interface";
import { updateUser } from "../../features/userSlice";
import { AppDispatch } from "../../store";
import Image from "next/image";
import PostCategoryDropdown from "../postCategoryDropdown/PostCategoryDropdown";
import { toastEmitterConfig } from "../../data/toastEmitterConfig";
import { extractErrorMessage } from "../../helpers/extractErrorMessage";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const wordsLimitForPostTextInput = 500;
  const [caption, setCaption] = useState<string>("");
  const categoryDropDownRef = useRef<null | HTMLSelectElement>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isGiphyActive, setIsGiphyActive] = useState<boolean>(false);
  const [giphySearchQuery, setGiphySearchQuery] = useState<string>("");

  function clearForm() {
    setCaption("");
    setUploadedImage(null);
  }

  async function handleCreateNewPost() {
    if (categoryDropDownRef.current === null) return;
    if (!caption.replaceAll(" ", "")) return;
    const postDetails: {
      caption: string;
      category: PostCategories;
      media?: File;
    } = {
      caption,
      category: categoryDropDownRef.current.value as PostCategories,
    };
    if (uploadedImage) {
      postDetails.media = uploadedImage;
    }
    createNewPost(
      postDetails,
      setIsPosting,
      (result) => {
        clearForm();
        dispatch(append({ newPosts: [result.data.data] }));
        dispatch(updateUser());
      },
      (err) => toast.error(extractErrorMessage(err), toastEmitterConfig)
    );
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
          maxLength={wordsLimitForPostTextInput}
          value={caption}
          className={createPostStyles.postInputTextArea}
          onChange={(e) => setCaption(e.target.value)}
        />
        <span className={createPostStyles.wordCounter}>
          {caption.length}/{wordsLimitForPostTextInput}
        </span>
      </div>
      <div>
        <PostCategoryDropdown
          background="#e0e7ee"
          selectRef={categoryDropDownRef}
        />
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
        <div className={createPostStyles.uploadedImagePreviewContainer}>
          <button className={buttonsStyles.removeImageButton}>
            <FontAwesomeIcon
              icon={faClose}
              onClick={() => setUploadedImage(null)}
            />
          </button>
          <Image
            layout="fill"
            alt="uploaded-image"
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
