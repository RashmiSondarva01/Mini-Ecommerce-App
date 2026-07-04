import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { CartItem } from '../types';
import { CART_STORAGE_KEY } from '../data/constants';
import { readLocalStorage, writeLocalStorage } from '../hooks/useLocalStorage';

const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING_FEE = 5.99;

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { key: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { key: string } }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' };

function clamp(quantity: number, maxQuantity: number): number {
  return Math.max(0, Math.min(quantity, maxQuantity));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.key === action.payload.key);
      if (existing) {
        const quantity = clamp(existing.quantity + action.payload.quantity, existing.maxQuantity);
        return {
          ...state,
          items: state.items.map((item) => (item.key === existing.key ? { ...item, quantity } : item)),
        };
      }
      const quantity = clamp(action.payload.quantity, action.payload.maxQuantity);
      if (quantity <= 0) return state;
      return { ...state, items: [...state.items, { ...action.payload, quantity }] };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.key === action.payload.key
              ? { ...item, quantity: clamp(action.payload.quantity, item.maxQuantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.key !== action.payload.key) };
    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false };
    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    default:
      return state;
  }
}

function initCartState(): CartState {
  return {
    items: readLocalStorage<CartItem[]>(CART_STORAGE_KEY, []),
    isDrawerOpen: false,
  };
}

interface CartContextValue {
  items: CartItem[];
  isDrawerOpen: boolean;
  itemCount: number;
  subtotal: number;
  shipping: number;
  grandTotal: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCartState);

  useEffect(() => {
    writeLocalStorage(CART_STORAGE_KEY, state.items);
  }, [state.items]);

  const itemCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);
  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [state.items],
  );
  const shipping = itemCount === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const grandTotal = subtotal + shipping;

  const value: CartContextValue = {
    items: state.items,
    isDrawerOpen: state.isDrawerOpen,
    itemCount,
    subtotal,
    shipping,
    grandTotal,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: item.quantity ?? 1 } }),
    updateQuantity: (key, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } }),
    removeItem: (key) => dispatch({ type: 'REMOVE_ITEM', payload: { key } }),
    openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
    closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
    toggleDrawer: () => dispatch({ type: 'TOGGLE_DRAWER' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
