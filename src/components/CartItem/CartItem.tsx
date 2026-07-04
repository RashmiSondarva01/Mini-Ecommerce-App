import type { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { QuantityPicker } from '../QuantityPicker/QuantityPicker';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartItem.module.scss';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className={styles.row}>
      <img src={item.image} alt={item.title} className={styles.image} />
      <div className={styles.details}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.variant}>
          {item.color} / {item.size}
        </p>
        <p className={styles.price}>{formatPrice(item.unitPrice)}</p>
        <div className={styles.actions}>
          <QuantityPicker
            quantity={item.quantity}
            maxQuantity={item.maxQuantity}
            onChange={(qty) => updateQuantity(item.key, qty)}
          />
          <button type="button" className={styles.removeButton} onClick={() => removeItem(item.key)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
