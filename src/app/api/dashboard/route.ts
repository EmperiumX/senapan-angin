import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Total orders & today orders
    const totalOrders = await prisma.order.count();
    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
    });

    // Total completed revenue vs today revenue
    const completedOrders = await prisma.order.findMany({
      where: { status: "COMPLETED" },
      select: { totalAmount: true, createdAt: true },
    });

    const totalRevenue = completedOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const todayRevenue = completedOrders
      .filter((ord) => new Date(ord.createdAt) >= startOfToday)
      .reduce((sum, ord) => sum + ord.totalAmount, 0);

    // Pending orders
    const pendingOrdersCount = await prisma.order.count({
      where: { status: "PENDING" },
    });

    // Total products & low stock products
    const totalProducts = await prisma.product.count({ where: { isActive: true } });
    const lowStockProductsCount = await prisma.product.count({
      where: { stock: { lte: 5 }, isActive: true },
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 7,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    // Status breakdown
    const pendingCount = await prisma.order.count({ where: { status: "PENDING" } });
    const confirmedCount = await prisma.order.count({ where: { status: "CONFIRMED" } });
    const completedCount = completedOrders.length;
    const cancelledCount = await prisma.order.count({ where: { status: "CANCELLED" } });

    // Last 7 days breakdown for chart
    const daysName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ordersIn7Days = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { totalAmount: true, createdAt: true, status: true },
    });

    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const dayIndex = targetDate.getDay();
      const dateString = targetDate.toISOString().slice(0, 10);

      const dayOrders = ordersIn7Days.filter((ord) => {
        const ordDate = new Date(ord.createdAt).toISOString().slice(0, 10);
        return ordDate === dateString;
      });

      const dayTotal = dayOrders
        .filter((o) => o.status === "COMPLETED")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      dailySales.push({
        date: dateString,
        day: daysName[dayIndex],
        count: dayOrders.length,
        total: dayTotal,
      });
    }

    return NextResponse.json({
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      pendingOrdersCount,
      totalProducts,
      lowStockProductsCount,
      recentOrders,
      dailySales,
      orderStatusCounts: {
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Gagal memuat statistik dashboard" },
      { status: 500 }
    );
  }
}
