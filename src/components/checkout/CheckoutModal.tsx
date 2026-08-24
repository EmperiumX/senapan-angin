"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ShoppingBag, ShieldCheck, MapPin, User, Phone, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { CartItem } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directItems?: CartItem[];
}

export default function CheckoutModal({ isOpen, onClose, directItems }: CheckoutModalProps) {
  const router = useRouter();
  const { cart, totalPrice, clearCart, removeFromCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<{
    orderNumber: string;
    whatsappUrl: string;
  } | null>(null);

  const activeItems = directItems && directItems.length > 0 ? directItems : cart;
  const activeTotalPrice = directItems && directItems.length > 0
    ? directItems.reduce((sum, item) => sum + ((item.product.discountPrice ?? item.product.price) * item.quantity), 0)
    : totalPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman");
      return;
    }

    if (activeItems.length === 0) {
      setError("Daftar pesanan Anda masih kosong");
      return;
    }

    setIsLoading(true);

    try {
      const itemsPayload = activeItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerAddress: address.trim(),
          notes: notes.trim(),
          items: itemsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses pesanan");
      }

      setSuccessOrder({
        orderNumber: data.order.orderNumber,
        whatsappUrl: data.whatsappUrl,
      });

      // Clear the cart if using global cart or remove direct items
      if (!directItems || directItems.length === 0) {
        clearCart();
      } else {
        directItems.forEach((di) => removeFromCart(di.product.id));
      }

      router.refresh();

      // Open WhatsApp
      if (typeof window !== "undefined") {
        window.open(data.whatsappUrl, "_blank");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pesanan";
      setError(msg);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessOrder(null);
    setError(null);
    router.refresh();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 my-8"
          >
            {/* Header (Tactical Dark Slate & Emerald) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 relative border-b border-emerald-900/40">
              <button
                onClick={handleResetAndClose}
                className="absolute top-5 right-5 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Checkout via WhatsApp</h3>
                  <p className="text-sm text-emerald-300 font-medium">
                    UD. Jaya Senapan Angin • Jombang
                  </p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {successOrder ? (
                /* Success State */
                <div className="text-center py-8 space-y-5">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      Pesanan Berhasil Dicatat!
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      No. Pesanan: <span className="font-semibold text-emerald-700">#{successOrder.orderNumber}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                      Pesanan telah tersimpan di sistem kami. Jika WhatsApp tidak otomatis terbuka, silakan klik tombol di bawah untuk melanjutkan chat dengan admin kami.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={successOrder.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Buka WhatsApp Sekarang
                    </a>
                    <button
                      onClick={handleResetAndClose}
                      className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                /* Form State */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Order Summary Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>Rincian Barang ({activeItems.length} Jenis)</span>
                      <span>Subtotal</span>
                    </div>
                    <div className="divide-y divide-slate-200/60 max-h-36 overflow-y-auto pr-1">
                      {activeItems.map((item) => {
                        const effectivePrice = item.product.discountPrice ?? item.product.price;
                        return (
                          <div key={item.product.id} className="py-2 flex items-center justify-between text-sm">
                            <div className="truncate pr-2">
                              <span className="font-medium text-slate-800">{item.product.name}</span>
                              <span className="text-slate-400 text-xs ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-semibold text-slate-900 shrink-0">
                              {formatRupiah(effectivePrice * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-base font-bold text-slate-900">
                      <span>Total Estimasi:</span>
                      <span className="text-emerald-800 text-lg font-extrabold">{formatRupiah(activeTotalPrice)}</span>
                    </div>
                  </div>

                  {/* Customer Information Inputs */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      Data Diri Pembeli
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Zidan Fathul"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Alamat Lengkap / Kecamatan & Kota <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Contoh: Jl. Merdeka No. 10, Kec. Peterongan, Kab. Jombang"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Catatan Khusus Pesanan (Opsional)
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Contoh: Mohon disetting grouping 50 meter / kirim pakai ekspedisi JNT Cargo"
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security & Guarantee Note */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Transaksi aman langsung ke WhatsApp resmi toko. Kami akan memverifikasi stok dan menghitungkan biaya ongkir termurah sebelum Anda melakukan pembayaran.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || activeItems.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Menghubungkan ke WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Kirim Pesanan via WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
