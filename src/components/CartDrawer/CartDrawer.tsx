import { useCart } from '../../context/CartContext';
import { CartItem } from '../CartItem/CartItem';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartDrawer.module.scss';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal, shipping, grandTotal } = useCart();

  return (
    <>
      <div
        className={styles.backdrop}
        data-open={isDrawerOpen || undefined}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside className={styles.drawer} data-open={isDrawerOpen || undefined} aria-label="Shopping cart" aria-hidden={!isDrawerOpen}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Your Cart</h2>
          <button type="button" className={styles.closeButton} onClick={closeDrawer} aria-label="Close cart">
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <button type="button" className={styles.continueButton} onClick={closeDrawer}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {items.map((item) => (
                <CartItem key={item.key} item={item} />
              ))}
            </div>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <button type="button" className={styles.continueButton} onClick={closeDrawer}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
