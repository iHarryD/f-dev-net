import { FormEvent, useState } from "react";
import commonStyles from "../../styles/Common.module.css";
import ThirdPartyAuthButtons from "../thirdPartyAuthButtons/ThirdPartyAuthButtons";
import buttonsStyles from "../../styles/Buttons.module.css";
import signInFormStyles from "./SignInForm.module.css";
import { login } from "../../services/authServices";
import { useAuth } from "../../contexts/AuthContext";

export default function SignInForm() {
  const { setUserCredentials } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (authMode === "login") {
      login({ username, password }, setIsLoading, (result) => {
        setUserCredentials({
          user: result.data.data.user,
          token: result.data.data.token,
        });
      });
    } else {
    }
  }

  return (
    <div className={commonStyles.authBoxContainer}>
      <form
        className={signInFormStyles.authBoxSection}
        onSubmit={(e) => handleSubmit(e)}
      >
        {authMode === "signup" && (
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
                value={email}
                className={commonStyles.authInput}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </>
        )}
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
            value={password}
            className={commonStyles.authInput}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={buttonsStyles.primaryButton}>
          Sign in
        </button>

        <button
          className={buttonsStyles.textButton}
          onClick={() =>
            setAuthMode((prev) => {
              if (prev === "login") {
                return "signup";
              } else {
                return "login";
              }
            })
          }
        >
          {authMode === "signup"
            ? "Login instead."
            : "I don't have an account."}
        </button>
        {authMode === "login" && (
          <button
            className={buttonsStyles.textButton}
            onClick={() => {
              setUsername("harry");
              setPassword("shazam");
            }}
          >
            Login using test credentials.
          </button>
        )}
      </form>
      <div className={signInFormStyles.sectionDivider}></div>
      <div className={signInFormStyles.authBoxSection}>
        <ThirdPartyAuthButtons />
      </div>
    </div>
  );
}
