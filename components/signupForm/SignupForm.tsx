import { useState } from "react";
import { loginSetterAsProp } from "../../interfaces/Common.interface";
import { signupFormProps } from "../../interfaces/SignupForm.interface";
import SignupFormFirstStep from "../signupFormFirstStep/SignupFormFirstStep";
import SignupFormSecondStep from "../signupFormSecondStep/SignupFormSecondStep";

export default function SignupForm({
  toLoginSetter,
  loginSetter,
}: signupFormProps) {
  const [onSignupStep, setOnSignupStep] = useState<1 | 2>(1);
  return onSignupStep === 1 ? (
    <SignupFormFirstStep
      signupStepSetter={setOnSignupStep}
      toLoginSetter={toLoginSetter}
    />
  ) : (
    <SignupFormSecondStep loginSetter={loginSetter} />
  );
}
