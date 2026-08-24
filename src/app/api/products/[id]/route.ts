import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if id is actually a slug or an id
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Increment views safely
    await prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product get error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data produk" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      sku,
      price,
      discountPrice,
      stock,
      categoryId,
      mainImage,
      galleryImages,
      description,
      caliber,
      tubeCapacity,
      maxPressure,
      barrelLength,
      stockMaterial,
      isFeatured,
      isActive,
    } = body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    let slug = existingProduct.slug;
    if (name && name !== existingProduct.name) {
      slug = slugify(name);
      const duplicateSlug = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (duplicateSlug) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(sku !== undefined && { sku }),
        ...(price !== undefined && { price: Number(price) }),
        discountPrice: discountPrice !== undefined && discountPrice !== null && discountPrice !== "" 
          ? Number(discountPrice) 
          : null,
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(categoryId && { categoryId }),
        ...(mainImage && { mainImage }),
        ...(galleryImages !== undefined && {
          galleryImages: typeof galleryImages === "string" ? galleryImages : JSON.stringify(galleryImages),
        }),
        ...(description !== undefined && { description }),
        ...(caliber !== undefined && { caliber }),
        ...(tubeCapacity !== undefined && { tubeCapacity }),
        ...(maxPressure !== undefined && { maxPressure }),
        ...(barrelLength !== undefined && { barrelLength }),
        ...(stockMaterial !== undefined && { stockMaterial }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data produk" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
