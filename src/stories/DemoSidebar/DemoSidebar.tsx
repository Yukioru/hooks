import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
  type HTMLProps,
  type ReactNode,
} from 'react';
import {
  useSidebar,
  type UseSidebarOptions,
  type UseSidebarReturn,
} from '../../useSidebar';
import clsx from 'clsx';

import styles from './DemoSidebar.module.css';

export type DemoSidebarRef = UseSidebarReturn<'hidden' | 'mini' | 'full'> & {
  sidebarRef: HTMLElement | null;
};

type DemoSidebarProps = Omit<UseSidebarOptions, 'sidebarRef'> &
  HTMLProps<HTMLElement> & {
    addons?: ReactNode;
  };

function DemoSidebarBase(
  {
    addons,
    containerRef,
    breakpoints,
    initialOpen,
    onStateChange,
    onVisibilityChange,
    closeOnOutsideClick,
    hoverOpenDelay,
    hoverCloseDelay,
    hasAddons,
    ...props
  }: DemoSidebarProps,
  ref: ForwardedRef<DemoSidebarRef>,
) {
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebar = useSidebar({
    sidebarRef,
    containerRef,
    breakpoints,
    initialOpen,
    onStateChange,
    onVisibilityChange,
    closeOnOutsideClick,
    hoverOpenDelay,
    hoverCloseDelay,
    hasAddons,
  });

  useImperativeHandle(ref, () => ({
    ...sidebar,
    sidebarRef: sidebarRef.current,
  }));

  const isOpenState = sidebar.isOpen || sidebar.layoutState === 'full';

  return (
    <>
      <aside
        ref={sidebarRef}
        className={clsx(styles.sidebar, {
          [styles.open]: isOpenState,
          [styles.mini]: sidebar.layoutState === 'mini',
        })}
        {...props}
      >
        <div
          className={clsx(styles.content, {
            [styles.mini]: sidebar.contentLayoutState === 'mini',
          })}
        >
          Test
          <br />
          <br />
          <br />
          Sidebar content
          <br />
          <br />
        </div>
        {addons && (
          <div
            className={clsx(styles.addons, {
              [styles.hidden]: sidebar.layoutState !== 'full' && !isOpenState,
            })}
          >
            {addons}
          </div>
        )}
      </aside>
      <pre style={{ position: 'fixed', right: '10%', top: '10%' }}>
        {JSON.stringify(sidebar, null, 2)}
      </pre>
    </>
  );
}

export const DemoSidebar = forwardRef(DemoSidebarBase);
