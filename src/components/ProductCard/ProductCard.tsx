import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { makeCartKey } from '../../utils/cartKey';
import { pickDefaultSize, isSoldOut } from '../../utils/selectVariant';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openDrawer } = useCart();
  const soldOut = isSoldOut(product.sizes);
  const onSale = product.salePrice !== null;

  function handleQuickAdd() {
    const size = pickDefaultSize(product.sizes);
    if (!size) return;
    const color = product.colors[0].name;
    addItem({
      key: makeCartKey(product.id, color, size.label),
      productId: product.id,
      title: product.title,
      image: product.image,
      unitPrice: product.salePrice ?? product.price,
      color,
      size: size.label,
      maxQuantity: size.maxQuantity,
    });
    openDrawer();
  }

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.title} className={styles.image} loading="lazy" />
          {onSale && <span className={styles.saleTag}>Sale</span>}
        </div>
        <div className={styles.body}>
          <span className={styles.brand}>{product.brand}</span>
          <h3 className={styles.title}>{product.title}</h3>
          <div className={styles.priceRow}>
            {onSale && <span className={styles.originalPrice}>{formatPrice(product.price)}</span>}
            <span className={styles.price}>{formatPrice(product.salePrice ?? product.price)}</span>
          </div>
        </div>
      </Link>
      <button type="button" className={styles.quickAdd} onClick={handleQuickAdd} disabled={soldOut}>
        {soldOut ? 'Sold Out' : 'Quick Add'}
      </button>
    </div>
  );
}
