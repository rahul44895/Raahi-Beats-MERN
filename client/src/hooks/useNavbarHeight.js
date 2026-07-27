import { useEffect, useState } from "react";

// Navbar is a global singleton (always mounted in App.js) with no shared context,
// so height is read via the DOM rather than prop-drilled/context-shared.
export default function useNavbarHeight() {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let ticking = false;
    const updateHeight = () => {
      setNavbarHeight(navbar.offsetHeight);
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
  }, []);

  return navbarHeight;
}
