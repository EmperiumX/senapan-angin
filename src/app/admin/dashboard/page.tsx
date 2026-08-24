"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { DashboardStats } from "@/types";
import {
  ShoppingCart,
  Clock,
  DollarSign,
  TrendingUp,
  Box,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Pesanan",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      iconBg: "bg-emerald-50 text-emerald-700",
      textColor: "text-emerald-700",
    },
    {
      title: "Pesanan Hari Ini",
      value: stats?.todayOrders || 0,
      icon: Clock,
      iconBg: "bg-teal-50 text-teal-700",
      textColor: "text-teal-700",
    },
    {
      title: "Total Pendapatan",
      value: formatRupiah(stats?.totalRevenue || 0),
      icon: DollarSign,
      iconBg: "bg-emerald-100 text-emerald-800",
      textColor: "text-emerald-800",
    },
    {
      title: "Pendapatan Hari Ini",
      value: formatRupiah(stats?.todayRevenue || 0),
      icon: TrendingUp,
      iconBg: "bg-emerald-50 text-emerald-700",
      textColor: "text-emerald-700",
    },
    {
      title: "Pesanan Pending (WA)",
      value: stats?.pendingOrdersCount || 0,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-700",
      textColor: "text-amber-700",
    },
    {
      title: "Total Produk",
      value: stats?.totalProducts || 0,
      icon: Box,
      iconBg: "bg-slate-100 text-slate-700",
      textColor: "text-slate-700",
    },
    {
      title: "Stok Hampir Habis",
      value: stats?.lowStockProductsCount || 0,
      icon: AlertTriangle,
      iconBg: "bg-red-50 text-red-700",
      textColor: "text-red-700",
    },
  ];

  // Calculate success conversion rate
  const totalProcessed = (stats?.orderStatusCounts.completed || 0) + (stats?.orderStatusCounts.cancelled || 0);
  const conversionRate = totalProcessed > 0
    ? Math.round(((stats?.orderStatusCounts.completed || 0) / totalProcessed) * 100)
    : 100;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ringkasan performa penjualan dan statistik pesanan toko
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 shadow-xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* 7 Metric Cards (MitraX9 Styled) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  {card.title}
                </span>
                <span className={`text-xl font-extrabold tracking-tight mt-1.5 block ${card.textColor}`}>
                  {card.value}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl shrink-0 ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Order Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sales & Order Trend Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tren Pendapatan & Penjualan
              </h3>
              <p className="text-xs text-slate-400">
                Ringkasan performa 7 hari terakhir
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live Analytics
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailySales || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `Rp ${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: unknown) => [formatRupiah(Number(value) || 0), "Pendapatan"]}
                  labelFormatter={(label) => `Hari: ${label}`}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Order Status Distribution */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Status Pesanan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribusi status order aktif</p>

            <div className="mt-6 space-y-4">
              {/* Pending */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-amber-700">Pending (Menunggu WA)</span>
                  <span className="text-slate-900">{stats?.orderStatusCounts.pending || 0} order</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats?.totalOrders ? ((stats.orderStatusCounts.pending || 0) / stats.totalOrders) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Confirmed / Dibayar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-blue-700">Diproses / Dikonfirmasi</span>
                  <span className="text-slate-900">{stats?.orderStatusCounts.confirmed || 0} order</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats?.totalOrders ? ((stats.orderStatusCounts.confirmed || 0) / stats.totalOrders) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Completed */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-700">Selesai (Completed)</span>
                  <span className="text-slate-900">{stats?.orderStatusCounts.completed || 0} order</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        stats?.totalOrders ? ((stats.orderStatusCounts.completed || 0) / stats.totalOrders) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Konversi Sukses:</span>
            <span className="font-extrabold text-emerald-700 text-sm">{conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table (MitraX9 Styled) */}
      <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Pesanan Terbaru</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Auto-refresh saat ada pesanan baru
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 min-w-[500px]"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{ord.customerName}</h4>
                  <span className="text-xs font-mono text-slate-400">{ord.orderNumber}</span>
                </div>

                <div className="flex items-center gap-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      ord.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : ord.status === "CONFIRMED"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : ord.status === "CANCELLED"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {ord.status}
                  </span>

                  <span className="text-sm font-extrabold text-slate-900 w-28 text-right">
                    {formatRupiah(ord.totalAmount)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada data pesanan terbaru
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
          <Link
            href="/admin/pesanan"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
          >
            <span>Lihat Semua Pesanan di Menu Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
