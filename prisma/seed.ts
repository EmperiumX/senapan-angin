import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding MySQL database with physical air rifle product catalog...");

  // Clean old records
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 1. Create Default Admin
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("admin123", salt);
  await prisma.admin.create({
    data: {
      name: "Admin UD. Jaya",
      username: "admin",
      passwordHash,
      role: "super_admin",
    },
  });
  console.log("✅ Admin created (username: admin, pass: admin123)");

  // 2. Store Settings
  await prisma.storeSetting.create({
    data: {
      storeName: "UD. Jaya Senapan Angin",
      tagline: "Pusat Senapan Angin, Aksesoris & Servis Terpercaya di Jombang",
      whatsappNumber: "6285806854227",
      address: "Jl. Raya Tembelang No. 45, Kec. Tembelang, Kab. Jombang, Jawa Timur 61452",
      city: "Jombang",
      operationalHours: "Senin - Sabtu: 08.00 - 17.00 WIB (Minggu: By Appointment)",
      googleMapsUrl: "https://maps.google.com/?q=Jombang",
    },
  });
  console.log("✅ Store settings created");

  // 3. Physical Product Categories (Excluding Jasa Servis)
  const categories = [
    {
      name: "Senapan PCP",
      slug: "senapan-pcp",
      description: "Senapan angin gas bertekanan tinggi dengan akurasi & power maksimal untuk berburu dan lomba.",
      icon: "Crosshair",
      image: "/images/products/pcp-predator.jpg",
      sortOrder: 1,
    },
    {
      name: "Senapan Gejluk",
      slug: "senapan-gejluk",
      description: "Senapan angin dual power (bisa dipompa manual dan diisi gas PCP) yang tangguh di segala medan.",
      icon: "Zap",
      image: "/images/products/senapan-gejluk.jpg",
      sortOrder: 2,
    },
    {
      name: "Senapan Sharp / Uklik",
      slug: "senapan-sharp-uklik",
      description: "Senapan pompa tangan klasik yang praktis, ekonomis, awet, dan mudah dirawat.",
      icon: "Shield",
      image: "/images/products/sharp-uklik.jpg",
      sortOrder: 3,
    },
    {
      name: "Teleskop & Optik",
      slug: "teleskop-optik",
      description: "Teropong bidik presisi tinggi, red dot sight, dan mounting dengan lensa jernih anti-embun.",
      icon: "Eye",
      image: "/images/products/teleskop-optik.jpg",
      sortOrder: 4,
    },
    {
      name: "Mimis / Peluru",
      slug: "mimis-peluru",
      description: "Mimis kaliber 4.5mm berbagai bobot (dome, point, slug) dari brand lokal & impor terpercaya.",
      icon: "CircleDot",
      image: "/images/products/mimis-peluru.jpg",
      sortOrder: 5,
    },
    {
      name: "Aksesoris & Pompa",
      slug: "aksesoris-pompa",
      description: "Pompa PCP high pressure, tas senapan busa tebal, bipod, peredam suara senyap, & tali sandang.",
      icon: "Package",
      image: "/images/products/pompa-pcp.jpg",
      sortOrder: 6,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const record = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = record.id;
  }
  console.log("✅ 6 Physical Categories created");

  // 4. Products (Physical Goods Only)
  const products = [
    {
      name: "PCP Predator Dural 500cc Full CNC Tactical",
      slug: "pcp-predator-dural-500cc-full-cnc-tactical",
      sku: "PCP-PRED-500",
      price: 3950000,
      discountPrice: 3700000,
      stock: 6,
      categoryId: createdCategories["senapan-pcp"],
      mainImage: "/images/products/pcp-predator.jpg",
      galleryImages: JSON.stringify([
        "/images/products/pcp-predator.jpg",
        "/images/products/pcp-bocap.jpg",
      ]),
      description: "Senapan PCP Predator Dural kualitas premium buatan pengrajin profesional Jawa Timur. Dilengkapi chamber monoblock full CNC, tabung Duralium 500cc kuat hingga 3000 PSI, dan laras baja seamless 60cm alur 12 super grouping rapat 50-70 meter.",
      caliber: "4.5 mm (.177 cal)",
      tubeCapacity: "500 cc Duralium 6061-T6",
      maxPressure: "3000 PSI (Safety 2700 PSI)",
      barrelLength: "60 cm Baja Seamless Od 13 Alur 12",
      stockMaterial: "Popor Lipat Tactical Dural CNC + Grip Ergonomis",
      isFeatured: true,
      isActive: true,
      views: 245,
    },
    {
      name: "PCP Marauder Bocap 500cc Classic Mahoni",
      slug: "pcp-marauder-bocap-500cc-classic-mahoni",
      sku: "PCP-MRD-500",
      price: 3450000,
      discountPrice: 3200000,
      stock: 4,
      categoryId: createdCategories["senapan-pcp"],
      mainImage: "/images/products/pcp-bocap.jpg",
      galleryImages: JSON.stringify([
        "/images/products/pcp-bocap.jpg",
        "/images/products/pcp-predator.jpg",
      ]),
      description: "Model klasik elegan dengan popor kayu Mahoni pilihan ber-finishing glossy. Chamber Marauder Magazine isi 14 rotari plus single shot adaptor. Sangat stabil untuk hunting big game maupun medium game.",
      caliber: "4.5 mm (.177 cal)",
      tubeCapacity: "500 cc Tabung Bocap Impor",
      maxPressure: "3000 PSI (Safety 2800 PSI)",
      barrelLength: "65 cm Baja Seamless Od 14",
      stockMaterial: "Kayu Mahoni Oven Grade A Ukir Halus",
      isFeatured: true,
      isActive: true,
      views: 189,
    },
    {
      name: "Senapan Gejluk Dual Power Double Tabung Od 25",
      slug: "senapan-gejluk-dual-power-double-tabung-od-25",
      sku: "GJL-DP-OD25",
      price: 1950000,
      discountPrice: 1800000,
      stock: 8,
      categoryId: createdCategories["senapan-gejluk"],
      mainImage: "/images/products/senapan-gejluk.jpg",
      galleryImages: JSON.stringify([
        "/images/products/senapan-gejluk.jpg",
      ]),
      description: "Senapan Gejluk Dual Power dengan 5 tarikan speed gerendel. Bisa dipompa tumbuk manual hingga 2000 tumbukan atau diisi langsung lewat pompa PCP / tabung scuba.",
      caliber: "4.5 mm (.177 cal)",
      tubeCapacity: "Double Tabung Kuningan Od 25 Tebal 2mm",
      maxPressure: "2500 PSI (Safety 2200 PSI)",
      barrelLength: "60 cm Baja Kuningan Od 8 Alur 12",
      stockMaterial: "Kayu Sono Keling / Mahoni Sport",
      isFeatured: true,
      isActive: true,
      views: 312,
    },
    {
      name: "Senapan Sharp Tiger Long Truglo Od 22",
      slug: "senapan-sharp-tiger-long-truglo-od-22",
      sku: "SHP-TGR-LNG",
      price: 850000,
      discountPrice: 780000,
      stock: 15,
      categoryId: createdCategories["senapan-sharp-uklik"],
      mainImage: "/images/products/sharp-uklik.jpg",
      galleryImages: JSON.stringify([]),
      description: "Senapan pompa tangan (uklik) paling populer untuk pemula & berburu hama burung / tupai. Ringan, awet, dan hemat biaya karena tidak perlu beli gas tambahan.",
      caliber: "4.5 mm (.177 cal)",
      tubeCapacity: "Pipa Kuningan Od 22 Pompa 3-8x",
      maxPressure: "Manual Pompa Tangan",
      barrelLength: "55 cm Baja Alur 12",
      stockMaterial: "Popor ABS Polycarbonate Tahan Benturan",
      isFeatured: false,
      isActive: true,
      views: 120,
    },
    {
      name: "Teleskop Discovery VT-R 3-12x40 AOE Parallax",
      slug: "teleskop-discovery-vt-r-3-12x40-aoe-parallax",
      sku: "TEL-DISC-312",
      price: 890000,
      discountPrice: 820000,
      stock: 12,
      categoryId: createdCategories["teleskop-optik"],
      mainImage: "/images/products/teleskop-optik.jpg",
      galleryImages: JSON.stringify([]),
      description: "Teleskop Discovery original seri VT-R dengan fitur Adjustable Objective (AO) untuk mengatur fokus jarak 5 yard hingga tak terhingga. Dilengkapi reticle HK mil-dot dengan lampu hijau/merah.",
      caliber: "Universal Tube 25.4mm",
      tubeCapacity: "Nitrogen Filled Anti Fog & Shockproof",
      maxPressure: "Tahan Getaran PCP & Gejluk",
      barrelLength: "Panjang 32 cm",
      stockMaterial: "Aluminium Anodized Matte Black",
      isFeatured: true,
      isActive: true,
      views: 175,
    },
    {
      name: "Mimis Baracuda Match Cal. 4.5mm Super Precision",
      slug: "mimis-baracuda-match-cal-45mm-super-precision",
      sku: "MMS-BARA-01",
      price: 135000,
      discountPrice: 125000,
      stock: 45,
      categoryId: createdCategories["mimis-peluru"],
      mainImage: "/images/products/mimis-peluru.jpg",
      galleryImages: JSON.stringify([]),
      description: "Peluru mimis kepala dome dengan bobot 10.65 grain. Tingkat presisi tinggi dan aerodinamis optimal, pilihan utama para pemburu jarak jauh (long range hunting). Isi 500 butir per kaleng.",
      caliber: "4.5 mm / .177 cal (10.65 Grain)",
      tubeCapacity: "Kaleng Timah Isi 500 Butir",
      maxPressure: "Cocok untuk PCP & Gejluk Power Besar",
      barrelLength: "-",
      stockMaterial: "Lead Alloy Presisi Tinggi",
      isFeatured: false,
      isActive: true,
      views: 98,
    },
    {
      name: "Pompa PCP High Pressure 4500 PSI Stainless 304",
      slug: "pompa-pcp-high-pressure-4500-psi-stainless-304",
      sku: "PMP-PCP-4500",
      price: 750000,
      discountPrice: 680000,
      stock: 9,
      categoryId: createdCategories["aksesoris-pompa"],
      mainImage: "/images/products/pompa-pcp.jpg",
      galleryImages: JSON.stringify([]),
      description: "Pompa manual 3 stage untuk pengisian tabung PCP hingga 4500 PSI / 300 Bar. Bahan stainless steel 304 anti karat dilengkapi manometer mini fosfor dan oil-water filter separator.",
      caliber: "Coupler Mini Betina Universal",
      tubeCapacity: "Tekanan Maksimum 4500 PSI (300 Bar)",
      maxPressure: "3 Stage Hand Pump",
      barrelLength: "Tinggi 62 cm",
      stockMaterial: "Full Stainless Steel 304 + Pegangan Karet",
      isFeatured: true,
      isActive: true,
      views: 140,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }
  console.log("✅ Products created (physical products only)");

  // 5. Sample Orders
  const sampleOrders = [
    {
      orderNumber: "ORD-20260821-0FEL",
      customerName: "Zidan Fathul",
      customerPhone: "081234567890",
      customerAddress: "Kec. Peterongan, Jombang",
      notes: "Tolong disetting grouping 40 meter sebelum dikirim ya mas.",
      subtotal: 3700000,
      totalAmount: 3700000,
      status: "PENDING",
      createdAt: new Date("2026-08-21T09:15:00Z"),
      items: [
        {
          productName: "PCP Predator Dural 500cc Full CNC Tactical",
          price: 3700000,
          quantity: 1,
          subtotal: 3700000,
        },
      ],
    },
    {
      orderNumber: "ORD-20260820-IDNA",
      customerName: "Pak Purwanto",
      customerPhone: "085678901234",
      customerAddress: "Jl. Hayam Wuruk No. 12, Jombang",
      notes: "Ambil langsung di toko sore ini.",
      subtotal: 1800000,
      totalAmount: 1800000,
      status: "COMPLETED",
      createdAt: new Date("2026-08-20T11:30:00Z"),
      items: [
        {
          productName: "Senapan Gejluk Dual Power Double Tabung Od 25",
          price: 1800000,
          quantity: 1,
          subtotal: 1800000,
        },
      ],
    },
    {
      orderNumber: "ORD-20260820-I3OW",
      customerName: "Bu Dhea Lestari",
      customerPhone: "087811223344",
      customerAddress: "Kec. Diwek, Jombang",
      notes: "Kirim pakai JNT Cargo ya.",
      subtotal: 1500000,
      totalAmount: 1500000,
      status: "COMPLETED",
      createdAt: new Date("2026-08-20T14:45:00Z"),
      items: [
        {
          productName: "Teleskop Discovery VT-R 3-12x40 AOE Parallax",
          price: 820000,
          quantity: 1,
          subtotal: 820000,
        },
        {
          productName: "Pompa PCP High Pressure 4500 PSI Stainless 304",
          price: 680000,
          quantity: 1,
          subtotal: 680000,
        },
      ],
    },
    {
      orderNumber: "ORD-20260820-G5DU",
      customerName: "Azalia Rahman",
      customerPhone: "089699887766",
      customerAddress: "Kec. Mojoagung, Jombang",
      notes: "Mimis Baracuda 2 kaleng.",
      subtotal: 250000,
      totalAmount: 250000,
      status: "COMPLETED",
      createdAt: new Date("2026-08-20T16:20:00Z"),
      items: [
        {
          productName: "Mimis Baracuda Match Cal. 4.5mm Super Precision",
          price: 125000,
          quantity: 2,
          subtotal: 250000,
        },
      ],
    },
  ];

  for (const ord of sampleOrders) {
    const { items, ...orderData } = ord;
    const createdOrder = await prisma.order.create({ data: orderData });
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: createdOrder.id,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        },
      });
    }
  }
  console.log("✅ Sample orders seeded");
  console.log("🎉 Database seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
