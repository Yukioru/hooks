import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
  type HTMLProps,
} from 'react';
import { useSidebar, type UseSidebarReturn } from '../../useSidebar';
import clsx from 'clsx';

import styles from './DemoSidebar.module.css';

export type DemoSidebarRef = UseSidebarReturn<'hidden' | 'mini' | 'full'> & {
  sidebarRef: HTMLElement | null;
};

function DemoSidebarBase(
  props: HTMLProps<HTMLElement>,
  ref: ForwardedRef<DemoSidebarRef>,
) {
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebar = useSidebar({
    sidebarRef,
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

  return (
    <aside
      ref={sidebarRef}
      className={clsx(styles.sidebar, {
        [styles.open]: sidebar.isOpen || sidebar.isVisible,
        [styles.mini]: sidebar.layoutState === 'mini',
      })}
      {...props}
    >
      Test
      <br />
      <br />
      <br />
      Sidebar content
      <br />
      <br />
      <pre style={{ position: 'fixed', right: '-100%' }}>
        {JSON.stringify(sidebar, null, 2)}
      </pre>
    </aside>
  );
}

export const DemoSidebar = forwardRef(DemoSidebarBase);
