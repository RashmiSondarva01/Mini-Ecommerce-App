import { useEffect, useState, useCallback } from 'react';
import type { Product } from '../types';
import { fetchProduct } from '../api/fakeStoreApi';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useProduct(id: number): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);

    fetchProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load product');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { product, loading, error, retry };
}
