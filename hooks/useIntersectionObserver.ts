import { RefObject, useEffect, useState } from "react";

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export default function useIntersectionObserver(
  elementRef: RefObject<Element>,
  { threshold = 0.5, root = null, rootMargin = "0%" }: Args
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = elementRef.current;

    if (node === null) return;

    const observer = new IntersectionObserver(([entry]) => setEntry(entry), {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef.current, JSON.stringify(threshold), root, rootMargin]);

  return entry;
}
