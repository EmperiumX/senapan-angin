import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${year}${month}${day}-${randomChars}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { customerAddress: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                mainImage: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data pesanan" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      notes,
      items,
    } = body;

    if (!customerName || !customerPhone || !customerAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Nama, nomor WhatsApp, alamat pengiriman, dan item pesanan wajib diisi" },
        { status: 400 }
      );
    }

    // 🔒 1. Pre-validation: Check stock availability in database BEFORE creating order
    for (const item of items) {
      if (item.productId) {
        const prod = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, stock: true },
        });

        if (!prod || prod.stock <= 0) {
          return NextResponse.json(
            {
              error: `Maaf, produk "${prod?.name || item.productName}" baru saja habis dibeli oleh pelanggan lain.`,
            },
            { status: 400 }
          );
        }

        const requestedQty = Number(item.quantity || 1);
        if (prod.stock < requestedQty) {
          return NextResponse.json(
            {
              error: `Maaf, sisa stok produk "${prod.name}" hanya tinggal ${prod.stock} unit (tidak mencukupi untuk ${requestedQty} unit).`,
            },
            { status: 400 }
          );
        }
      }
    }

    let calculatedTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const price = Number(item.price);
      const quantity = Number(item.quantity) || 1;
      const subtotal = price * quantity;
      calculatedTotal += subtotal;

      orderItemsData.push({
        productId: item.productId || null,
        productName: item.productName || item.name,
        price,
        quantity,
        subtotal,
      });
    }

    const orderNumber = generateOrderNumber();

    // 2. Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        notes: notes ? notes.trim() : null,
        subtotal: calculatedTotal,
        totalAmount: calculatedTotal,
        status: "PENDING",
        whatsappSent: true,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // 3. Atomically decrement product stock in Database
    for (const item of items) {
      if (item.productId) {
        const qty = Number(item.quantity) || 1;
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: qty,
            },
          },
        }).catch(() => null);
      }
    }

    // Fetch store settings for target WA phone
    const setting = await prisma.storeSetting.findFirst();
    const adminPhone = setting?.whatsappNumber || "6285806854227";

    // Generate WhatsApp direct checkout URL
    const whatsappUrl = generateWhatsAppOrderUrl(
      {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        notes: order.notes,
        items: order.items.map((it) => ({
          productName: it.productName,
          price: it.price,
          quantity: it.quantity,
          subtotal: it.subtotal,
        })),
        totalAmount: order.totalAmount,
      },
      adminPhone
    );

    return NextResponse.json(
      {
        success: true,
        order,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pesanan baru" },
      { status: 500 }
    );
  }
}
