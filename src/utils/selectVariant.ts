import type { SizeOption } from '../types';

/** Prefers a fully in-stock size, falls back to low-stock, null if every size is sold out. */
export function pickDefaultSize(sizes: SizeOption[]): SizeOption | null {
  return sizes.find((s) => s.status === 'in-stock') ?? sizes.find((s) => s.status === 'low-stock') ?? null;
}

export function isSoldOut(sizes: SizeOption[]): boolean {
  return sizes.every((s) => s.status === 'sold-out');
}
