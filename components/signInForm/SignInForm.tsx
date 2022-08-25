import { FormEvent, useEffect, useState } from "react";
import commonStyles from "../../styles/Common.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import signInFormStyles from "./SignInForm.module.css";
import { login as loginService, signup } from "../../services/authServices";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import { emailRegExp } from "../../regExp";
import { extractErrorMessage } from "../../helpers/extractErrorMessage";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
import Tippy from "@tippyjs/react";
import useDebounce from "../../hooks/useDebounce";
import { searchUsers } from "../../services/userServices";

const testingCredentials = {
  username: "harry",
  password: "strongpassword",
};

export default function SignInForm() {
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
  const debouncedValue = useDebounce(username, 500);

  useEffect(() => {
    if (authMode === "signup" && username.length) {
      searchUsers(username, undefined, (result) => {
        if (result.data.data.find((user) => user.username === username)) {
          setAuthError(`Username '${username}' is taken.`);
        }
      });
    } else {
      setAuthError(null);
    }
  }, [debouncedValue]);

  function resetForm() {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setAuthError(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError(null);
    if (authMode === "login") {
      if (username === "" || password === "") {
        setAuthError("Please fill in the required fields.");
        return;
      }
      loginService({ username, password }, setIsLoading, (result) => {
        dispatch(
          login({ user: result.data.data.user, token: result.data.data.token })
        );
      });
    } else {
      if (email === "" || username === "" || password === "" || name === "") {
        setAuthError("Please fill in the required fields.");
        return;
      }
      if (emailRegExp.test(email) === false) {
        setAuthError("Enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
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
          setAuthError(error);
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
          {authError && (
            <p className={signInFormStyles.authErrorText}>{authError}</p>
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
              I do not have an account
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
            <Tippy content="username can only consist of lowercase letters and numbers">
              <button type="button" className={commonStyles.sideButton}>
                <FontAwesomeIcon icon={faExclamationCircle} />
              </button>
            </Tippy>
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
          {authError && (
            <p className={signInFormStyles.authErrorText}>{authError}</p>
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
      {/* <div className={signInFormStyles.sectionDivider}></div> */}
      {/* <div className={signInFormStyles.authBoxSection}>
        <ThirdPartyAuthButtons />
      </div> */}
    </div>
  );
}
