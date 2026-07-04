import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

export function NotFoundPage() {
  return (
    <div className={`app-container ${styles.page}`}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>We couldn't find the page you're looking for.</p>
      <Link to="/" className={styles.homeLink}>
        Back to Shopfront
      </Link>
    </div>
  );
}
