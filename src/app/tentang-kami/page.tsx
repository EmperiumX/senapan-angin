import React from "react";
import Link from "next/link";
import { Crosshair, MapPin, Phone, ShieldCheck, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200/80 bg-white/90 space-y-4 text-center sm:text-left relative overflow-hidden shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
          <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
          <span>Profil & Komitmen</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Tentang <span className="text-emerald-700">UD. Jaya Senapan Angin</span>
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Pusat penjualan senapan angin, aksesoris berburu, dan bengkel servis terkemuka yang berpusat di Kabupaten Jombang, Jawa Timur. Kami berdedikasi menghadirkan unit senapan angin legal berakurasi tinggi dengan layanan purna jual terbaik.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Dedikasi Terhadap Akurasi & Kualitas Presisi
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Berawal dari hobi dan kecintaan terhadap olahraga menembak sasaran, UD. Jaya Senapan Angin kini berkembang menjadi salah satu sentra perakitan dan distribusi senapan angin terpercaya di wilayah Jawa Timur.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Setiap unit senapan yang keluar dari workshop kami telah melewati serangkaian pengujian ketat: mulai dari uji tekanan tabung hidrostatik, pemeriksaan alur laras, hingga tes grouping jarak 50-70 meter untuk memastikan kepuasan setiap pelanggan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">100% Kepatuhan Hukum</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Khusus kaliber 4.5mm (.177) sesuai regulasi Kepolisian RI.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Garansi Toko Resmi</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Jaminan servis dan ketersediaan sparepart orisinal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: High-Contrast Tactical Slate Card with Crystal Clear Text */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient emerald glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Lokasi Workshop & Toko</h3>
                <p className="text-xs text-emerald-400 font-semibold">Jombang, Jawa Timur</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 relative z-10">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-400 block text-[11px] uppercase tracking-wider">
                  Alamat Lengkap
                </span>
                <p className="text-white font-medium leading-relaxed">
                  Jl. Raya Tembelang No. 45, Kec. Tembelang, Kab. Jombang, Jawa Timur 61452
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-400 block text-[11px] uppercase tracking-wider">
                  Jam Operasional
                </span>
                <p className="text-white font-medium">
                  Senin - Sabtu: 08.00 - 17.00 WIB (Minggu: By Appointment)
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-400 block text-[11px] uppercase tracking-wider">
                  Kontak WhatsApp
                </span>
                <p className="text-white font-mono font-bold text-sm">
                  0858-0685-4227
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/6285806854227"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 active:scale-95 relative z-10"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi Kami via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
