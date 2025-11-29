// src/hooks/useInfiniteScroll.test.tsx
import { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import useInfiniteScroll from './InfinateScrool'; // match your actual hook filename

// Helper component to test the hook
const TestComponent = ({
  onTopReach,
  onBottomReach,
  containerHeight = 100,
  contentHeight = 300,
  isWindow = false,
}: {
  onTopReach?: () => void;
  onBottomReach?: () => void;
  containerHeight?: number;
  contentHeight?: number;
  isWindow?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isAtTop, isAtBottom } = useInfiniteScroll({
    containerRef,
    onTopReach,
    onBottomReach,
    isWindow,
    threshold: 1,
    throttleMs: 0, // no throttle for testing
  });

  return (
    <div
      ref={containerRef}
      data-testid="scroll-container"
      style={{
        height: containerHeight,
        overflowY: 'auto',
        border: '1px solid black',
      }}
    >
      <div
        style={{
          height: contentHeight,
        }}
      >
        <p>isAtTop: {isAtTop ? 'true' : 'false'}</p>
        <p>isAtBottom: {isAtBottom ? 'true' : 'false'}</p>
      </div>
    </div>
  );
};

describe('useInfiniteScroll', () => {
  it('should detect scroll to bottom', () => {
    const onBottomReach = jest.fn();
    const { getByTestId } = render(<TestComponent onBottomReach={onBottomReach} />);

    const container = getByTestId('scroll-container');

    // Simulate scroll to bottom
    fireEvent.scroll(container, { target: { scrollTop: 200 } });

    expect(onBottomReach).toHaveBeenCalled();
  });

  it('should detect scroll to top', () => {
    const onTopReach = jest.fn();
    const { getByTestId } = render(<TestComponent onTopReach={onTopReach} />);

    const container = getByTestId('scroll-container');

    // Scroll to bottom first
    fireEvent.scroll(container, { target: { scrollTop: 200 } });
    // Scroll back to top
    fireEvent.scroll(container, { target: { scrollTop: 0 } });

    expect(onTopReach).toHaveBeenCalled();
  });

  it('should handle window scroll', () => {
    const onBottomReach = jest.fn();
    const onTopReach = jest.fn();

    render(<TestComponent onBottomReach={onBottomReach} onTopReach={onTopReach} isWindow />);

    // Mock window.scrollY and document.documentElement.scrollTop/Height
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 100 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, value: 300 });
    Object.defineProperty(window, 'scrollY', { writable: true, value: 200 });

    fireEvent.scroll(window);

    expect(onBottomReach).toHaveBeenCalled();

    // Scroll back to top
    (window.scrollY as number) = 0;
    fireEvent.scroll(window);

    expect(onTopReach).toHaveBeenCalled();
  });
});
