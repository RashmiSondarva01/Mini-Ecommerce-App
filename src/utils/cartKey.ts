export function makeCartKey(productId: number, color: string, size: string): string {
  return `${productId}-${color}-${size}`;
}
