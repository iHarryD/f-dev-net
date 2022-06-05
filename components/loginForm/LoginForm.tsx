import buttonsStyles from "../../styles/Buttons.module.css";
import loginFormStyles from "./LoginForm.module.css";
import commonStyles from "../../styles/Common.module.css";
import ThirdPartyAuthButtons from "../thirdPartyAuthButtons/ThirdPartyAuthButtons";
import { loginFormProps } from "../../interfaces/LoginForm.interface";
import { toLoginSetterValues } from "../../interfaces/Common.type";

export default function LoginForm({ toLoginSetter }: loginFormProps) {
  return (
    <div className={commonStyles.authBoxContainer}>
      <form className={loginFormStyles.loginForm}>
        <input className={commonStyles.authInput} placeholder="Username" />
        <input
          type="password"
          className={commonStyles.authInput}
          placeholder="Password"
        />
        <div>
          <input type="checkbox" id="remember-me-checkbox" />
          <label
            htmlFor="remember-me-checkbox"
            className={loginFormStyles.rememberLoginLabel}
          >
            Remember me
          </label>
        </div>
        <button type="submit" className={buttonsStyles.primaryButton}>
          Login
        </button>
        <button
          type="reset"
          className={`${buttonsStyles.secondaryButton} ${buttonsStyles.resetButton}`}
        >
          Reset
        </button>
        <button
          className={`${buttonsStyles.textButton} ${loginFormStyles.toSignupButton}`}
          onClick={(e) => {
            e.preventDefault();
            toLoginSetter(toLoginSetterValues.SIGNUP);
          }}
        >
          Create new account
        </button>
      </form>
      <div className={commonStyles.otherAuthOptionsContainer}>
        <ThirdPartyAuthButtons />
      </div>
    </div>
  );
}
