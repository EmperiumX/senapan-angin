import React from "react";

export default function CatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-200/80 border border-slate-200" />

      {/* Filter and Search Bar Skeleton */}
      <div className="h-14 rounded-2xl bg-slate-200/60" />

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="rounded-3xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-xs"
          >
            <div className="w-full aspect-square rounded-2xl bg-slate-200/70" />
            <div className="h-4 bg-slate-200/80 rounded-md w-3/4" />
            <div className="h-3 bg-slate-200/60 rounded-md w-1/2" />
            <div className="h-6 bg-slate-200/80 rounded-lg w-2/3 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
