"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product, Category } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Star,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

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
      console.error("Fetch products error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error("Delete product error:", e);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p))
        );
      }
    } catch (e) {
      console.error("Toggle active error:", e);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || p.categoryId === selectedCategory;

    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "ACTIVE" && p.isActive) ||
      (selectedStatus === "INACTIVE" && !p.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Produk
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola seluruh produk dan stok toko Anda.
          </p>
        </div>

        <Link
          href="/admin/produk/tambah"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Produk</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
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

        {/* Category Dropdown */}
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

        {/* Status Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Status Aktif</option>
            <option value="INACTIVE">Status Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Products Table (MitraX9 Styled) */}
      <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 w-12">
                  <input type="checkbox" className="rounded text-emerald-600" disabled />
                </th>
                <th className="p-4">Produk</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                    Memuat data produk...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    Tidak ada data produk ditemukan
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const effectivePrice = prod.discountPrice ?? prod.price;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 pl-6">
                        <input type="checkbox" className="rounded text-emerald-600" />
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

                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 line-clamp-1">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                                {prod.category?.name || "Kategori"}
                              </span>
                              {prod.isFeatured && (
                                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-current text-emerald-600" />
                                  Unggulan
                                </span>
                              )}
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                                Official
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-slate-900 block">
                          {formatRupiah(effectivePrice)}
                        </span>
                        {prod.discountPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatRupiah(prod.price)}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-extrabold ${
                            prod.stock <= 3
                              ? "text-red-600"
                              : prod.stock <= 10
                              ? "text-amber-600"
                              : "text-slate-900"
                          }`}
                        >
                          {prod.stock}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(prod.id, prod.isActive)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                            prod.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                          title="Klik untuk mengubah status aktif"
                        >
                          {prod.isActive ? "AKTIF" : "NONAKTIF"}
                        </button>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/produk/${prod.id}/edit`}
                            className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Edit Produk"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
