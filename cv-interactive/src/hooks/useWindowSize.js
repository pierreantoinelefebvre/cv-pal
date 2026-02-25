import { useState, useEffect } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = size.w < 640;
  const isTablet = size.w >= 640 && size.w < 1024;
  const isDesktop = size.w >= 1024;

  return { ...size, isMobile, isTablet, isDesktop };
}
