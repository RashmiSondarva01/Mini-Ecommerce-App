import type { RawProduct, Variants, StockStatus } from '../types';
import { COLOR_PALETTE, SIZE_LABELS, LOW_STOCK_MAX_QTY, IN_STOCK_MAX_QTY } from './constants';

/**
 * The Fake Store API has no variants, brand, or sale-price fields, so we
 * synthesize them deterministically from the product id (a seeded PRNG,
 * not Math.random()) — the same product always renders the same
 * colors/sizes/stock/brand/sale-price across reloads and machines.
 * See DECISIONS.md for the rationale.
 */
function seededRandom(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function toBrand(category: string): string {
  return category
    .split(' ')
    .map((word) =>
      word
        .split("'")
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join("'"),
    )
    .join(' ');
}

function stockStatusFor(rand: number): StockStatus {
  if (rand < 0.15) return 'sold-out';
  if (rand < 0.4) return 'low-stock';
  return 'in-stock';
}

function maxQuantityFor(status: StockStatus): number {
  if (status === 'sold-out') return 0;
  if (status === 'low-stock') return LOW_STOCK_MAX_QTY;
  return IN_STOCK_MAX_QTY;
}

export function generateVariants(product: RawProduct): Variants {
  const random = seededRandom(product.id * 7919);

  const colorCount = 2 + Math.floor(random() * 3); // 2-4 colors
  const startIndex = Math.floor(random() * COLOR_PALETTE.length);
  const colors = Array.from({ length: colorCount }, (_, i) => COLOR_PALETTE[(startIndex + i) % COLOR_PALETTE.length]);

  // Every 13th product is entirely sold out, so the "sold out" listing/detail
  // states are always reachable in a deterministic demo, not left to chance.
  const forceSoldOut = product.id % 13 === 0;
  const sizes = SIZE_LABELS.map((label) => {
    const status: StockStatus = forceSoldOut ? 'sold-out' : stockStatusFor(random());
    return { label, status, maxQuantity: maxQuantityFor(status) };
  });

  const onSale = product.id % 3 === 0;
  const salePrice = onSale ? Math.round(product.price * 0.8 * 100) / 100 : null;

  return {
    brand: toBrand(product.category),
    colors,
    sizes,
    salePrice,
  };
}
