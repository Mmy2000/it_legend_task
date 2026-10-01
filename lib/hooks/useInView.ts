"use client";

import { useEffect, useRef, useState } from "react";

/** Becomes `true` the first time the element scrolls into view (and stays true). */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.4 }) {
  const ref = useRef<T>(null);
  // Without IntersectionObserver support, treat the element as visible.
  const [inView, setInView] = useState(
    () => typeof window !== "undefined" && typeof IntersectionObserver === "undefined",
  );
  const { threshold, rootMargin } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node || inView || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold, rootMargin]);

  return [ref, inView] as const;
}
