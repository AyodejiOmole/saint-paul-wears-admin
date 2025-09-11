import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    // Users
    const usersSnap = await rtdb.ref("users").get();
    const usersData = usersSnap.exists() ? usersSnap.val() : {};
    const numberOfUsers = Object.keys(usersData).length;

    // Orders
    const ordersSnap = await rtdb.ref("orders").get();
    const ordersData = ordersSnap.exists() ? ordersSnap.val() : {};
    const numberOfOrders = Object.keys(ordersData).length;

    // Revenue
    let totalRevenue = 0;
    for (const orderId in ordersData) {
      const order = ordersData[orderId];
      if (order?.amount) {
        totalRevenue += Number(order.amount);
      }
    }

    return NextResponse.json({
      users: numberOfUsers,
      orders: numberOfOrders,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin summary" },
      { status: 500 }
    );
  }
}
