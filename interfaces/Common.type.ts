import { Dispatch, SetStateAction } from "react";

export type loginSetter = Dispatch<SetStateAction<boolean>>;

export enum toLoginSetterValues {
  LOGIN,
  SIGNUP,
}

export type toLoginSetter = Dispatch<SetStateAction<toLoginSetterValues>>;
