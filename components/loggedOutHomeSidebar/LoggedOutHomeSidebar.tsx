import { useState } from "react";
import { toLoginSetterValues } from "../../interfaces/Common.type";
import { loggedOutSidebarProps } from "../../interfaces/LoggedOutHomeSidebar.interface";
import LoginForm from "../loginForm/LoginForm";
import SignupForm from "../signupForm/SignupForm";

export default function LoggedOutHomeSidebar({
  loginSetter,
}: loggedOutSidebarProps) {
  const [loginOrSignup, setLoginOrSignup] = useState<toLoginSetterValues>(
    toLoginSetterValues.LOGIN
  );
  return loginOrSignup === toLoginSetterValues.LOGIN ? (
    <LoginForm toLoginSetter={setLoginOrSignup} />
  ) : (
    <SignupForm loginSetter={loginSetter} toLoginSetter={setLoginOrSignup} />
  );
}
