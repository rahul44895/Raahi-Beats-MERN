import { useEffect, useState } from "react";

// Measures on mount/resize only, instead of the caller reading ref.current.offsetHeight
// inline during every render (which forces a layout read on every unrelated re-render).
export default function useElementHeight(ref) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    let ticking = false;
    const updateHeight = () => {
      setHeight(ref.current.offsetHeight);
      ticking = false;
    };
    const handleResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  return height;
}
