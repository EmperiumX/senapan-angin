"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex text-slate-900 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminHeader />
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
