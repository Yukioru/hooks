import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type RefObject,
} from 'react';
import { useContainerWidth } from './useContainerWidth';
import { useClickOutside } from './useClickOutside';

export interface UseSidebarOptions<
  StateName extends string = 'hidden' | 'mini' | 'full',
  InitialOpen extends boolean = false,
> {
  containerRef?: RefObject<HTMLElement>;
  sidebarRef: RefObject<HTMLElement | null>;
  breakpoints: Partial<Record<StateName, number>>;
  initialOpen?: InitialOpen;
  onStateChange?: (state: StateName) => void;
  onVisibilityChange?: (visible: boolean) => void;
  closeOnOutsideClick?: boolean;
  hoverOpenDelay?: number;
  hoverCloseDelay?: number;
  hasAddons?: boolean;
}

export interface UseSidebarReturn<
  StateName extends string = 'hidden' | 'mini' | 'full',
> {
  layoutState: StateName;
  contentLayoutState: StateName;
  states: Record<StateName, boolean>;
  isOpen: boolean;
  isVisible: boolean;
  toggle: (next?: boolean) => void;
}

export function useSidebar<
  StateName extends string = 'hidden' | 'mini' | 'full',
  InitialOpen extends boolean = false,
>(
  options: UseSidebarOptions<StateName, InitialOpen>,
): UseSidebarReturn<StateName> {
  const {
    containerRef,
    sidebarRef,
    breakpoints,
    initialOpen = false as InitialOpen,
    onStateChange,
    onVisibilityChange,
    closeOnOutsideClick = false,
    hoverOpenDelay = 0,
    hoverCloseDelay = 0,

    hasAddons = false,
  } = options;

  const sortedEntries = useMemo(
    () =>
      (Object.entries(breakpoints) as [StateName, number][]).sort(
        ([, a], [, b]) => a - b,
      ),
    [breakpoints],
  );

  const bpArray = useMemo(
    () => sortedEntries.map(([, bp]) => bp) as readonly number[],
    [sortedEntries],
  );

  const bpFlags = useContainerWidth({
    ref: containerRef,
    breakpoints: bpArray,
  }) as Record<number, boolean>;

  const states = useMemo((): Record<StateName, boolean> => {
    return sortedEntries.reduce(
      (acc, [key, bp]) => {
        acc[key] = Boolean(bpFlags[bp]);
        return acc;
      },
      {} as Record<StateName, boolean>,
    );
  }, [bpFlags, sortedEntries]);

  const layoutState = useMemo((): StateName => {
    let curr = sortedEntries[0][0];
    for (const [key] of sortedEntries) {
      if (states[key]) curr = key;
      else break;
    }
    return curr;
  }, [states, sortedEntries]);

  const miniKey = useMemo(() => {
    const found = sortedEntries.find(([key]) => key === 'mini');
    return found ? found[0] : sortedEntries[0][0];
  }, [sortedEntries]);

  useEffect(() => {
    onStateChange?.(layoutState);
  }, [layoutState, onStateChange]);

  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const toggle = useCallback((next?: boolean) => {
    setIsOpen((prev) => (typeof next === 'boolean' ? next : !prev));
  }, []);

  const contentLayoutState = useMemo((): StateName => {
    if (!hasAddons) return layoutState;
    if (isOpen && layoutState === sortedEntries[0][0]) {
      return miniKey;
    }
    const idx = sortedEntries.findIndex(([key]) => key === layoutState);
    const miniIdx = sortedEntries.findIndex(([key]) => key === miniKey);
    if (idx < miniIdx) return layoutState;
    return miniKey;
  }, [hasAddons, layoutState, isOpen, sortedEntries, miniKey]);

  useEffect(() => {
    if (layoutState === 'mini') setIsOpen(false);
  }, [layoutState]);

  useEffect(() => {
    if (layoutState !== 'mini') return;
    const el = sidebarRef.current;
    if (!el) return;

    let openId: number, closeId: number;
    const onEnter = () => {
      clearTimeout(closeId);
      openId = setTimeout(() => setIsOpen(true), hoverOpenDelay);
    };
    const onLeave = () => {
      clearTimeout(openId);
      closeId = setTimeout(() => setIsOpen(false), hoverCloseDelay);
    };

    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      clearTimeout(openId);
      clearTimeout(closeId);
    };
  }, [layoutState, sidebarRef, hoverOpenDelay, hoverCloseDelay]);

  const fullKey = sortedEntries[sortedEntries.length - 1][0];
  const isVisible = useMemo(
    () => layoutState === fullKey || isOpen,
    [layoutState, isOpen, fullKey],
  );

  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  useClickOutside(sidebarRef, () => setIsOpen(false), {
    disabled: !closeOnOutsideClick || !isVisible || layoutState === fullKey,
  });

  return useMemo(
    () => ({
      layoutState,
      contentLayoutState,
      states,
      isOpen,
      isVisible,
      hasAddons,
      toggle,
    }),
    [
      layoutState,
      contentLayoutState,
      states,
      isOpen,
      isVisible,
      hasAddons,
      toggle,
    ],
  );
}
