import type { Product, RawProduct } from '../types';
import { generateVariants } from '../data/variants';
import { INR_PRICE_OVERRIDES } from '../data/priceOverridesIN';

const BASE_URL = 'https://fakestoreapi.com';

function hydrate(raw: RawProduct): Product {
  const priced: RawProduct = { ...raw, price: INR_PRICE_OVERRIDES[raw.id] ?? raw.price };
  return { ...priced, ...generateVariants(priced) };
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Fake Store API request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProducts(): Promise<Product[]> {
  const raw = await request<RawProduct[]>('/products');
  return raw.map(hydrate);
}

export async function fetchProduct(id: number): Promise<Product> {
  const raw = await request<RawProduct>(`/products/${id}`);
  return hydrate(raw);
}
