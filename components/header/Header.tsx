import headerStyles from "./Header.module.css";
import { MacroNavbar } from "../navbar/Navbar";

export default function Header() {
  return (
    <header className={headerStyles.header}>
      <MacroNavbar />
    </header>
  );
}
