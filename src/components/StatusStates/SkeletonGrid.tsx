import styles from './StatusStates.module.scss';

interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 8 }: SkeletonGridProps) {
  return (
    <div className={styles.skeletonGrid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
        </div>
      ))}
    </div>
  );
}
