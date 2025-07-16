import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  type RefObject,
} from 'react';

interface UseContainerWidthOptions {
  ref?: RefObject<HTMLElement>;
  initialWidth?: number | null;
}

export function useContainerWidth(
  options?: UseContainerWidthOptions & { breakpoints?: undefined },
): number;

export function useContainerWidth<const BP extends readonly number[]>(
  options: UseContainerWidthOptions & { breakpoints: BP },
): { [K in BP[number]]: boolean };

export function useContainerWidth<const BP extends readonly number[]>(
  options: UseContainerWidthOptions & { breakpoints?: BP } = {},
): number | { [K in BP[number]]: boolean } {
  const { ref, breakpoints, initialWidth } = options;

  const breakpointsKey = useMemo(
    () => (breakpoints ? [...breakpoints].sort((a, b) => a - b).join(',') : ''),
    [breakpoints],
  );
  const stableBps = useMemo<number[] | undefined>(() => {
    return breakpointsKey
      ? (breakpointsKey.split(',').map((s) => Number(s)) as number[])
      : undefined;
  }, [breakpointsKey]);

  const getWidth = useCallback((): number => {
    if (ref?.current) {
      return ref.current.getBoundingClientRect().width;
    }
    return window.innerWidth;
  }, [ref]);

  const isSSR = typeof window === 'undefined';
  const DEFAULT_SSR_WIDTH = 1024;
  const startWidth = isSSR
    ? initialWidth != null
      ? initialWidth
      : DEFAULT_SSR_WIDTH
    : getWidth();

  const [width, setWidth] = useState<number>(() => startWidth);
  const [bpState, setBpState] = useState<Record<number, boolean>>(() => {
    if (!stableBps) return {};
    return stableBps.reduce(
      (acc, bp) => {
        acc[bp] = startWidth >= bp;
        return acc;
      },
      {} as Record<number, boolean>,
    );
  });

  const handleResize = useCallback(() => {
    const w = getWidth();
    if (!stableBps) {
      setWidth(w);
    } else {
      setBpState((prev) => {
        const next = stableBps.reduce(
          (acc, bp) => {
            acc[bp] = w >= bp;
            return acc;
          },
          {} as Record<number, boolean>,
        );
        const changed = stableBps.some((bp) => prev[bp] !== next[bp]);
        return changed ? next : prev;
      });
    }
  }, [getWidth, stableBps]);

  const useIsoEffect = !isSSR ? useLayoutEffect : useEffect;

  useIsoEffect(() => {
    handleResize();

    let cleanup: () => void = () => {};

    if (ref?.current && typeof ResizeObserver !== 'undefined') {
      const obs = new ResizeObserver(handleResize);
      obs.observe(ref.current);
      cleanup = () => void obs.disconnect();
    } else if (typeof window !== 'undefined') {
      let frameId = 0;
      const listener = () => {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(handleResize);
      };

      const opts: AddEventListenerOptions = { passive: true };
      let controller: AbortController | undefined;

      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        opts.signal = controller.signal;
      }

      window.addEventListener('resize', listener, opts);
      cleanup = () => {
        if (controller) controller.abort();
        else window.removeEventListener('resize', listener, opts);
      };
    }

    return cleanup;
  }, [handleResize, ref, breakpointsKey]);

  return (stableBps ? bpState : width) as BP extends readonly number[]
    ? { [K in BP[number]]: boolean }
    : number;
}
