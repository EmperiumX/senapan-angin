"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category, Product } from "@/types";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialData?: Product | null;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialData?.name || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discountPrice ? String(initialData.discountPrice) : ""
  );
  const [stock, setStock] = useState(initialData?.stock !== undefined ? String(initialData.stock) : "10");
  const [mainImage, setMainImage] = useState(initialData?.mainImage || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [caliber, setCaliber] = useState(initialData?.caliber || "4.5 mm (.177 cal)");
  const [tubeCapacity, setTubeCapacity] = useState(initialData?.tubeCapacity || "");
  const [maxPressure, setMaxPressure] = useState(initialData?.maxPressure || "");
  const [barrelLength, setBarrelLength] = useState(initialData?.barrelLength || "");
  const [stockMaterial, setStockMaterial] = useState(initialData?.stockMaterial || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isActive, setIsActive] = useState(initialData?.isActive !== undefined ? initialData.isActive : true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (!categoryId && data.length > 0) {
            setCategoryId(data[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingCategories(false));
  }, [categoryId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah gambar");

      setMainImage(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !price || !categoryId || !mainImage) {
      setError("Nama produk, kategori, harga, dan gambar utama wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      categoryId,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock || 0),
      mainImage,
      description,
      caliber,
      tubeCapacity,
      maxPressure,
      barrelLength,
      stockMaterial,
      isFeatured,
      isActive,
    };

    try {
      const url = isEdit ? `/api/products/${initialData?.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan produk");

      router.push("/admin/produk");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/produk"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
            </h1>
            <p className="text-xs text-slate-400">
              Lengkapi informasi produk, spesifikasi teknis, dan stok
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/25 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Produk</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Informasi Dasar & Harga
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: PCP Predator Dural 500cc Full CNC Tactical"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium text-slate-700"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kode SKU Produk
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Contoh: PCP-PRED-500"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Harga Normal (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="3950000"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Harga Promo / Diskon (Rp) (Opsional)
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="3700000"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Stok Tersedia (Unit) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-emerald-600 w-4 h-4 focus:ring-emerald-500"
              />
              <span>Jadikan Produk Unggulan ⭐</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-emerald-600 w-4 h-4 focus:ring-emerald-500"
              />
              <span>Status Aktif (Tampil di Toko)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Foto Produk (Lokal / URL)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-4">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center relative">
              {mainImage ? (
                <img src={mainImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[11px]">Belum ada gambar</span>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-8 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Upload File Gambar dari Komputer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
              />
              {isUploading && (
                <span className="text-xs text-emerald-700 font-semibold mt-1 inline-block">
                  Mengunggah gambar...
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400 text-center font-semibold">ATAU</div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Link URL Gambar / Path Upload
              </label>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="/uploads/... atau /images/products/... atau https://..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
              />
              {mainImage && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  ✓ Gambar terpilih: {mainImage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Spesifikasi Teknis Senapan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kaliber
            </label>
            <input
              type="text"
              value={caliber}
              onChange={(e) => setCaliber(e.target.value)}
              placeholder="4.5 mm (.177 cal)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kapasitas Tabung
            </label>
            <input
              type="text"
              value={tubeCapacity}
              onChange={(e) => setTubeCapacity(e.target.value)}
              placeholder="Contoh: 500 cc Duralium 6061-T6"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tekanan Angin Maksimum
            </label>
            <input
              type="text"
              value={maxPressure}
              onChange={(e) => setMaxPressure(e.target.value)}
              placeholder="Contoh: 3000 PSI (Safety 2700 PSI)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Panjang & Tipe Laras
            </label>
            <input
              type="text"
              value={barrelLength}
              onChange={(e) => setBarrelLength(e.target.value)}
              placeholder="Contoh: 60 cm Baja Seamless Od 13 Alur 12"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Bahan / Model Popor
            </label>
            <input
              type="text"
              value={stockMaterial}
              onChange={(e) => setStockMaterial(e.target.value)}
              placeholder="Contoh: Popor Lipat Tactical Dural CNC / Kayu Mahoni Glossy"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi Lengkap Produk
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan keunggulan, spesifikasi detail, dan paket kelengkapan produk..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
