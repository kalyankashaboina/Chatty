import { useEffect, useState, RefObject } from "react";

interface UseInfiniteScrollProps {
  containerRef: RefObject<HTMLElement | null>;
  isWindow?: boolean;
  threshold?: number;
  onTopReach?: () => void;
  onBottomReach?: () => void;
  throttleMs?: number;
}

// ✅ Simple throttle helper
const throttle = (func: () => void, limit: number) => {
  let inThrottle: boolean;
  return () => {
    if (!inThrottle) {
      func();
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const useInfiniteScroll = ({
  containerRef,
  isWindow = false,
  threshold = 100,
  onTopReach,
  onBottomReach,
  throttleMs = 500, // Default throttle time
}: UseInfiniteScrollProps) => {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      const container = isWindow ? window : containerRef.current;
      if (!container) return;

      if (container instanceof HTMLElement) {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        const nearTop = scrollTop <= threshold;
        const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

        setIsAtTop(nearTop);
        setIsAtBottom(nearBottom);

        if (nearTop && onTopReach) onTopReach();
        if (nearBottom && onBottomReach) onBottomReach();
      }
    };

    const throttledScrollHandler = throttle(scrollHandler, throttleMs);

    if (isWindow) {
      window.addEventListener("scroll", throttledScrollHandler);
    } else if (containerRef.current) {
      containerRef.current.addEventListener("scroll", throttledScrollHandler);
    }

    return () => {
      if (isWindow) {
        window.removeEventListener("scroll", throttledScrollHandler);
      } else if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", throttledScrollHandler);
      }
    };
  }, [containerRef, isWindow, threshold, onTopReach, onBottomReach, throttleMs]);

  return { isAtTop, isAtBottom };
};

export default useInfiniteScroll;
