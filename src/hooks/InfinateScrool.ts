import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

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
        limit - (now - lastRan),
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
  throttleMs = 100,
}: UseInfiniteScrollProps) => {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const container = isWindow ? window : containerRef.current;
    if (!container) return;

    const scrollHandler = () => {
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

    // ✅ Attach listener
    if (container instanceof HTMLElement || container === window) {
      container.addEventListener('scroll', throttledScrollHandler);
    }

    // ✅ Run initial check
    throttledScrollHandler();

    return () => {
      // ✅ Remove from the same cached container
      if (container instanceof HTMLElement || container === window) {
        container.removeEventListener('scroll', throttledScrollHandler);
      }
    };
  }, [containerRef, isWindow, threshold, onTopReach, onBottomReach, throttleMs]);

  return { isAtTop, isAtBottom };
};

export default useInfiniteScroll;
