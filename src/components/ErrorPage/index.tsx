import styles from './index.module.css';
import {PropsWithChildren} from 'react';

export default function ErrorPage({children}: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <p>{children}</p>
    </div>
  );
}
