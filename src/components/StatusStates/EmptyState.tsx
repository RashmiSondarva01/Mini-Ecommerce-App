import styles from './StatusStates.module.scss';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className={styles.statusBlock}>
      <p className={styles.statusTitle}>Nothing here yet</p>
      <p className={styles.statusMessage}>{message}</p>
    </div>
  );
}
