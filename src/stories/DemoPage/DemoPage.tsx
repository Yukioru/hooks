import type { PropsWithChildren } from 'react';

import styles from './DemoPage.module.css';

export function DemoPage({ children }: PropsWithChildren) {
  return (
    <div data-page="true" className={styles.page}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
