import SyncLoader from "react-spinners/SyncLoader";
import { loaderCSSOverrides } from "../../data/loaderCSS";

export function ButtonSyncLoader({ color }: { color?: string }) {
  return (
    <span>
      <SyncLoader
        size={8}
        cssOverride={loaderCSSOverrides}
        color={color}
      />
    </span>
  );
}
