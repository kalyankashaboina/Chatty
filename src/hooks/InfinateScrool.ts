import { useEffect, useState, RefObject } from 'react';

interface UseInfiniteScrollProps {
  containerRef: RefObject<HTMLElement | null>;
  isWindow?: boolean;
  threshold?: number;
  onTopReach?: () => void;
  onBottomReach?: () => void;
  throttleMs?: number;
}

// Throttle helper — returns a throttled function that uses a ref internally to track timing
const throttle = (func: () => void, limit: number) => {
  let lastFunc: number;
  let lastRan: number;
  return () => {
    const now = Date.now();
    if (!lastRan) {
      func();
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(
        function () {
          if (now - lastRan >= limit) {
            func();
            lastRan = now;
          }
        },
        limit - (now - lastRan)
      );
    }
  };
};

const useInfiniteScroll = ({
  containerRef,
  isWindow = false,
  threshold = 1,
  onTopReach,
  onBottomReach,
  throttleMs = 100, // changed default to 100ms for better throttling
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
      } else if (container === window) {
        // Window scroll values
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;

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
      window.addEventListener('scroll', throttledScrollHandler);
    } else if (containerRef.current) {
      containerRef.current.addEventListener('scroll', throttledScrollHandler);
    }

    // Initial check on mount
    throttledScrollHandler();

    return () => {
      if (isWindow) {
        window.removeEventListener('scroll', throttledScrollHandler);
      } else if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', throttledScrollHandler);
      }
    };
  }, [containerRef, isWindow, threshold, onTopReach, onBottomReach, throttleMs]);

  return { isAtTop, isAtBottom };
};

export default useInfiniteScroll;
