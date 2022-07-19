import { ReactNode } from "react";
import Header from "../header/Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header /> <main>{children}</main>
    </>
  );
}
