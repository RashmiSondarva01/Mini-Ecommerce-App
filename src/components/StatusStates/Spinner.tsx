import styles from './StatusStates.module.scss';

export function Spinner() {
  return <span className={styles.spinner} role="status" aria-label="Loading" />;
}
