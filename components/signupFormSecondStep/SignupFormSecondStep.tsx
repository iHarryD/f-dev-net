import { ChangeEvent, useRef, useState } from "react";
import { optimizeImage } from "../../helpers/optimizeImage";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import buttonsStyles from "../../styles/Buttons.module.css";
import signupFormSecondStepStyles from "./SignupFormSecondStep.module.css";
import { loginSetterAsProp } from "../../interfaces/Common.interface";

export default function SignupFormSecondStep({
  loginSetter,
}: loginSetterAsProp) {
  const [lasestUpload, setLasestUpload] = useState<string | null>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={signupFormSecondStepStyles.secondStepContainer}>
      <h2 className={signupFormSecondStepStyles.secondStepHeading}>
        Almost done
      </h2>
      <h3>Set your profile picture</h3>
      <div
        className={
          signupFormSecondStepStyles.dragAndDropProfilePictureContainer
        }
      >
        {lasestUpload ? (
          <img src={lasestUpload} />
        ) : (
          <div
            className={
              signupFormSecondStepStyles.dragAndDropProfilePictureInner
            }
          >
            <FontAwesomeIcon icon={faUpload} />
            <p
              className={
                signupFormSecondStepStyles.dragAndDropProfilePictureText
              }
            >
              Drag and drop
            </p>
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="profile-picture-input"
          className={signupFormSecondStepStyles.profilePictureLabel}
        >
          <input
            ref={profilePictureInputRef}
            id="profile-picture-input"
            type="file"
            accept="image/*"
            capture
            className={signupFormSecondStepStyles.profilePictureInput}
            // onChange={(e: ChangeEvent<HTMLInputElement>) => {
            //   if (e.target.files === null) return;
            //   setLasestUpload(
            //     optimizeImage(e.target.files[e.target.files.length - 1], 200)
            //   );
            // }}
          />
          {lasestUpload ? "Change" : "Choose image"}
        </label>
      </div>
      <button className={buttonsStyles.primaryButton}>Upload</button>
      <button
        className={buttonsStyles.textButton}
        onClick={() => loginSetter(true)}
      >
        Skip for now
      </button>
    </div>
  );
}
