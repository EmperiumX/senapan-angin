"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink, KeyRound } from "lucide-react";
import ChangePasswordModal from "../admin/ChangePasswordModal";

export default function AdminHeader() {
  const pathname = usePathname();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname?.startsWith("/admin/pesanan")) return "Pesanan";
    if (pathname === "/admin/produk/tambah") return "Tambah Produk";
    if (pathname?.startsWith("/admin/produk/") && pathname?.endsWith("/edit")) return "Edit Produk";
    if (pathname?.startsWith("/admin/produk")) return "Produk";
    if (pathname?.startsWith("/admin/produk-unggulan")) return "Produk Unggulan";
    if (pathname?.startsWith("/admin/kategori")) return "Kategori";
    return "Admin";
  };

  return (
    <>
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="text-slate-500">Admin</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold">{getBreadcrumbTitle()}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Realtime aktif</span>
          </div>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100/80 hover:bg-emerald-50 border border-slate-200/70 transition-all"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ganti Password</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100/80 hover:bg-emerald-50 border border-slate-200/70 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Toko</span>
          </Link>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}
