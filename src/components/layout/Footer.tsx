import React from "react";
import Link from "next/link";
import { Crosshair, MapPin, Phone, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/30">
                <Crosshair className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                UD. JAYA <span className="text-emerald-400">SENAPAN</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Toko senapan angin dan bengkel servis terpercaya di Jombang, Jawa Timur. Menyediakan senapan PCP, Gejluk, Sharp/Uklik, optik, peluru, aksesoris, dan jasa tune-up bergaransi.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-3 py-2 rounded-xl">
              <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Khusus kaliber 4.5mm (.177) untuk olahraga & berburu hama legal.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Kategori Populer
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/katalog?category=senapan-pcp" className="hover:text-emerald-400 transition-colors">
                  Senapan PCP Match & Hunting
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=senapan-gejluk" className="hover:text-emerald-400 transition-colors">
                  Senapan Gejluk Dual Power
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=senapan-sharp-uklik" className="hover:text-emerald-400 transition-colors">
                  Senapan Sharp / Uklik Klasik
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=teleskop-optik" className="hover:text-emerald-400 transition-colors">
                  Teleskop & Reticle Mil-Dot
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=mimis-peluru" className="hover:text-emerald-400 transition-colors">
                  Mimis / Peluru 4.5mm
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=aksesoris-pompa" className="hover:text-emerald-400 transition-colors">
                  Aksesoris & Pompa PCP
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop & Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Layanan Workshop
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Servis Kebocoran Seal PCP</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ganti & Setting Laras Presisi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Uji Chrono FPS & Grouping Jarak Jauh</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Peredam Suara Senyap Zero Decibel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pengiriman Ekspedisi Aman Packing Kayu</span>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Kontak & Lokasi Workshop
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Jl. Raya Tembelang No. 45, Kec. Tembelang, Kab. Jombang, Jawa Timur 61452</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Senin - Sabtu: 08.00 - 17.00 WIB</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/6285806854227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-medium"
                >
                  0858-0685-4227 (WhatsApp)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} UD. Jaya Senapan Angin Jombang. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/tentang-kami" className="hover:text-slate-400 transition-colors">
              Profil Toko
            </Link>
            <Link href="/servis" className="hover:text-slate-400 transition-colors">
              Garansi Servis
            </Link>
            <Link href="/admin/login" className="hover:text-slate-400 transition-colors text-slate-600">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
