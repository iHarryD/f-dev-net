import SyncLoader from "react-spinners/SyncLoader";
import { loaderCSSOverrides } from "../../database/loaderCSS";

export function ButtonSyncLoader() {
  return (
    <div>
      <SyncLoader size={8} cssOverride={loaderCSSOverrides} />
    </div>
  );
}
