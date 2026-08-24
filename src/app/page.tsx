import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import FeaturedSlider from "@/components/home/FeaturedSlider";
import { formatRupiah } from "@/lib/utils";
import {
  Crosshair,
  ShieldCheck,
  Award,
  Truck,
  Wrench,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Eye,
  CircleDot,
  Package,
} from "lucide-react";

import { Category, Product } from "@/types";

export const revalidate = 60; // Cache on Vercel Edge CDN for ultra-fast instant page load

async function getHomeData(): Promise<{
  categories: (Category & { _count?: { products: number } })[];
  featuredProducts: Product[];
  heroProduct: Product | null;
}> {
  try {
    const [categories, featuredProducts] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

    const hero = featuredProducts[0] || (await prisma.product.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }));

    return {
      categories: categories as any,
      featuredProducts: featuredProducts as any,
      heroProduct: hero as any,
    };
  } catch (error) {
    console.error("Error loading home data:", error);
    return { categories: [], featuredProducts: [], heroProduct: null };
  }
}

// Icon helper for category cards
function getCategoryIcon(slug: string) {
  switch (slug) {
    case "senapan-pcp":
      return Crosshair;
    case "senapan-gejluk":
      return Zap;
    case "senapan-sharp-uklik":
      return Shield;
    case "teleskop-optik":
      return Eye;
    case "mimis-peluru":
      return CircleDot;
    case "aksesoris-pompa":
      return Package;
    default:
      return Crosshair;
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, heroProduct } = await getHomeData();

  return (
    <div className="space-y-14 sm:space-y-16 pb-20">
      {/* Hero Section (Tactical Hunter Emerald Theme) */}
      <section className="relative overflow-hidden bg-mesh-radial pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>PUSAT SENAPAN ANGIN & BENGKEL SERVIS JOMBANG</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Presisi Tinggi, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900">
                  Power Maksimal
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Pusat perakitan dan penjualan senapan angin PCP, Gejluk, Sharp Uklik kaliber 4.5mm terpercaya di Jombang. Pesan langsung & konsultasi via WhatsApp!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/katalog"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 text-sm transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Jelajahi Katalog Lengkap</span>
                </Link>

                <Link
                  href="/servis"
                  className="w-full sm:w-auto px-7 py-4 bg-white/90 hover:bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-sm transition-all hover:border-emerald-300"
                >
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  <span>Jasa Servis & Bengkel</span>
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="text-2xl font-black text-slate-900 block">100%</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Kaliber Legal 4.5mm</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-2xl font-black text-emerald-700 block">3000 PSI</span>
                  <span className="text-[11px] text-slate-500 font-semibold">High Pressure Tested</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-2xl font-black text-slate-900 block">1 Bulan</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Garansi Servis Toko</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product Card (Dynamically Loaded from Database) */}
            {heroProduct && (
              <div className="lg:col-span-5 relative">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                  <div className="relative glass-card p-6 border border-white shadow-2xl rounded-3xl overflow-hidden space-y-5 bg-white/90 backdrop-blur-xl">
                    <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 relative">
                      <img
                        src={heroProduct.mainImage}
                        alt={heroProduct.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>PRODUK TERLARIS</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                        <span className="text-emerald-700 font-bold uppercase">
                          {heroProduct.category?.name || "Senapan Angin"}
                        </span>
                        <span className={heroProduct.stock <= 2 ? "text-amber-600 font-bold" : ""}>
                          Stok: {heroProduct.stock} Unit
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1">
                        {heroProduct.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {heroProduct.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-400">Harga</span>
                        <p className="text-xl font-extrabold text-emerald-800">
                          {formatRupiah(heroProduct.price)}
                        </p>
                      </div>

                      <Link
                        href={`/produk/${heroProduct.slug}`}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                      >
                        Beli Sekarang
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1. Category Quick Navigation: Compact Single-Row 6-Column Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Kategori Senapan & Aksesoris
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilihan lengkap unit senapan siap pakai, sparepart orisinil & optik sniper
            </p>
          </div>
          <Link
            href="/katalog"
            className="text-emerald-700 hover:text-emerald-800 font-bold text-xs sm:text-sm flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/katalog?category=${cat.slug}`}
                className="group relative bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col items-center text-center space-y-2.5"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 line-clamp-1 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {cat._count?.products || 0} Produk
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2. Featured Products Section with Auto-Slider Carousel */}
      {featuredProducts.length > 0 && (
        <FeaturedSlider products={featuredProducts} />
      )}

      {/* 3. Workshop & Custom Service Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-12 shadow-2xl border border-emerald-900/40">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>BENGKEL RESMI & SPESIALIS LARAS JOMBANG</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Butuh Servis Kebocoran Gas, Ganti Laras, atau Upgrade Power?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Menerima servis segala merk senapan PCP, Gejluk, dan Sharp Uklik. Ditangani teknisi berpengalaman dengan alat uji presisi (Chrono Velocity & Uji Grouping 50 Meter).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/servis"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>Lihat Layanan Servis</span>
              </Link>

              <a
                href="https://wa.me/6285806854227?text=Halo%20UD%20Jaya%20Senapan,%20saya%20ingin%20konsultasi%20servis/upgrade%20senapan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Konsultasi Teknis Gratis</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust & Excellence Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">100% Legal & Aman</h3>
              <p className="text-xs text-slate-500 mt-1">Khusus kaliber 4.5mm sesuai regulasi hukum Indonesia.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Uji Akurasi & Chrono</h3>
              <p className="text-xs text-slate-500 mt-1">Setiap unit dites grouping dan stabilitas FPS sebelum dikirim.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Packing Kayu Rapi</h3>
              <p className="text-xs text-slate-500 mt-1">Pengiriman aman ke seluruh Nusantara via kargo resmi.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Garansi Servis Toko</h3>
              <p className="text-xs text-slate-500 mt-1">Dukungan sparepart dan garansi perbaikan langsung di workshop.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
