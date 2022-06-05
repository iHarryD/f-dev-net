import commonStyles from "../../styles/Common.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import signupFormFirstStepStyles from "./SignupFormFirstStep.module.css";
import ThirdPartyAuthButtons from "../thirdPartyAuthButtons/ThirdPartyAuthButtons";
import { useState } from "react";
import { firstStepProps } from "../../interfaces/SignupFormFirstStep.interface";
import { toLoginSetterValues } from "../../interfaces/Common.type";

export default function SignupFormFirstStep({
  toLoginSetter,
  signupStepSetter,
}: firstStepProps) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  return (
    <div className={commonStyles.authBoxContainer}>
      <form className={signupFormFirstStepStyles.signupForm}>
        <div className={commonStyles.animatedInputLabelContainer}>
          <label
            htmlFor="full-name"
            className={`${commonStyles.animatedLabel} ${
              fullName ? commonStyles.labelIsAnimated : ""
            }`}
          >
            Full name
          </label>
          <input
            id="full-name"
            className={commonStyles.authInput}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className={commonStyles.animatedInputLabelContainer}>
          <label
            htmlFor="email"
            className={`${commonStyles.animatedLabel} ${
              email ? commonStyles.labelIsAnimated : ""
            }`}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className={commonStyles.authInput}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={commonStyles.animatedInputLabelContainer}>
          <label
            htmlFor="username"
            className={`${commonStyles.animatedLabel} ${
              username ? commonStyles.labelIsAnimated : ""
            }`}
          >
            Username
          </label>
          <input
            id="username"
            className={commonStyles.authInput}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={commonStyles.animatedInputLabelContainer}>
          <label
            htmlFor="password"
            className={`${commonStyles.animatedLabel} ${
              password ? commonStyles.labelIsAnimated : ""
            }`}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className={commonStyles.authInput}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={commonStyles.animatedInputLabelContainer}>
          <label
            htmlFor="confirm-password"
            className={`${commonStyles.animatedLabel} ${
              confirmPassword ? commonStyles.labelIsAnimated : ""
            }`}
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            className={commonStyles.authInput}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className={buttonsStyles.primaryButton}
          onClick={() => signupStepSetter(2)}
        >
          Continue
        </button>
        <button
          type="reset"
          className={`${buttonsStyles.secondaryButton} ${buttonsStyles.resetButton}`}
        >
          Reset
        </button>
        <button
          className={buttonsStyles.textButton}
          onClick={(e) => {
            e.preventDefault();
            toLoginSetter(toLoginSetterValues.LOGIN);
          }}
        >
          Already have an account?
        </button>
      </form>
      <div className={commonStyles.otherAuthOptionsContainer}>
        <ThirdPartyAuthButtons />
      </div>
    </div>
  );
}
