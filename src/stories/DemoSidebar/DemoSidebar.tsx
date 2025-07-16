import { useRef } from 'react';
import { useSidebar } from '../../useSidebar';

export function DemoSidebar() {
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebar = useSidebar({
    sidebarRef,
    breakpoints: {
      full: 992,
      mini: 768,
      hidden: 0,
    },
  });

  return (
    <aside ref={sidebarRef}>
      Test
      <br />
      <b onClick={() => sidebar.toggle()}>
        <pre>{JSON.stringify(sidebar, null, 2)}</pre>
      </b>
    </aside>
  );
}
