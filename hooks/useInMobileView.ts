import { useEffect, useState } from "react";

export default function useInMobileView() {
  const [inMobileView, setInMobileView] = useState<boolean>(
    window.matchMedia("(max-width: 950px)").matches
  );

  useEffect(
    () =>
      window
        .matchMedia("(max-width: 950px)")
        .addEventListener("change", (e) => setInMobileView(e.matches)),
    []
  );

  return { inMobileView };
}
