"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import {
  ShoppingCart,
  PhoneCall,
  CheckCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Layers,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addToCart, cart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(1);
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "description">("specs");

  const inCartQty = cart.find((item) => item.product.id === product.id)?.quantity || 0;
  const isAllStockInCart = product.stock > 0 && inCartQty >= product.stock;

  // Parse gallery images
  let gallery: string[] = [product.mainImage];
  if (product.galleryImages) {
    try {
      const parsed = JSON.parse(product.galleryImages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        gallery = [product.mainImage, ...parsed.filter((img: string) => img !== product.mainImage)];
      }
    } catch {
      // fallback
    }
  }

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product, quantity, e.currentTarget);
  };

  const handleBuyNow = () => {
    setIsDirectCheckoutOpen(true);
  };

  const directCartItem = {
    productId: product.id,
    product,
    quantity,
    price: effectivePrice,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-emerald-700">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/katalog" className="hover:text-emerald-700">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        {product.category && (
          <>
            <Link
              href={`/katalog?category=${product.category.slug}`}
              className="hover:text-emerald-700"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </>
        )}
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image Container */}
          <div className="glass-panel p-3 rounded-3xl border border-slate-200/90 overflow-hidden bg-white/90 shadow-sm relative aspect-4/3 flex items-center justify-center">
            {product.isFeatured && (
              <span className="absolute top-4 left-4 z-10 bg-slate-900 text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-slate-800">
                <Star className="w-3.5 h-3.5 fill-current text-emerald-400" />
                UNGGULAN
              </span>
            )}
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Thumbnails Row */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImage === img
                      ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & WhatsApp Action */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and SKU */}
            <div className="flex items-center justify-between text-xs">
              <span className="bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-200/70 uppercase tracking-wider">
                {product.category?.name || "Senapan Angin"}
              </span>
              {product.sku && (
                <span className="text-slate-400 font-mono font-medium">SKU: {product.sku}</span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Block */}
            <div className="glass-card p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-800">
                {formatRupiah(product.price)}
              </span>
            </div>

            {/* Short Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/70">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kaliber 4.5mm Legal</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/70">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tes Grouping & Chrono</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/70">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Packing Kayu Aman</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/70">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garansi Servis Jombang</span>
              </div>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Jumlah Beli:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500">
                (Tersedia <span className="font-bold text-slate-800">{product.stock}</span> unit
                {inCartQty > 0 && (
                  <span className={isAllStockInCart ? "text-amber-700 font-bold ml-1.5" : "text-emerald-700 font-semibold ml-1.5"}>
                    • {isAllStockInCart ? "Semua stok sudah di keranjang" : `${inCartQty} di keranjang`}
                  </span>
                )}
                )
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 px-6 rounded-2xl font-extrabold text-sm border-2 flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 disabled:opacity-50 ${
                  isAllStockInCart
                    ? "bg-amber-50 text-amber-800 border-amber-400 hover:bg-amber-100"
                    : "bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-700 hover:border-emerald-800"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isAllStockInCart ? "Stok Penuh di Keranjang" : "+ Keranjang"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-700/25 active:scale-95 disabled:opacity-50"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Beli via WhatsApp</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              *Klik &quot;Beli via WhatsApp&quot; untuk langsung mengarahkan rincian pesanan ke nomor admin resmi.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Description */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 bg-white/95 space-y-6 shadow-sm">
        {/* Tab Headers */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-2 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "specs"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Spesifikasi Teknis</span>
          </button>
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-2 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "description"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>Deskripsi Lengkap</span>
          </button>
        </div>

        {/* Tab Content: Specs */}
        {activeTab === "specs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-500">Kaliber</span>
                <span className="font-bold text-slate-900">{product.caliber || "4.5 mm (.177)"}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-500">Kapasitas Tabung</span>
                <span className="font-bold text-slate-900">{product.tubeCapacity || "500 cc Duralium"}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-500">Tekanan Maksimum</span>
                <span className="font-bold text-slate-900">{product.maxPressure || "3000 PSI (Safety 2700 PSI)"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-500">Panjang Laras</span>
                <span className="font-bold text-slate-900">{product.barrelLength || "60 cm Baja Seamless"}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-500">Bahan Popor</span>
                <span className="font-bold text-slate-900">{product.stockMaterial || "Popor Tactical Dural"}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-500">Tempat Perakitan</span>
                <span className="font-bold text-slate-900">Jombang, Jawa Timur</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Description */}
        {activeTab === "description" && (
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
            <p>{product.description}</p>
          </div>
        )}
      </div>

      {/* Direct WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={isDirectCheckoutOpen}
        onClose={() => setIsDirectCheckoutOpen(false)}
        directItems={[directCartItem]}
      />
    </div>
  );
}
