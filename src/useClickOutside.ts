import { useEffect, useRef, type RefObject } from 'react';

export interface UseClickOutsideOptions {
  excludeRefs?: RefObject<HTMLElement | null>[];
  disabled?: boolean;
  passive?: boolean;
  capture?: boolean;
  handleEsc?: boolean;
  containerRef?: RefObject<HTMLElement | null>;
}

type Handler = (event: Event) => void;

export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: Handler,
  options: UseClickOutsideOptions = {},
): void {
  const {
    excludeRefs = [],
    disabled = false,
    passive = true,
    capture = false,
    handleEsc = true,
    containerRef,
  } = options;

  const hadDownInside = useRef(false);
  const pointerId = useRef<number | null>(null);

  const handlerRef = useRef<Handler>(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (disabled) return;

    const root: EventTarget | null =
      containerRef?.current ??
      (typeof document !== 'undefined' ? document : null);
    if (!root) return;

    const mainRefs = Array.isArray(refs) ? refs : [refs];
    const allRefs = [...mainRefs, ...excludeRefs];

    const supportPointer =
      typeof window !== 'undefined' && 'PointerEvent' in window;
    const downEvents = supportPointer
      ? ['pointerdown']
      : ['mousedown', 'touchstart'];
    const upEvents = supportPointer ? ['pointerup'] : ['mouseup', 'touchend'];
    const cancelEvents = supportPointer ? ['pointercancel'] : [];

    const isInside = (e: Event): boolean => {
      const path = e.composedPath();
      return allRefs.some((ref) =>
        path.some(
          (node) => node instanceof Node && ref.current?.contains(node),
        ),
      );
    };

    const onDown: EventListener = (e) => {
      hadDownInside.current = isInside(e);
      if (supportPointer && e instanceof PointerEvent) {
        pointerId.current = e.pointerId;
      }
    };

    const onUp: EventListener = (e) => {
      if (supportPointer && e instanceof PointerEvent) {
        if (e.pointerId !== pointerId.current) return;
      }
      const upInside = isInside(e);
      if (!hadDownInside.current && !upInside) {
        handlerRef.current(e);
      }
      pointerId.current = null;
    };

    const onCancel: EventListener = (e) => {
      if (
        supportPointer &&
        e instanceof PointerEvent &&
        e.pointerId === pointerId.current
      ) {
        hadDownInside.current = false;
        pointerId.current = null;
      }
    };

    const onKey: EventListener = (e) => {
      if (handleEsc && e instanceof KeyboardEvent && e.key === 'Escape') {
        handlerRef.current(e);
      }
    };

    const unsubscribes: Array<() => void> = [];

    const subscribe = (
      target: EventTarget,
      type: string,
      listener: EventListener,
    ) => {
      const opts: AddEventListenerOptions = { passive, capture };
      let ctrl: AbortController | undefined;
      if (typeof AbortController !== 'undefined') {
        ctrl = new AbortController();
        opts.signal = ctrl.signal;
      }
      target.addEventListener(type, listener, opts);
      unsubscribes.push(() => {
        if (ctrl) ctrl.abort();
        else (target as any).removeEventListener(type, listener, { capture });
      });
    };

    downEvents.forEach((ev) => subscribe(root, ev, onDown));
    upEvents.forEach((ev) => subscribe(root, ev, onUp));
    cancelEvents.forEach((ev) => subscribe(root, ev, onCancel));
    if (handleEsc) subscribe(root, 'keydown', onKey);

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [
    ...(Array.isArray(refs) ? refs.map((r) => r.current) : [refs.current]),
    ...excludeRefs.map((r) => r.current),
    disabled,
    passive,
    capture,
    handleEsc,
    containerRef?.current,
  ]);
}
