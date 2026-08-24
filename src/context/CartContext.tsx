"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";

interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image: string;
}

interface ToastNotification {
  id: string;
  type: "success" | "warning";
  title: string;
  message: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    sourceElement?: HTMLElement | null
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  cartBump: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "ud_jaya_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [cartBump, setCartBump] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isHydrated]);

  const addToCart = (
    product: Product,
    quantity = 1,
    sourceElement?: HTMLElement | null
  ) => {
    const existing = cart.find((item) => item.product.id === product.id);
    const currentQty = existing ? existing.quantity : 0;
    const maxStock = product.stock !== undefined ? product.stock : 99;

    // ⚠️ Check if already at maximum stock in cart
    if (currentQty >= maxStock) {
      const toastId = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [
        ...prev.slice(-1), // Keep at most 2 toasts active
        {
          id: toastId,
          type: "warning",
          title: "Stok Terakhir Sudah di Keranjang",
          message: `Semua sisa stok (${maxStock} unit) produk ini sudah berada di dalam keranjang Anda.`,
          image: product.mainImage,
        },
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 3500);
      return;
    }

    const availableToAdd = maxStock - currentQty;
    const actualAddQuantity = Math.min(quantity, availableToAdd);

    // 1. Add / Update cart state
    setCart((prev) => {
      const itemIndex = prev.findIndex((item) => item.product.id === product.id);
      if (itemIndex > -1) {
        const updated = [...prev];
        updated[itemIndex] = {
          ...updated[itemIndex],
          quantity: updated[itemIndex].quantity + actualAddQuantity,
        };
        return updated;
      }
      return [...prev, { product, quantity: actualAddQuantity }];
    });

    // 2. Trigger Fly-to-Cart Animation
    if (typeof window !== "undefined") {
      let startX = window.innerWidth / 2 - 24;
      let startY = window.innerHeight / 2 - 24;

      if (sourceElement) {
        const rect = sourceElement.getBoundingClientRect();
        startX = rect.left + rect.width / 2 - 24;
        startY = rect.top + rect.height / 2 - 24;
      }

      const cartBtn = document.getElementById("navbar-cart-button");
      let targetX = window.innerWidth - 80;
      let targetY = 30;

      if (cartBtn) {
        const cartRect = cartBtn.getBoundingClientRect();
        targetX = cartRect.left + cartRect.width / 2 - 24;
        targetY = cartRect.top + cartRect.height / 2 - 24;
      }

      const newItem: FlyingItem = {
        id: `${Date.now()}-${Math.random()}`,
        startX,
        startY,
        targetX,
        targetY,
        image: product.mainImage,
      };

      setFlyingItems((prev) => [...prev, newItem]);

      // Trigger cart bump animation when item arrives
      setTimeout(() => {
        setCartBump(true);
        setTimeout(() => setCartBump(false), 400);
      }, 550);
    }

    // 3. Show smooth toast popup
    const toastId = `${Date.now()}-${Math.random()}`;
    const newTotal = currentQty + actualAddQuantity;
    const isNowFull = newTotal >= maxStock;

    setToasts((prev) => [
      ...prev.slice(-1), // Keep at most 2 toasts
      {
        id: toastId,
        type: "success",
        title: isNowFull
          ? `Stok Terakhir di Keranjang (${newTotal} unit)`
          : `Masuk ke Keranjang (+${actualAddQuantity})`,
        message: product.name,
        image: product.mainImage,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3200);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
        cartBump,
      }}
    >
      {children}

      {/* 🚀 Flying Item to Cart Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX,
              y: item.startY,
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: [
                item.startX,
                (item.startX + item.targetX) / 2 - 30,
                item.targetX,
              ],
              y: [
                item.startY,
                Math.min(item.startY, item.targetY) - 70,
                item.targetY,
              ],
              scale: [1, 0.85, 0.3],
              opacity: [1, 1, 0.9, 0],
              rotate: [0, -15, 25, 0],
            }}
            transition={{
              duration: 0.65,
              ease: [0.25, 1, 0.5, 1], // Custom smooth curve
            }}
            onAnimationComplete={() => {
              setFlyingItems((prev) => prev.filter((f) => f.id !== item.id));
            }}
            className="absolute w-12 h-12 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500 bg-white"
          >
            <img
              src={item.image}
              alt="Flying Product"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* 🔔 Floating Bottom-Right Toast */}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isWarning = toast.type === "warning";

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl shadow-2xl border max-w-md ${
                  isWarning
                    ? "bg-slate-900 text-white border-amber-500/80"
                    : "bg-slate-900/95 backdrop-blur-md text-white border-slate-700/80"
                }`}
              >
                {toast.image && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    <img
                      src={toast.image}
                      alt={toast.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 pr-2">
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-extrabold ${
                      isWarning ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {isWarning ? (
                      <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                    <span>{toast.title}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium line-clamp-2 mt-0.5">
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 shrink-0 ${
                    isWarning
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  <span>Lihat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
