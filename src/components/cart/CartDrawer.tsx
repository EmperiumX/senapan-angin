"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight, Send } from "lucide-react";
import CheckoutModal from "../checkout/CheckoutModal";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Keranjang Belanja</h2>
                      <p className="text-xs text-slate-500">{totalItems} item dipilih</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <ShoppingCart className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800">Keranjang Masih Kosong</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">
                          Jelajahi berbagai pilihan senapan PCP, Gejluk, Sharp, teleskop, dan aksesoris berkualitas kami.
                        </p>
                      </div>
                      <Link
                        href="/katalog"
                        onClick={() => setIsCartOpen(false)}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                      >
                        Mulai Belanja
                      </Link>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const effectivePrice = item.product.discountPrice ?? item.product.price;
                      return (
                        <motion.div
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-300 transition-colors"
                        >
                          {/* Image */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 relative">
                            <img
                              src={item.product.mainImage}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                                {item.product.name}
                              </h4>
                              <div className="mt-1">
                                <span className="text-xs font-bold text-emerald-800">
                                  {formatRupiah(item.product.price)}
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-all"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Footer Summary */}
                {cart.length > 0 && (
                  <div className="p-5 border-t border-slate-200 bg-slate-50/90 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Total Jumlah Item</span>
                        <span>{totalItems} unit</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                        <span>Total Estimasi</span>
                        <span className="text-base text-emerald-800 font-extrabold">
                          {formatRupiah(totalPrice)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        *Ongkos kirim dihitung via WhatsApp sesuai kota tujuan.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenCheckout}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 active:scale-95 transition-all duration-150"
                    >
                      <Send className="w-4 h-4" />
                      <span>Checkout via WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
}
