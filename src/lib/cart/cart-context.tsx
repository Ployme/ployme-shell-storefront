"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import { PRODUCTS } from "@/lib/data/products";

const STORAGE_KEY = "oliveto-cart";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; productId: string; variantId: string; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string; variantId: string }
  | {
      type: "UPDATE_QUANTITY";
      productId: string;
      variantId: string;
      quantity: number;
    }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) =>
          i.productId === action.productId && i.variantId === action.variantId
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId && i.variantId === action.variantId
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: action.productId,
            variantId: action.variantId,
            quantity: action.quantity,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) =>
            !(
              i.productId === action.productId &&
              i.variantId === action.variantId
            )
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) =>
              !(
                i.productId === action.productId &&
                i.variantId === action.variantId
              )
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.productId && i.variantId === action.variantId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
  }
}

type CartContextValue = {
  cart: CartState;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // Corrupted localStorage — start fresh
    }
  }, []);

  // Persist to localStorage on change (skip initial empty state before hydration)
  const isHydrated = useIsHydrated();
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.items));
    }
  }, [cart.items, isHydrated]);

  const addItem = useCallback(
    (productId: string, variantId: string, quantity: number = 1) => {
      dispatch({ type: "ADD_ITEM", productId, variantId, quantity });
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      dispatch({ type: "REMOVE_ITEM", productId, variantId });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", productId, variantId, quantity });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = cart.items.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) return sum;
    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) return sum;
    return sum + variant.price * item.quantity;
  }, 0);

  return (
    <CartContext value={{ cart, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Small helper to track hydration state so we don't overwrite localStorage
// with empty cart before hydration completes.
function useIsHydrated() {
  const [hydrated, setHydrated] = useReducer(() => true, false);
  useEffect(() => {
    setHydrated();
  }, []);
  return hydrated;
}
