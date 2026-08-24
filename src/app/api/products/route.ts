import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("featured");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const includeInactive = searchParams.get("all") === "true";

    const where: Record<string, unknown> = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (categorySlug && categorySlug !== "semua") {
      where.category = { slug: categorySlug };
    } else if (categoryId && categoryId !== "semua") {
      where.categoryId = categoryId;
    }

    if (isFeatured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
        { caliber: { contains: search } },
      ];
    }

    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { price: "desc" };
    } else if (sort === "popular") {
      orderBy = { views: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar produk" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!name || !price || !categoryId || !mainImage) {
      return NextResponse.json(
        { error: "Nama, harga, kategori, dan gambar utama wajib diisi" },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: Number(stock ?? 10),
        categoryId,
        mainImage,
        galleryImages: typeof galleryImages === "string" ? galleryImages : JSON.stringify(galleryImages || []),
        description: description || "",
        caliber: caliber || "4.5 mm / .177",
        tubeCapacity: tubeCapacity || null,
        maxPressure: maxPressure || null,
        barrelLength: barrelLength || null,
        stockMaterial: stockMaterial || null,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "Gagal membuat produk baru" },
      { status: 500 }
    );
  }
}
