import { FormEvent, useState } from "react";
import commonStyles from "../../styles/Common.module.css";
import ThirdPartyAuthButtons from "../thirdPartyAuthButtons/ThirdPartyAuthButtons";
import buttonsStyles from "../../styles/Buttons.module.css";
import signInFormStyles from "./SignInForm.module.css";
import { login, signup } from "../../services/authServices";
import { useAuth } from "../../contexts/AuthContext";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import { emailRegExp } from "../../regExp";
import { extractErrorMessage } from "../../helpers/extractErrorMessage";

const testingCredentials = {
  username: "harry",
  password: "strongpassword",
};

export default function SignInForm() {
  const { setUserCredentials } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [formError, setFormError] = useState<string | null>(null);
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);

  function resetForm() {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setFormError(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (authMode === "login") {
      if (username === "" || password === "") {
        setFormError("Please fill in the required fields.");
        return;
      }
      login({ username, password }, setIsLoading, (result) => {
        setUserCredentials({
          user: result.data.data.user,
          token: result.data.data.token,
        });
      });
    } else {
      if (email === "" || username === "" || password === "" || name === "") {
        setFormError("Please fill in the required fields.");
        return;
      }
      if (emailRegExp.test(email) === false) {
        setFormError("Enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setFormError("Password must be at least 6 characters.");
        return;
      }
      signup(
        { name, email, username, password },
        setIsLoading,
        () => setAuthMode("login"),
        (err) => {
          const error = extractErrorMessage(err)
            ? extractErrorMessage(err)
            : "Something went wrong.";
          setFormError(error as string);
        }
      );
    }
  }

  function toggleAuthMode() {
    resetForm();
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
  }

  return (
    <div className={commonStyles.authBoxContainer}>
      {authMode === "login" ? (
        <form
          className={signInFormStyles.authBoxSection}
          onSubmit={(e) => handleSubmit(e)}
        >
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
              name="username"
              value={username}
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
              name="password"
              type={isShowingPassword ? "text" : "password"}
              value={password}
              className={commonStyles.authInput}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onMouseDown={() => setIsShowingPassword(true)}
              onMouseUp={() => setIsShowingPassword(false)}
              className={commonStyles.sideButton}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
          {formError && (
            <p className={signInFormStyles.formErrorText}>{formError}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={buttonsStyles.primaryButton}
          >
            {isLoading ? <ButtonSyncLoader /> : "Sign In"}
          </button>
          <div className={signInFormStyles.textButtonsContainer}>
            <button
              type="button"
              className={buttonsStyles.textButton}
              onClick={() => toggleAuthMode()}
            >
              I don't have an account
            </button>
            <button
              type="button"
              className={buttonsStyles.textButton}
              onClick={() => {
                setUsername(testingCredentials.username);
                setPassword(testingCredentials.password);
              }}
            >
              Login using test credentials
            </button>
          </div>
        </form>
      ) : (
        <form
          className={signInFormStyles.authBoxSection}
          onSubmit={(e) => handleSubmit(e)}
        >
          <>
            <div className={commonStyles.animatedInputLabelContainer}>
              <label
                htmlFor="name"
                className={`${commonStyles.animatedLabel} ${
                  name ? commonStyles.labelIsAnimated : ""
                }`}
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                value={name}
                className={commonStyles.authInput}
                onChange={(e) => setName(e.target.value)}
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
                name="email"
                type="email"
                value={email}
                className={commonStyles.authInput}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </>
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
              name="username"
              value={username}
              className={commonStyles.authInput}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
            />
            <button
              type="button"
              className={commonStyles.sideButton}
              title="username can only included lowercase letters and numbers"
            >
              <FontAwesomeIcon icon={faExclamationCircle} />
            </button>
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
              name="password"
              type={isShowingPassword ? "text" : "password"}
              value={password}
              className={commonStyles.authInput}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={commonStyles.sideButton}
              onMouseDown={() => setIsShowingPassword(true)}
              onMouseUp={() => setIsShowingPassword(false)}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
          {formError && (
            <p className={signInFormStyles.formErrorText}>{formError}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={buttonsStyles.primaryButton}
          >
            {isLoading ? <ButtonSyncLoader /> : "Sign In"}
          </button>
          <div className={signInFormStyles.textButtonsContainer}>
            <button
              type="button"
              className={buttonsStyles.textButton}
              onClick={() => toggleAuthMode()}
            >
              Login instead
            </button>
          </div>
        </form>
      )}
      <div className={signInFormStyles.sectionDivider}></div>
      <div className={signInFormStyles.authBoxSection}>
        <ThirdPartyAuthButtons />
      </div>
    </div>
  );
}
