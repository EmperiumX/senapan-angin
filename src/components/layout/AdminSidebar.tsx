"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  Sparkles,
  Tags,
  LogOut,
  Crosshair,
  KeyRound,
} from "lucide-react";
import ChangePasswordModal from "../admin/ChangePasswordModal";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Strictly only the 5 menus requested:
  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Pesanan",
      href: "/admin/pesanan",
      icon: ShoppingCart,
    },
    {
      name: "Produk",
      href: "/admin/produk",
      icon: Box,
    },
    {
      name: "Produk Unggulan",
      href: "/admin/produk-unggulan",
      icon: Sparkles,
    },
    {
      name: "Kategori",
      href: "/admin/kategori",
      icon: Tags,
    },
  ];

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none shadow-xs">
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                <Crosshair className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                  UD. JAYA <span className="text-emerald-700">ADMIN</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                  Senapan Angin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="p-4 space-y-1.5">
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </span>

            <nav className="mt-2 space-y-1">
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-emerald-700 stroke-[2.2]" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Admin Profile & Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xs shrink-0">
                S
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Super Admin</p>
                <p className="text-[10px] text-slate-400 truncate">Admin Toko</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                title="Ganti Password"
                className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}
