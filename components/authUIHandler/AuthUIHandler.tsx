import { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import InitialFullPageLoader from "../initialFullPageLoader/InitialFullPageLoader";

export default function AuthUIHandler({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  return status === "loading" ? <InitialFullPageLoader /> : children;
}
