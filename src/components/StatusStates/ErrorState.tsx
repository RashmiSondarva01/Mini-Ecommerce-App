import styles from './StatusStates.module.scss';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.statusBlock} role="alert">
      <p className={styles.statusTitle}>Something went wrong</p>
      <p className={styles.statusMessage}>{message}</p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
