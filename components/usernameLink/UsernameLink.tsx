import Link from "next/link";
import usernameStyles from "./UsernameLink.module.css";

export default function UsernameLink({ username }: { username: string }) {
  return (
    <Link
      href={{
        pathname: "/profile",
        query: { user: username },
      }}
    >
      <span className={usernameStyles.username}>@{username}</span>
    </Link>
  );
}
