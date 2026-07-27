import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 1000;

// Centralizes the 1000px breakpoint hardcoded independently across several files,
// and keeps it live across resize (several of the call sites it replaces only read
// window.innerWidth inline and didn't update until some unrelated re-render).
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    let ticking = false;
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      ticking = false;
    };
    const handleResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateIsMobile);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
