import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import StorefrontShell from "@/components/layout/StorefrontShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UD. Jaya Senapan Angin - Toko Senapan Angin & Workshop Servis Jombang",
  description:
    "Pusat senapan angin PCP, Gejluk, Sharp/Uklik kaliber 4.5mm, teleskop, mimis, dan bengkel servis terpercaya di Jombang Jawa Timur. Checkout cepat via WhatsApp!",
  keywords: [
    "senapan angin jombang",
    "senapan pcp predator",
    "senapan gejluk",
    "servis senapan angin jombang",
    "ud jaya senapan angin",
    "toko senapan jawa timur",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans">
        <CartProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  );
}
