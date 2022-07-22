import { useAuth } from "../../contexts/AuthContext";
import InitialFullPageLoader from "../initialFullPageLoader/InitialFullPageLoader";

export default function AuthUIHandler({ children }: { children: JSX.Element }) {
  const { status } = useAuth();
  return status === "loading" ? <InitialFullPageLoader /> : children;
}
