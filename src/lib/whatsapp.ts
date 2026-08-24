import { formatRupiah } from "./utils";

export interface WhatsAppOrderPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string | null;
  items: {
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  totalAmount: number;
}

export function formatWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const dateStr = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  let itemListText = "";
  payload.items.forEach((item, index) => {
    itemListText += `${index + 1}. *${item.productName}* (${item.quantity}x) - ${formatRupiah(item.subtotal)}\n`;
  });

  const message = `*PESANAN BARU - UD. JAYA SENAPAN ANGIN*
----------------------------------------
*No. Pesanan:* #${payload.orderNumber}
*Tanggal:* ${dateStr} WIB

*DATA PEMBELI:*
• *Nama:* ${payload.customerName}
• *No. WhatsApp:* ${payload.customerPhone}
• *Alamat Pengiriman:* ${payload.customerAddress}
${payload.notes ? `• *Catatan:* ${payload.notes}\n` : ""}
*RINCIAN PESANAN:*
${itemListText}
*TOTAL PEMBAYARAN:* *${formatRupiah(payload.totalAmount)}*
----------------------------------------
Halo Admin UD. Jaya Senapan Angin, saya telah membuat pesanan di atas melalui website. Mohon konfirmasi ketersediaan barang dan info ongkos kirimnya ya. Terima kasih!`;

  return message;
}

export function generateWhatsAppOrderUrl(
  payload: WhatsAppOrderPayload,
  adminPhone: string = "6285806854227"
): string {
  const cleanPhone = adminPhone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
  const message = formatWhatsAppOrderMessage(payload);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppFollowUpUrl(
  customerPhone: string,
  customerName: string,
  orderNumber: string,
  productNames: string
): string {
  const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;

  const message = `Halo Kak ${customerName}, salam hangat dari *UD. Jaya Senapan Angin* (Jombang).

Kami melihat Kakak sempat memilih pesanan *#${orderNumber}* (${productNames}).
Apakah ada yang bisa kami bantu terkait ketersediaan stok, info spesifikasi, atau estimasi ongkir ke alamat Kakak?

Kami siap membantu proses pemesanannya ya Kak. Terima kasih! 🙏🎯`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
