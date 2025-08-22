import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export type CartItem = {
  id: string;
  title: string;
  image: string;
  category?: string;
  location?: string;
  price?: number;
  qty: number;
};

type CartState = { items: CartItem[] };
type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR" };

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
} | null>(null);

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, qty: i.qty + action.payload.qty }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "onepixart_cart_v1";

// ✅ LocalStorage-dan initial load
function getInitialState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { items: [] };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // hər dəfə state dəyişəndə yadda saxla
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (item: Omit<CartItem, "qty"> & { qty?: number }) =>
    dispatch({ type: "ADD", payload: { ...item, qty: item.qty ?? 1 } });

  const removeFromCart = (id: string) =>
    dispatch({ type: "REMOVE", payload: { id } });
  const updateQty = (id: string, qty: number) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = useMemo(
    () => state.items.reduce((s, i) => s + i.qty, 0),
    [state.items]
  );
  const subtotal = useMemo(
    () => state.items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0),
    [state.items]
  );

  const value = {
    state,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totalItems,
    subtotal,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
