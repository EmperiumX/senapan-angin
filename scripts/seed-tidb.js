const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function seedTiDB() {
  const url = "mysql://2G3pNrZLJH72hNa.root:OdsHhHRNg190vC8r@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={\"rejectUnauthorized\":true}";
  console.log("Connecting to TiDB Cloud...");
  const conn = await mysql.createConnection(url);
  console.log("Connected successfully!");

  // 1. Clean existing
  await conn.execute("DELETE FROM OrderItem");
  await conn.execute("DELETE FROM `Order`");
  await conn.execute("DELETE FROM Product");
  await conn.execute("DELETE FROM Category");
  await conn.execute("DELETE FROM Admin");
  await conn.execute("DELETE FROM StoreSetting");

  // 2. Insert Admin (admin / admin123)
  const salt = await bcrypt.genSalt(10);
  const passHash = await bcrypt.hash("admin123", salt);
  await conn.execute(
    "INSERT INTO Admin (id, name, username, passwordHash, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
    ["adm_super_01", "Admin UD. Jaya", "admin", passHash, "super_admin"]
  );
  console.log("✅ Admin created in TiDB (admin / admin123)");

  // 3. Store Setting
  await conn.execute(
    `INSERT INTO StoreSetting (id, storeName, tagline, whatsappNumber, address, city, operationalHours, googleMapsUrl, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      "store_01",
      "UD. Jaya Senapan Angin",
      "Pusat Senapan Angin, Aksesoris & Servis Terpercaya di Jombang",
      "6285806854227",
      "Jl. Raya Tembelang No. 45, Kec. Tembelang, Kab. Jombang, Jawa Timur 61452",
      "Jombang",
      "Senin - Sabtu: 08.00 - 17.00 WIB (Minggu: By Appointment)",
      "https://maps.google.com/?q=Jombang"
    ]
  );
  console.log("✅ Store settings created in TiDB");

  // 4. Categories
  const categories = [
    { id: "cat_pcp", name: "Senapan PCP", slug: "senapan-pcp", icon: "Crosshair", sortOrder: 1 },
    { id: "cat_gejluk", name: "Senapan Gejluk", slug: "senapan-gejluk", icon: "Zap", sortOrder: 2 },
    { id: "cat_uklik", name: "Senapan Sharp / Uklik", slug: "senapan-sharp-uklik", icon: "Shield", sortOrder: 3 },
    { id: "cat_optik", name: "Teleskop & Optik", slug: "teleskop-optik", icon: "Eye", sortOrder: 4 },
    { id: "cat_mimis", name: "Mimis / Peluru (4.5mm)", slug: "mimis-peluru", icon: "CircleDot", sortOrder: 5 },
    { id: "cat_aksesoris", name: "Aksesoris & Pompa", slug: "aksesoris-pompa", icon: "Package", sortOrder: 6 }
  ];

  for (const c of categories) {
    await conn.execute(
      "INSERT INTO Category (id, name, slug, icon, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [c.id, c.name, c.slug, c.icon, c.sortOrder]
    );
  }
  console.log("✅ 6 Categories created in TiDB");

  // 5. Products
  const products = [
    {
      id: "prod_01",
      name: "PCP Predator Dural 500cc Full CNC Tactical",
      slug: "pcp-predator-dural-500cc-full-cnc",
      sku: "PCP-PRED-500",
      description: "Senapan PCP Predator Tactical tabung dural 500cc dengan chamber monoblock CNC presisi tinggi. Dilengkapi laras baja seamless 60cm alur 12 super akurat untuk hunting jarak jauh dan lomba tembak siluet.",
      price: 3950000,
      stock: 6,
      caliber: "4.5 mm (.177 cal)",
      barrelLength: "60 cm Baja Seamless Od 13 Alur 12",
      tubeCapacity: "500 cc Duralium 6061-T6",
      maxPressure: "3000 PSI (Safety 2700 PSI)",
      stockMaterial: "Popor Lipat Tactical Dural CNC",
      mainImage: "/images/products/pcp-predator.jpg",
      isFeatured: true,
      categoryId: "cat_pcp"
    },
    {
      id: "prod_02",
      name: "PCP Bocap 500cc Marauder Popor Thole Kayu",
      slug: "pcp-bocap-500cc-marauder-popor-thole",
      sku: "PCP-BOC-500",
      description: "Senapan PCP Bocap 500cc sistem Marauder magazine 14 round. Popor model thole kayu mahoni pilihan dengan ukiran ergonomis dan kenyamanan membidik maksimal.",
      price: 4200000,
      stock: 4,
      caliber: "4.5 mm (.177 cal)",
      barrelLength: "60 cm Baja Seamless Od 14 Serobong 19",
      tubeCapacity: "500 cc Botol Bocap Taiwan",
      maxPressure: "3000 PSI (Safety 2800 PSI)",
      stockMaterial: "Kayu Mahoni Pilihan Finishing Doff",
      mainImage: "/images/products/pcp-bocap.jpg",
      isFeatured: true,
      categoryId: "cat_pcp"
    },
    {
      id: "prod_03",
      name: "Gejluk Dual Power Pasopati 25/60 Od 25 Manometer",
      slug: "gejluk-dual-power-pasopati-od25",
      sku: "GEJ-PASO-2560",
      description: "Senapan angin Gejluk Dual Power merk Pasopati. Bisa dipompa manual injak kaki atau diisi tabung scuba / pompa PCP. Sangat tangguh untuk berburu hama babi dan tupai.",
      price: 1850000,
      stock: 8,
      caliber: "4.5 mm (.177 cal)",
      barrelLength: "60 cm Kuningan Od 8 Alur 12",
      tubeCapacity: "Kuningan Tebal Od 25",
      maxPressure: "2500 PSI (Tarik 5 Speed)",
      stockMaterial: "Kayu Mahoni Ukir Gagah",
      mainImage: "/images/products/senapan-gejluk.jpg",
      isFeatured: true,
      categoryId: "cat_gejluk"
    },
    {
      id: "prod_04",
      name: "Sharp Innova Long Barrel Original Chamber Metal",
      slug: "sharp-innova-long-barrel-original",
      sku: "SHARP-INN-LNG",
      description: "Senapan pompa tangan (uklik) Sharp Innova laras panjang 60cm dengan chamber aluminium metal anti pecah. Akurasi mantap 25-35 meter, mudah dirawat dan hemat biaya.",
      price: 650000,
      stock: 15,
      caliber: "4.5 mm (.177 cal)",
      barrelLength: "60 cm Baja Alur 12",
      tubeCapacity: "Pipa Od 22 mm",
      maxPressure: "4 - 8 Kali Pompa",
      stockMaterial: "Kayu Mahoni Standard Hunting",
      mainImage: "/images/products/sharp-uklik.jpg",
      isFeatured: true,
      categoryId: "cat_uklik"
    },
    {
      id: "prod_05",
      name: "Teleskop Discovery VT-R 4-16x42 AOE Reticle HK",
      slug: "teleskop-discovery-vtr-4-16x42-aoe",
      sku: "TEL-DISC-416",
      description: "Teleskop optik sniper merk Discovery VT-R zoom 4x sampai 16x lensa depan 42mm. Lensa jernih nitrogen filled tahan getar (shockproof & fogproof) cocok untuk PCP.",
      price: 950000,
      stock: 10,
      caliber: "Mounting Double Baut Rel 11mm",
      barrelLength: "Lensa 42mm Jernih Coated",
      tubeCapacity: "Tube Diameter 25.4mm",
      maxPressure: "Shockproof tested senapan recoil",
      stockMaterial: "Aluminium Aircraft Grade",
      mainImage: "/images/products/teleskop-optik.jpg",
      isFeatured: true,
      categoryId: "cat_optik"
    },
    {
      id: "prod_06",
      name: "Mimis Baracuda Match 4.5mm Cal .177 Kaleng 500 Butir",
      slug: "mimis-baracuda-match-45mm-500",
      sku: "MIM-BARA-45",
      description: "Peluru mimis premium Baracuda Match berat 10.65 grain kaliber 4.5mm isi 500 butir. Presisi tinggi, round head aerodinamis untuk grouping rapat jarak jauh.",
      price: 135000,
      stock: 50,
      caliber: "4.5 mm / .177 cal",
      barrelLength: "Berat 10.65 Grain",
      tubeCapacity: "Isi 500 Butir per Kaleng",
      maxPressure: "Kubah Bulat (Dome Head)",
      stockMaterial: "Timah Murni Presisi Tinggi",
      mainImage: "/images/products/mimis-peluru.jpg",
      isFeatured: true,
      categoryId: "cat_mimis"
    },
    {
      id: "prod_07",
      name: "Pompa PCP Kaki Lipat 6000 PSI Stainless Filter Mini",
      slug: "pompa-pcp-kaki-lipat-6000-psi",
      sku: "POMP-PCP-6000",
      description: "Pompa tangan manual tekanan tinggi hingga 6000 PSI (3 Stage) bahan stainless steel 304 anti karat. Kaki bisa dilipat mudah dibawa ke hutan, bonus filter busa & oring cadangan.",
      price: 750000,
      stock: 12,
      caliber: "Coupler Mini Betina Universal",
      barrelLength: "Panjang 62 cm (3 Stage)",
      tubeCapacity: "Stainless Steel 304 Tebal",
      maxPressure: "6000 PSI / 400 Bar",
      stockMaterial: "Grip Karet Ergonomis",
      mainImage: "/images/products/pompa-pcp.jpg",
      isFeatured: true,
      categoryId: "cat_aksesoris"
    }
  ];

  for (const p of products) {
    await conn.execute(
      `INSERT INTO Product (id, name, slug, sku, description, price, stock, caliber, barrelLength, tubeCapacity, maxPressure, stockMaterial, mainImage, isFeatured, isActive, categoryId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
      [
        p.id,
        p.name,
        p.slug,
        p.sku,
        p.description,
        p.price,
        p.stock,
        p.caliber,
        p.barrelLength,
        p.tubeCapacity,
        p.maxPressure,
        p.stockMaterial,
        p.mainImage,
        p.isFeatured ? 1 : 0,
        p.categoryId
      ]
    );
  }
  console.log("✅ 7 Physical products created in TiDB");

  await conn.end();
  console.log("🎉 Seeding to TiDB Cloud COMPLETED SUCCESSFULLY!");
}

seedTiDB().catch(console.error);
