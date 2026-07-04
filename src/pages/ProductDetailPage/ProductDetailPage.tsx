import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../context/CartContext';
import { makeCartKey } from '../../utils/cartKey';
import { pickDefaultSize } from '../../utils/selectVariant';
import { formatPrice } from '../../utils/formatPrice';
import { ImageGallery } from '../../components/ImageGallery/ImageGallery';
import { ColorSwatches } from '../../components/VariantSelector/ColorSwatches';
import { SizeButtons } from '../../components/VariantSelector/SizeButtons';
import { QuantityPicker } from '../../components/QuantityPicker/QuantityPicker';
import { Spinner } from '../../components/StatusStates/Spinner';
import { ErrorState } from '../../components/StatusStates/ErrorState';
import styles from './ProductDetailPage.module.scss';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { product, loading, error, retry } = useProduct(productId);
  const { addItem, openDrawer } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const colorParam = searchParams.get('color');
  const sizeParam = searchParams.get('size');

  const selectedColor = useMemo(() => {
    if (!product) return null;
    return product.colors.find((c) => c.name === colorParam) ?? product.colors[0];
  }, [product, colorParam]);

  const selectedSize = useMemo(() => {
    if (!product) return null;
    const requested = product.sizes.find((s) => s.label === sizeParam && s.status !== 'sold-out');
    return requested ?? pickDefaultSize(product.sizes);
  }, [product, sizeParam]);

  // Deep-linkable variant: if the URL is missing/invalid color or size, replace
  // it with the resolved defaults so the address bar always reflects state.
  useEffect(() => {
    if (!product || !selectedColor) return;
    const nextColor = selectedColor.name;
    const nextSize = selectedSize?.label ?? '';
    if (colorParam !== nextColor || sizeParam !== nextSize) {
      const next = new URLSearchParams(searchParams);
      next.set('color', nextColor);
      if (nextSize) next.set('size', nextSize);
      else next.delete('size');
      setSearchParams(next, { replace: true });
    }
  }, [product, selectedColor, selectedSize, colorParam, sizeParam, searchParams, setSearchParams]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedColor?.name, selectedSize?.label]);

  if (!id || Number.isNaN(productId)) return <Navigate to="/404" replace />;

  if (loading) {
    return (
      <div className={`app-container ${styles.centerState}`}>
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="app-container">
        <ErrorState message={error ?? 'Product not found.'} onRetry={retry} />
      </div>
    );
  }

  const unitPrice = product.salePrice ?? product.price;
  const onSale = product.salePrice !== null;
  const canAddToCart = !!selectedColor && !!selectedSize && selectedSize.status !== 'sold-out';

  function handleColorSelect(name: string) {
    const next = new URLSearchParams(searchParams);
    next.set('color', name);
    setSearchParams(next);
  }

  function handleSizeSelect(label: string) {
    const next = new URLSearchParams(searchParams);
    next.set('size', label);
    setSearchParams(next);
  }

  function handleAddToCart() {
    if (!canAddToCart || !selectedColor || !selectedSize || !product) return;
    addItem({
      key: makeCartKey(product.id, selectedColor.name, selectedSize.label),
      productId: product.id,
      title: product.title,
      image: product.image,
      unitPrice,
      color: selectedColor.name,
      size: selectedSize.label,
      maxQuantity: selectedSize.maxQuantity,
      quantity,
    });
    openDrawer();
  }

  return (
    <div className={`app-container ${styles.page}`}>
      <div className={styles.layout}>
        <ImageGallery images={[product.image]} alt={product.title} />
        <div className={styles.info}>
          <span className={styles.brand}>{product.brand}</span>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.priceRow}>
            {onSale && <span className={styles.originalPrice}>{formatPrice(product.price)}</span>}
            <span className={styles.price}>{formatPrice(unitPrice)}</span>
          </div>
          <p className={styles.description}>{product.description}</p>

          {selectedColor && (
            <ColorSwatches colors={product.colors} selected={selectedColor.name} onSelect={handleColorSelect} />
          )}
          <SizeButtons sizes={product.sizes} selected={selectedSize?.label ?? ''} onSelect={handleSizeSelect} />

          <div className={styles.addRow}>
            <QuantityPicker
              quantity={quantity}
              maxQuantity={selectedSize?.maxQuantity ?? 0}
              onChange={setQuantity}
              disabled={!canAddToCart}
            />
            <button type="button" className={styles.addButton} onClick={handleAddToCart} disabled={!canAddToCart}>
              {canAddToCart ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
