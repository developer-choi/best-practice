import styles from './page.module.css';

export default function Loading() {
  return (
    <main className={styles.pageContainer}>
      <ul className={styles.listContainer}>
        {Array.from({length: 12}).map((_, index) => (
          <li key={index} className={styles.videoItem}>
            <div className={`${styles.videoThumbnail} ${styles.skeletonBox}`}/>
            <div className={styles.videoDetails}>
              <div className={`${styles.skeletonBox} ${styles.videoTitleLine}`}/>
              <div className={`${styles.skeletonBox} ${styles.videoMetaLine}`}/>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}