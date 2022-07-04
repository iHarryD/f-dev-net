import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import InitialFullPageLoader from "../initialFullPageLoader/InitialFullPageLoader";

export default function AuthUIHandler({ children }: { children: ReactNode }) {
  const { status } = useSession();
  return status === "loading" ? <InitialFullPageLoader /> : children;
}
