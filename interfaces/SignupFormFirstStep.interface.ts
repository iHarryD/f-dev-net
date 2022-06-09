import { Dispatch, SetStateAction } from "react";
import { toLoginSetter } from "./Common.type";

export interface firstStepProps {
  signupStepSetter: Dispatch<SetStateAction<1 | 2>>;
  toLoginSetter: toLoginSetter;
}
