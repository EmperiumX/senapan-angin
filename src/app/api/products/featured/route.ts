import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getAdminSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productIds, isFeatured } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Pilih setidaknya satu produk" },
        { status: 400 }
      );
    }

    await prisma.product.updateMany({
      where: {
        id: { in: productIds },
      },
      data: {
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil memperbarui status ${productIds.length} produk unggulan`,
    });
  } catch (error) {
    console.error("Bulk featured update error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui produk unggulan" },
      { status: 500 }
    );
  }
}
