import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { SkeletonGrid } from '../../components/StatusStates/SkeletonGrid';
import { ErrorState } from '../../components/StatusStates/ErrorState';
import { EmptyState } from '../../components/StatusStates/EmptyState';
import styles from './ProductListingPage.module.scss';

export function ProductListingPage() {
  const { products, loading, error, retry } = useProducts();

  return (
    <div className={`app-container ${styles.page}`}>
      <h1 className={styles.heading}>All Products</h1>
      {loading && <SkeletonGrid />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products are available right now. Check back later." />
      )}
      {!loading && !error && products.length > 0 && <ProductGrid products={products} />}
    </div>
  );
}
