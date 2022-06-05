import { Dispatch, SetStateAction } from "react";
import { loginSetter, toLoginSetter } from "./Common.type";

export interface loggedOutSidebarProps {
  toLoginSetter: toLoginSetter;
  loginSetter: loginSetter;
}
