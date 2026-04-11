"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductVariant } from "@/lib/types";
import { COLLECTIONS } from "@/lib/data/collections";

const STORAGE_KEY = "oliveto-cart";
const DISCOUNT_STORAGE_KEY = "oliveto-discount";

export type AppliedDiscount = {
  code: string;
  amount: number; // pence
  type: "percentage" | "fixed";
  value: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
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
      const { item } = action;
      const existing = state.items.find(
        (i) =>
          i.productId === item.productId && i.variantId === item.variantId
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId && i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
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
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  hydrateItems: (items: CartItem[]) => void;
  itemCount: number;
  subtotal: number;
  discount: AppliedDiscount | null;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  const [discount, setDiscount] = useState<AppliedDiscount | null>(null);

  // Hydrate from localStorage on mount, filtering out old-schema entries
  // that lack the snapshot field.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (i) => i.snapshot && typeof i.snapshot.variantPrice === "number"
          );
          dispatch({ type: "HYDRATE", items: valid });
        }
      }
      const discStored = localStorage.getItem(DISCOUNT_STORAGE_KEY);
      if (discStored) {
        // Hydrating from localStorage on mount — a legitimate setState-in-effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDiscount(JSON.parse(discStored) as AppliedDiscount);
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

  useEffect(() => {
    if (!isHydrated) return;
    if (discount) {
      localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(discount));
    } else {
      localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    }
  }, [discount, isHydrated]);

  const addItem = useCallback(
    (product: Product, variant: ProductVariant, quantity: number = 1) => {
      const collection = COLLECTIONS.find((c) => c.id === product.collectionId);
      const item: CartItem = {
        productId: product.id,
        variantId: variant.id,
        quantity,
        snapshot: {
          productName: product.name,
          productSlug: product.id,
          collectionId: product.collectionId,
          collectionName: collection?.name ?? "",
          origin: product.origin,
          image: product.images[0] ?? "",
          variantSize: variant.size,
          variantPrice: variant.price,
          variantSku: variant.sku,
        },
      };
      dispatch({ type: "ADD_ITEM", item });
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
    setDiscount(null);
  }, []);

  const hydrateItems = useCallback((items: CartItem[]) => {
    dispatch({ type: "HYDRATE", items });
  }, []);

  const applyDiscount = useCallback((d: AppliedDiscount) => {
    setDiscount(d);
  }, []);

  const removeDiscount = useCallback(() => {
    setDiscount(null);
  }, []);

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = cart.items.reduce(
    (sum, i) => sum + i.snapshot.variantPrice * i.quantity,
    0
  );

  return (
    <CartContext
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        hydrateItems,
        itemCount,
        subtotal,
        discount,
        applyDiscount,
        removeDiscount,
      }}
    >
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
