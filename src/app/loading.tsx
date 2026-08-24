import React from "react";
import { Crosshair } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse ring */}
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 border-t-emerald-600 animate-spin" />
        <div className="absolute w-9 h-9 rounded-full bg-emerald-600/10 flex items-center justify-center">
          <Crosshair className="w-5 h-5 text-emerald-600 animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          UD. Jaya Senapan Angin
        </p>
        <p className="text-xs text-slate-400 font-medium">Memuat data halaman...</p>
      </div>
    </div>
  );
}
