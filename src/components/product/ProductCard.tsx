"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Eye, Shield } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="glass-card-interactive group flex flex-col h-full overflow-hidden border border-slate-200/90 bg-white/90 rounded-2xl relative shadow-xs"
    >
      {/* Badges Top Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.isFeatured && (
            <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-slate-700">
              <Star className="w-3 h-3 fill-current text-emerald-400" />
              UNGGULAN
            </span>
          )}
        </div>

        <div>
          {product.stock > 0 ? (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md">
              Stok: {product.stock}
            </span>
          ) : (
            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Habis
            </span>
          )}
        </div>
      </div>

      {/* Product Image */}
      <Link href={`/produk/${product.slug}`} className="relative aspect-4/3 overflow-hidden bg-slate-50 block border-b border-slate-100">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
          <span className="text-white text-xs font-semibold flex items-center gap-1 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Eye className="w-3.5 h-3.5" /> Lihat Detail Spesifikasi
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Caliber Tag */}
          <div className="flex items-center gap-2 mb-1.5 text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-700 font-extrabold uppercase tracking-wider">
              {product.category?.name || "Senapan"}
            </span>
            {product.caliber && (
              <>
                <span>•</span>
                <span className="truncate">{product.caliber}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/produk/${product.slug}`} className="block">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Technical highlight if any */}
        {(product.tubeCapacity || product.maxPressure) && (
          <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 rounded-lg p-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {product.tubeCapacity || product.maxPressure}
            </span>
          </div>
        )}

        {/* Price & Cart Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Harga</span>
            <span className="text-base font-extrabold text-emerald-800">
              {formatRupiah(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => addToCart(product, 1, e.currentTarget)}
            disabled={product.stock <= 0}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80 hover:border-emerald-600 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
