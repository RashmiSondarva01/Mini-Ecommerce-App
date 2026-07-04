export interface RawProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type StockStatus = 'in-stock' | 'low-stock' | 'sold-out';

export interface SizeOption {
  label: string;
  status: StockStatus;
  /** Max quantity a shopper can add for this size, given current stock. */
  maxQuantity: number;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Variants {
  brand: string;
  colors: ColorOption[];
  sizes: SizeOption[];
  salePrice: number | null;
}

export interface Product extends RawProduct {
  brand: string;
  colors: ColorOption[];
  sizes: SizeOption[];
  salePrice: number | null;
}

export interface CartItem {
  key: string;
  productId: number;
  title: string;
  image: string;
  unitPrice: number;
  color: string;
  size: string;
  quantity: number;
  maxQuantity: number;
}
