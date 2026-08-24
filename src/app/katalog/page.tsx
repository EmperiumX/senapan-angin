import React from "react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { Search, Crosshair, ArrowUpDown } from "lucide-react";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export const revalidate = 0;

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category, search, sort } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (category && category !== "semua") {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { sku: { contains: search } },
      { caliber: { contains: search } },
    ];
  }

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "popular") orderBy = { views: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/80 bg-white/90 space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
          <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
          <span>Katalog Produk Resmi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {activeCategory ? activeCategory.name : "Semua Produk Senapan & Aksesoris"}
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          {activeCategory?.description ||
            "Pilihan lengkap senapan PCP, Gejluk, Sharp/Uklik kaliber 4.5mm, teleskop berpresisi tinggi, mimis, dan perlengkapan berburu bergaransi."}
        </p>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="space-y-4">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href={`/katalog?category=semua${search ? `&search=${search}` : ""}${sort ? `&sort=${sort}` : ""}`}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              !category || category === "semua"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            Semua Kategori
          </Link>
          {categories.map((cat) => {
            const isActive = category === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/katalog?category=${cat.slug}${search ? `&search=${search}` : ""}${sort ? `&sort=${sort}` : ""}`}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl bg-white/80 border border-slate-200/70 shadow-xs">
          {/* Search Form */}
          <form method="GET" action="/katalog" className="w-full sm:w-80 relative">
            {category && <input type="hidden" name="category" value={category} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Cari nama atau model senapan..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </form>

          {/* Results count & Sort Dropdown */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 text-xs">
            <span className="text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-900">{products.length}</span> produk
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <Link
                  href={`/katalog?sort=newest${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    !sort || sort === "newest" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Terbaru
                </Link>
                <Link
                  href={`/katalog?sort=popular${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    sort === "popular" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Populer
                </Link>
                <Link
                  href={`/katalog?sort=price_asc${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    sort === "price_asc" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Termurah
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 bg-white/80">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Produk Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada produk yang cocok dengan kriteria pencarian Anda. Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
          </p>
          <Link
            href="/katalog"
            className="inline-block px-5 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Reset Filter
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
