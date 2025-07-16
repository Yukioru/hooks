import styles from './DemoPage.module.css';
import { DemoSidebar } from '../DemoSidebar';
import { useRef } from 'react';
import { type DemoSidebarRef } from '../DemoSidebar/DemoSidebar';

export function DemoPage() {
  const sidebarRef = useRef<DemoSidebarRef | null>(null);
  return (
    <div data-page="true" className={styles.page}>
      <DemoSidebar ref={sidebarRef} />
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => sidebarRef.current?.toggle()}
          style={{ position: 'fixed', top: 10, right: 10 }}
        >
          Toggle Sidebar
        </button>
      </div>
    </div>
  );
}
