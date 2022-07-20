// import { ChangeEvent, useRef, useState } from "react";
// import { optimizeImage } from "../../helpers/optimizeImage";
// import { faUpload } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import buttonsStyles from "../../styles/Buttons.module.css";
// import signupFormSecondStepStyles from "./SignupFormSecondStep.module.css";
// import { isImage } from "../../helpers/isImage";

// export default function SignupFormSecondStep({
//   loginSetter,
// }: loginSetterAsProp) {
//   const [lasestUpload, setLasestUpload] = useState<File | null>(null);
//   const profilePictureInputRef = useRef<HTMLInputElement>(null);

//   function dropHandlerForDragAndDrop(e: any) {
//     e.preventDefault();
//     if (e.dataTransfer.items) {
//       const file = e.dataTransfer.items[0];
//       if (isImage(file)) {
//         setLasestUpload(file.getAsFile());
//       }
//     }
//   }

//   function dragOverHandlerForDragAndDrop(e: any) {
//     e.preventDefault();
//   }

//   return (
//     <div className={signupFormSecondStepStyles.secondStepContainer}>
//       <h2 className={signupFormSecondStepStyles.secondStepHeading}>
//         Almost done
//       </h2>
//       <h3>Set your profile picture</h3>
//       <div className={signupFormSecondStepStyles.dragAndDropContainer}>
//         <div
//           className={signupFormSecondStepStyles.dropZone}
//           onDrop={(e) => {
//             dropHandlerForDragAndDrop(e);
//           }}
//           onDragOver={(e) => dragOverHandlerForDragAndDrop(e)}
//         ></div>
//         {lasestUpload ? (
//           <img src={URL.createObjectURL(lasestUpload)} />
//         ) : (
//           <div
//             className={
//               signupFormSecondStepStyles.dragAndDropProfilePictureInner
//             }
//           >
//             <FontAwesomeIcon icon={faUpload} />
//             <p
//               className={
//                 signupFormSecondStepStyles.dragAndDropProfilePictureText
//               }
//             >
//               Drag and drop
//             </p>
//           </div>
//         )}
//       </div>
//       <div>
//         <label
//           htmlFor="profile-picture-input"
//           className={signupFormSecondStepStyles.profilePictureLabel}
//         >
//           <input
//             ref={profilePictureInputRef}
//             id="profile-picture-input"
//             type="file"
//             accept="image/*"
//             capture
//             className={signupFormSecondStepStyles.profilePictureInput}
//             onChange={(e: ChangeEvent<HTMLInputElement>) => {
//               if (e.target.files === null) return;
//               setLasestUpload(e.target.files[e.target.files.length - 1]);
//             }}
//           />
//           {lasestUpload ? "Change" : "Choose image"}
//         </label>
//       </div>
//       <button className={buttonsStyles.primaryButton}>Upload</button>
//       <button
//         className={buttonsStyles.textButton}
//         onClick={() => loginSetter(true)}
//       >
//         Skip for now
//       </button>
//     </div>
//   );
// }

export {};
