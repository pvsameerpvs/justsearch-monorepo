export function sumTotals(orders: Record<string, unknown>[]): number {
  return orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
}

export function buildSummary(todayOrders: Record<string, unknown>[], allOrders: Record<string, unknown>[]) {
  const todayCompleted = todayOrders.filter((o) => o.status === 'completed');
  const todayRevenue = sumTotals(todayCompleted);
  const allCompleted = allOrders.filter((o) => o.status === 'completed');
  const allTimeRevenue = sumTotals(allCompleted);

  return {
    today: {
      orders: todayOrders.length,
      completed: todayCompleted.length,
      revenue: todayRevenue,
      avgOrderValue: todayCompleted.length > 0 ? Number((todayRevenue / todayCompleted.length).toFixed(2)) : 0,
    },
    allTime: {
      orders: allOrders.length,
      completed: allCompleted.length,
      revenue: allTimeRevenue,
      avgOrderValue: allCompleted.length > 0 ? Number((allTimeRevenue / allCompleted.length).toFixed(2)) : 0,
    },
  };
}

export function buildTopItems(items: Record<string, unknown>[]) {
  const counts: Record<string, { name: string; quantity: number; revenue: number }> = {};
  for (const item of items) {
    const name = String(item.name);
    const quantity = Number(item.quantity ?? 0);
    if (!counts[name]) {
      counts[name] = { name, quantity: 0, revenue: 0 };
    }
    counts[name].quantity += quantity;
    counts[name].revenue += quantity * Number(item.price ?? 0);
  }

  return Object.values(counts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
}
