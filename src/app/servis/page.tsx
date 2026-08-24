import React from "react";
import Link from "next/link";
import {
  Wrench,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Clock,
  ArrowRight,
  Gauge,
  Disc,
  Cog,
  MessageCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function ServicePage() {
  const servicePackages = [
    {
      title: "Servis Kebocoran Seal Total",
      price: "Rp 150.000 - Rp 250.000",
      description: "Bongkar total chamber & tabung, penggantian full set seal/oring orisinal Polyurethane & Viton tahan tekanan 3500 PSI.",
      features: ["Ganti Semua Seal Valve & Tabung", "Pengecekan Manometer", "Tes Rendam Uji Bocor 24 Jam"],
      icon: Cog,
    },
    {
      title: "Tune-up Power FPS & Akurasi",
      price: "Rp 200.000 - Rp 350.000",
      description: "Optimalisasi setelan hammer spring, transfer port, dan valve regulator untuk mendapatkan lonjakan FPS stabil dan irit konsumsi gas.",
      features: ["Uji Chronograph Speed FPS", "Setelan Trigger Lembut & Renyah", "Penataan Aliran Angin Chamber"],
      icon: Gauge,
    },
    {
      title: "Ganti & Setting Laras Presisi",
      price: "Rp 350.000 - Rp 650.000",
      description: "Pemasangan laras baja seamless alur 12, pembuatan drat peredam presisi, crowning ujung laras, dan setting grouping koin 50-70 meter.",
      features: ["Laras Baja Seamless Grade A", "Crowning & Choke Presisi", "Uji Grouping Koin Jarak Jauh"],
      icon: Disc,
    },
  ];

  const generalConsultUrl = `https://wa.me/6285806854227?text=${encodeURIComponent(
    "Halo Admin UD. Jaya Senapan Angin, saya ingin konsultasi servis senapan angin untuk kendala/servis hal lain:\n\n- Jenis Senapan (PCP/Gejluk/Sharp):\n- Kendala / Keluhan:\n- Lokasi Saya:\n\nMohon info estimasi perbaikan dan prosedurnya ya mas."
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200/80 bg-white/90 space-y-5 text-center sm:text-left relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60 w-fit">
            <Wrench className="w-4 h-4 text-emerald-600" />
            <span>BENGKEL RESMI UD. JAYA SENAPAN ANGIN JOMBANG</span>
          </div>

          <a
            href={generalConsultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all w-fit"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi Servis Sekarang</span>
          </a>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Jasa Servis, Tune-Up & <span className="text-emerald-700">Upgrade Senapan Angin</span>
        </h1>

        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Ditangani langsung oleh teknisi senapan angin berpengalaman di workshop UD. Jaya Senapan Angin Jombang. Menggunakan peralatan presisi, uji chronograph FPS, penggantian seal orisinal, dan garansi servis 1 bulan.
        </p>
      </div>

      {/* Popular Service Packages Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
            Paket Servis Populer
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Pilihan Layanan Workshop Terbanyak
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicePackages.map((pkg, idx) => {
            const Icon = pkg.icon;
            const packageWaUrl = `https://wa.me/6285806854227?text=${encodeURIComponent(
              `Halo Admin UD. Jaya Senapan, saya ingin konsultasi dan booking servis paket: *${pkg.title}*`
            )}`;

            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-3xl border border-slate-200/80 flex flex-col justify-between space-y-6 bg-white/90 shadow-xs hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-slate-400 font-semibold block">Estimasi Biaya:</span>
                    <span className="text-lg font-black text-emerald-800">{pkg.price}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {pkg.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={packageWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Konsultasi Paket Ini</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Custom / Other Service Consultation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-10 rounded-3xl border border-emerald-900/40 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SERVIS HAL LAIN / CUSTOM UPGRADE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Punya Keluhan atau Ingin Servis Hal Lain?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Selain paket di atas, kami juga menerima modifikasi khusus: pemasangan regulator tabung, perbaikan drat manometer rusak, pembuatan peredam senyap custom, pergantian tabung dural/titanium, servis grendel macet, hingga restorasi popor senapan lama.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bebas Tanya & Gratis Konsultasi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Estimasi Biaya Transparan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bisa Kirim Seluruh Indonesia
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center">
            <a
              href={generalConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-700/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center"
            >
              <PhoneCall className="w-5 h-5 text-white" />
              <span>Konsultasi Servis</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Langsung terhubung dengan teknisi kami via WhatsApp resmi
            </p>
          </div>
        </div>
      </div>

      {/* Workshop Workflow Steps */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/80 bg-white/90 space-y-8 shadow-xs">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Alur Pengerjaan
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Cara Mengirimkan Unit untuk Diservis
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Konsultasi Keluhan</h4>
            <p className="text-xs text-slate-500">
              Klik tombol &quot;Konsultasi Servis&quot; dan jelaskan kendala senapan Anda (misal: angin merembes, power drop, grouping pecah).
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Kirim / Bawa Unit</h4>
            <p className="text-xs text-slate-500">
              Bawa langsung ke workshop di Jombang atau kirim menggunakan ekspedisi kargo dengan packing aman tanpa gas.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Pemeriksaan & Servis</h4>
            <p className="text-xs text-slate-500">
              Teknisi memeriksa detail kerusakan, memberi estimasi biaya, dan mengeksekusi penggantian suku cadang orisinal.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Uji Akurasi & Kirim Balik</h4>
            <p className="text-xs text-slate-500">
              Unit diuji tembak grouping & chronograph. Setelah terbukti sempurna, senapan siap diambil atau dikirim balik bergaransi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
