import SyncLoader from "react-spinners/SyncLoader";
import { loaderCSSOverrides } from "../../data/loaderCSS";

export function ButtonSyncLoader() {
  return (
    <div>
      <SyncLoader size={8} cssOverride={loaderCSSOverrides} />
    </div>
  );
}
