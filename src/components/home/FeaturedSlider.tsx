"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface FeaturedSliderProps {
  products: Product[];
}

export default function FeaturedSlider({ products }: FeaturedSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScrollBounds = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScrollBounds();
    el.addEventListener("scroll", checkScrollBounds, { passive: true });
    window.addEventListener("resize", checkScrollBounds);
    return () => {
      el.removeEventListener("scroll", checkScrollBounds);
      window.removeEventListener("resize", checkScrollBounds);
    };
  }, [products]);

  // Auto-scroll every 3.5 seconds if more than 4 products and not hovered
  useEffect(() => {
    if (products.length <= 4 || isHovered) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const cardWidth = el.querySelector<HTMLElement>(".slider-item")?.offsetWidth || 280;
      const gap = 24; // 1.5rem (gap-6)
      const scrollStep = cardWidth + gap;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // Loop back to start smoothly
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [products.length, isHovered]);

  const handlePrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(".slider-item")?.offsetWidth || 280;
    const scrollStep = cardWidth + 24;
    el.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(".slider-item")?.offsetWidth || 280;
    const scrollStep = cardWidth + 24;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: scrollStep, behavior: "smooth" });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Produk <span className="text-emerald-700">Unggulan</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Koleksi terbaik yang dipilih khusus untuk performa dan akurasi tinggi.
          </p>
        </div>

        {/* Navigation Arrow Buttons (Mitrax9 Style) */}
        {products.length > 4 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              title="Produk Sebelumnya"
              aria-label="Produk Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-emerald-700 text-white shadow-md shadow-slate-900/20 flex items-center justify-center transition-all active:scale-95"
              title="Produk Selanjutnya"
              aria-label="Produk Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="slider-item shrink-0 w-[280px] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA (Jelajahi Seluruh Katalog) */}
      <div className="text-center pt-2">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 hover:text-emerald-800 text-xs font-bold rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs transition-all group"
        >
          <span>Jelajahi Seluruh Katalog</span>
          <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
