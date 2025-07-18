import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
  type HTMLProps,
  type ReactNode,
} from 'react';
import { useSidebar, type UseSidebarReturn } from '../../useSidebar';
import clsx from 'clsx';

import styles from './DemoSidebar.module.css';

export type DemoSidebarRef = UseSidebarReturn<'hidden' | 'mini' | 'full'> & {
  sidebarRef: HTMLElement | null;
};

interface DemoSidebarProps extends HTMLProps<HTMLElement> {
  addons?: ReactNode;
}

function DemoSidebarBase(
  { addons, ...props }: DemoSidebarProps,
  ref: ForwardedRef<DemoSidebarRef>,
) {
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebar = useSidebar({
    sidebarRef,
    hasAddons: Boolean(addons),
    closeOnOutsideClick: true,
    breakpoints: {
      full: 992,
      mini: 768,
      hidden: 0,
    },
  });

  useImperativeHandle(ref, () => ({
    ...sidebar,
    sidebarRef: sidebarRef.current,
  }));

  const isOpenState = sidebar.isOpen || sidebar.isVisible;

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
