import { useRef, useEffect } from "react";

const useHorizontalScroll = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const handleWheel = (event) => {
        if (event.deltaY === 0) return;
        event.preventDefault();
        container.scrollTo({
          left: container.scrollLeft + event.deltaY,
          behavior: "smooth",
        });
      };

      container.addEventListener("wheel", handleWheel);
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, []);

  return { containerRef };
};

export default useHorizontalScroll;
