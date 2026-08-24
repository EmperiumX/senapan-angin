"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair,
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartOpen, cartBump } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/katalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Katalog Produk", href: "/katalog" },
    { name: "Jasa Servis", href: "/servis" },
    { name: "Tentang Kami", href: "/tentang-kami" },
  ];

  return (
    <>
      {/* Top Banner Notice (Tactical Dark Slate) */}
      <div className="bg-slate-900 text-slate-300 text-xs font-medium py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
              Jombang, Jatim
            </span>
            <span className="hidden sm:inline text-slate-300">
              Pusat Senapan Angin Kaliber 4.5mm, Aksesoris & Bengkel Servis Bergaransi
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/6285806854227"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: 0858-0685-4227</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 glass-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
                <Crosshair className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                  UD. JAYA <span className="text-emerald-700">SENAPAN</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Air Rifle Store & Workshop • Jombang
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (With Active / Hover Highlight) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white text-emerald-800 font-extrabold shadow-sm border border-slate-200/70"
                        : "text-slate-600 hover:text-emerald-700 hover:bg-white/80 font-semibold"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/80 transition-all duration-150"
                aria-label="Cari Produk"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button with Animated Badge */}
              <motion.button
                id="navbar-cart-button"
                onClick={() => setIsCartOpen(true)}
                animate={cartBump ? { scale: [1, 1.22, 0.92, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold shadow-md shadow-emerald-700/20 active:scale-95 transition-all duration-150"
                aria-label="Keranjang Belanja"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-semibold">Keranjang</span>
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-white text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-xs"
                >
                  {totalItems}
                </motion.span>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/80 transition-all"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 py-3 overflow-hidden shadow-inner"
            >
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari senapan PCP predator, gejluk, uklik, teleskop, mimis 4.5mm..."
                    className="w-full pl-12 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    Cari
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Dropdown Menu (With Active Item Highlight) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 overflow-hidden shadow-xl"
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 pl-3.5 shadow-xs"
                        : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2">
                <a
                  href="https://wa.me/6285806854227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  Chat WhatsApp Toko
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
