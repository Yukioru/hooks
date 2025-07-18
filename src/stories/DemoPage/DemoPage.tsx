import styles from './DemoPage.module.css';
import { DemoSidebar } from '../DemoSidebar';
import { useRef, useState, type ReactNode } from 'react';
import { type DemoSidebarRef } from '../DemoSidebar/DemoSidebar';

export function DemoPage() {
  const sidebarRef = useRef<DemoSidebarRef | null>(null);
  const [content, setContent] = useState<ReactNode | null>(null);

  const handleContentChange = (newContent: ReactNode) => {
    setContent(newContent);
  };

  return (
    <div data-page="true" className={styles.page}>
      <DemoSidebar ref={sidebarRef} addons={content} />
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => sidebarRef.current?.toggle()}
          style={{ position: 'fixed', top: 10, right: 10 }}
        >
          Toggle Sidebar
        </button>
        <br />
        <button
          type="button"
          onClick={() =>
            content
              ? handleContentChange(null)
              : handleContentChange(<div>New Content</div>)
          }
          style={{ position: 'fixed', top: 40, right: 10 }}
        >
          Change Content
        </button>
      </div>
    </div>
  );
}
