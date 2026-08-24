import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailView from "@/components/product/ProductDetailView";
import ProductCard from "@/components/product/ProductCard";
import { ChevronRight, Home, Crosshair } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isActive: true,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Increment view counter
  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  });

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: {
      category: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto pb-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1 shrink-0">
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300" />
        <Link href="/katalog" className="hover:text-orange-600 shrink-0">
          Katalog
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <Link
              href={`/katalog?category=${product.category.slug}`}
              className="hover:text-orange-600 shrink-0"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300" />
        <span className="text-slate-900 font-bold truncate">{product.name}</span>
      </nav>

      {/* Main Product Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 bg-white/85">
        <ProductDetailView product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Rekomendasi Terkait
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Produk Sejenis Lainnya
              </h2>
            </div>
            <Link
              href={`/katalog?category=${product.category?.slug}`}
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
