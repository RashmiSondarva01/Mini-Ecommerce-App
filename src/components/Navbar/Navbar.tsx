import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Badge } from '../Badge/Badge';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { itemCount, toggleDrawer } = useCart();

  return (
    <header className={styles.navbar}>
      <div className={`app-container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          Shopfront
        </Link>
        <button
          type="button"
          className={styles.cartButton}
          onClick={toggleDrawer}
          aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="21" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="18" cy="21" r="1.2" fill="currentColor" stroke="none" />
            <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Badge count={itemCount} />
        </button>
      </div>
    </header>
  );
}
