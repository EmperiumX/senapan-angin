"use client";

import React, { useEffect, useState } from "react";
import { Order } from "@/types";
import { formatRupiah, formatDate } from "@/lib/utils";
import { generateWhatsAppFollowUpUrl } from "@/lib/whatsapp";
import {
  Search,
  RefreshCw,
  Phone,
  Eye,
  Trash2,
  FileText,
  Send,
  X,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      let url = "/api/orders";
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search) params.append("search", search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Orders fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus as any } : ord))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      }
    } catch (e) {
      console.error("Failed to delete order:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pesanan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola transaksi dan follow-up pemesanan via WhatsApp
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 shadow-xs transition-all w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { label: "Semua", value: "ALL" },
            { label: "Pending (Menunggu WA)", value: "PENDING" },
            { label: "Diproses", value: "CONFIRMED" },
            { label: "Selesai", value: "COMPLETED" },
            { label: "Dibatalkan", value: "CANCELLED" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === item.value
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, no WA, order ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">No. Pesanan & Waktu</th>
                <th className="p-4">Pembeli & Kontak</th>
                <th className="p-4">Total Pesanan</th>
                <th className="p-4">Status Pesanan</th>
                <th className="p-4 text-center">Follow-up WA</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                    Memuat data pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    Tidak ada data pesanan ditemukan
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const productSummary = ord.items.map((i) => i.productName).join(", ");
                  const followUpUrl = generateWhatsAppFollowUpUrl(
                    ord.customerPhone,
                    ord.customerName,
                    ord.orderNumber,
                    productSummary
                  );

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 pl-6">
                        <span className="font-mono font-bold text-slate-900 block">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(ord.createdAt)}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {ord.customerPhone}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-emerald-800 text-sm block">
                          {formatRupiah(ord.totalAmount)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {ord.items.length} item barang
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
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
                      </td>

                      <td className="p-4 text-center">
                        <a
                          href={followUpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 font-bold text-[11px] rounded-xl shadow-xs transition-all"
                          title="Kirim pesan follow up ke WhatsApp pembeli"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </a>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Lihat Detail Pesanan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Hapus Pesanan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Detail Pesanan
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Buyer Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Nama Pembeli:</span>
                <span className="font-bold text-slate-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">No. WhatsApp:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {selectedOrder.customerPhone}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500 font-semibold shrink-0">Alamat Kirim:</span>
                <span className="text-right text-slate-800 font-medium">
                  {selectedOrder.customerAddress}
                </span>
              </div>
              {selectedOrder.notes && (
                <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Catatan:</strong> {selectedOrder.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Barang ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.productName}</span>
                      <span className="text-slate-400">
                        {formatRupiah(item.price)} x {item.quantity}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
                <div className="p-3 bg-emerald-50 flex items-center justify-between text-xs font-bold">
                  <span>Total Pembayaran:</span>
                  <span className="text-emerald-800 text-sm font-extrabold">
                    {formatRupiah(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Changer Actions */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700">Ubah Status Pesanan:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "CONFIRMED")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedOrder.status === "CONFIRMED"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white hover:bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  Diproses
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "COMPLETED")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedOrder.status === "COMPLETED"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  Selesai
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELLED")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedOrder.status === "CANCELLED"
                      ? "bg-red-600 text-white border-red-600 shadow-xs"
                      : "bg-white hover:bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
