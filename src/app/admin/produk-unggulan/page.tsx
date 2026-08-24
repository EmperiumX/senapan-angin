"use client";

import React, { useEffect, useState } from "react";
import { Product, Category } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Sparkles,
  Star,
  Search,
  RefreshCw,
} from "lucide-react";

export default function AdminFeaturedProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products?all=true"),
        fetch("/api/categories"),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalFeatured = products.filter((p) => p.isFeatured).length;

  const handleToggleSingle = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch("/api/products/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: [id],
          isFeatured: !currentFeatured,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !currentFeatured } : p))
        );
      }
    } catch (e) {
      console.error("Toggle single error:", e);
    }
  };

  const handleBulkUpdate = async (setFeatured: boolean) => {
    if (selectedIds.length === 0) return;
    setIsBulkUpdating(true);

    try {
      const res = await fetch("/api/products/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: selectedIds,
          isFeatured: setFeatured,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, isFeatured: setFeatured } : p))
        );
        setSelectedIds([]);
      }
    } catch (e) {
      console.error("Bulk update error:", e);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || p.categoryId === selectedCategory;

    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "FEATURED" && p.isFeatured) ||
      (selectedStatus === "NORMAL" && !p.isFeatured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-slate-900 to-emerald-950 text-white relative overflow-hidden shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-emerald-900/40">
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BULK MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Produk Unggulan
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm">
            Pilih dan atur produk unggulan secara massal untuk ditampilkan di Beranda & Catalog Hot Items.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
            TOTAL UNGGULAN
          </span>
          <div className="flex items-center justify-center sm:justify-end gap-1.5 mt-1">
            <Star className="w-5 h-5 fill-current text-emerald-400" />
            <span className="text-2xl font-extrabold">{totalFeatured} Produk</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk berdasarkan nama / SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
          >
            <option value="ALL">Semua Status</option>
            <option value="FEATURED">Hanya Produk Unggulan</option>
            <option value="NORMAL">Hanya Produk Biasa</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (when selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <span className="font-bold text-emerald-900 pl-2">
            {selectedIds.length} produk dipilih
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkUpdate(true)}
              disabled={isBulkUpdating}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-xs transition-all"
            >
              Jadikan Unggulan
            </button>
            <button
              onClick={() => handleBulkUpdate(false)}
              disabled={isBulkUpdating}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl transition-all"
            >
              Hapus dari Unggulan
            </button>
          </div>
        </div>
      )}

      {/* Select All row */}
      <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-600">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={
              filteredProducts.length > 0 &&
              selectedIds.length === filteredProducts.length
            }
            onChange={toggleSelectAll}
            className="rounded text-emerald-600 w-4 h-4 focus:ring-emerald-500"
          />
          <span>Select All ({filteredProducts.length})</span>
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 w-12">#</th>
                <th className="p-4">Produk</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Status Unggulan</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    Tidak ada data produk yang cocok
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isSelected = selectedIds.includes(prod.id);
                  const effectivePrice = prod.discountPrice ?? prod.price;

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <td className="p-4 pl-6">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(prod.id)}
                          className="rounded text-emerald-600 w-4 h-4 focus:ring-emerald-500"
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <img
                              src={prod.mainImage}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              SKU: {prod.sku || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-slate-600 font-medium">{prod.category?.name || "-"}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-slate-900 block">
                          {formatRupiah(effectivePrice)}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-extrabold ${
                            prod.stock <= 3 ? "text-red-600" : "text-slate-900"
                          }`}
                        >
                          {prod.stock}
                        </span>
                      </td>

                      <td className="p-4">
                        {prod.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-[10px]">
                            <Star className="w-3 h-3 fill-current text-emerald-600" />
                            Unggulan
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">Biasa</span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        {prod.isFeatured ? (
                          <button
                            onClick={() => handleToggleSingle(prod.id, true)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] rounded-xl transition-all"
                          >
                            Hapus Unggulan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleSingle(prod.id, false)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-[11px] rounded-xl border border-emerald-200/70 hover:border-emerald-600 transition-all shadow-xs"
                          >
                            Jadikan Unggulan
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
