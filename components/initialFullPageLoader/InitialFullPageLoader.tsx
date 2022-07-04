import loaderStyles from "./InitialFullPageLoader.module.css";
import { HashLoader } from "react-spinners";

export default function InitialFullPageLoader() {
  return (
    <main className={loaderStyles.loaderContainer}>
      <HashLoader loading={true} color="#4df7ff" />
    </main>
  );
}
