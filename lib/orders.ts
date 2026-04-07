import { createAdminClient } from "./supabase/server";
import { Order, Producto } from "@/types";
import { getProductsServer } from "./products-server";
import { startOfDay, subDays, eachDayOfInterval, format, isWithinInterval } from "date-fns";

export async function getOrders() {
  const supabase = await createAdminClient();
  
  const { data, error } = await supabase
    .from("ordenes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  // Map database fields to Order interface
  return data.map((order: any) => ({
    id: order.id,
    items: order.items,
    total: order.total,
    status: order.status,
    mpPaymentId: order.mp_payment_id,
    payerEmail: order.payer_email,
    metodoEntrega: order.metodo_entrega,
    clienteNombre: order.cliente_nombre,
    clienteApellido: order.cliente_apellido,
    clienteTelefono: order.cliente_telefono,
    direccionEnvio: order.direccion_envio ? {
      ...order.direccion_envio,
      codigoPostal: order.direccion_envio.cp || order.direccion_envio.codigoPostal,
      ciudad: order.direccion_envio.localidad || order.direccion_envio.ciudad,
    } : undefined,
    shippingCost: order.shipping_cost,
    trackingNumber: order.nro_seguimiento,
    createdAt: new Date(order.created_at),
    updatedAt: order.updated_at ? new Date(order.updated_at) : undefined,
  })) as Order[];
}

export async function updateOrderStatus(orderId: string, status: Order["status"], trackingNumber?: string) {
  const supabase = await createAdminClient();
  
  const updateData: any = { 
    status, 
    updated_at: new Date().toISOString() 
  };

  if (trackingNumber !== undefined) {
    updateData.nro_seguimiento = trackingNumber;
  }

  const { error } = await supabase
    .from("ordenes")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    throw error;
  }

  return true;
}

export async function getOrderSummary() {
  const orders = await getOrders();
  
  const totalSales = orders
    .filter(o => o.status === "approved" || o.status === "shipped" || o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);
    
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "in_process").length;
  const approvedOrders = orders.filter(o => o.status === "approved").length;
  const shippedSales = orders
    .filter(o => o.metodoEntrega === "envio" && (o.status === "shipped" || o.status === "delivered"))
    .reduce((sum, o) => sum + o.total, 0);
  
  return {
    totalSales,
    totalOrders: orders.length,
    pendingOrders,
    approvedOrders,
    shippedSales
  };
}

export async function getDetailedStats(days: number = 30) {
  const orders = await getOrders();
  const products = await getProductsServer();
  
  const now = new Date();
  const startDate = startOfDay(subDays(now, days - 1));
  const endDate = now;

  const relevantOrders = orders.filter(o => 
    o.status !== "rejected" && 
    o.createdAt >= startDate && 
    o.createdAt <= endDate
  );

  const approvedOrders = relevantOrders.filter(o => 
    ["approved", "shipped", "delivered"].includes(o.status)
  );

  // 1. Revenue and ROI
  let totalRevenue = 0;
  let totalCost = 0;
  
  approvedOrders.forEach(order => {
    totalRevenue += order.total;
    order.items.forEach(item => {
      // Find product and variant cost
      const prod = products.find(p => p.id === item.id);
      const variant = prod?.variantes.find(v => v.ml === item.variante.ml);
      const cost = variant?.costo || 0;
      totalCost += cost * item.quantity;
    });
  });

  const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

  // 2. Sales Trend
  const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
  const salesTrend = daysInterval.map(day => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayOrders = approvedOrders.filter(o => 
      format(o.createdAt, "yyyy-MM-dd") === dayStr
    );
    const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      date: format(day, "dd/MM"),
      revenue
    };
  });

  // 3. Status Distribution
  const statusCounts = relevantOrders.reduce((acc: any, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // 4. Cart Abandonment
  const pendingCount = relevantOrders.filter(o => o.status === "pending" || o.status === "in_process").length;
  const totalAttempted = relevantOrders.length;
  const abandonmentRate = totalAttempted > 0 ? (pendingCount / totalAttempted) * 100 : 0;

  // 5. Product Depletion (Botella Madre)
  // Calculate ML sold for ALL orders (lifetime) for accurate depletion
  const lifetimeApprovedOrders = orders.filter(o => 
    ["approved", "shipped", "delivered"].includes(o.status)
  );

  const productMLSoldLiters: Record<string, number> = {};
  lifetimeApprovedOrders.forEach(order => {
    order.items.forEach(item => {
      productMLSoldLiters[item.id] = (productMLSoldLiters[item.id] || 0) + (item.variante.ml * item.quantity);
    });
  });

  const depletionAlerts = products
    .filter(p => p.mlTotalesBotella && p.mlTotalesBotella > 0)
    .map(p => {
      const mlSold = productMLSoldLiters[p.id] || 0;
      const percentage = (mlSold / (p.mlTotalesBotella || 1)) * 100;
      return {
        id: p.id,
        nombre: p.nombre,
        marca: p.marca,
        mlTotales: p.mlTotalesBotella,
        mlVendidos: mlSold,
        percentage: Math.min(percentage, 100)
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // 6. Top Products
  const productPerformance = products.map(p => {
    const soldCount = relevantOrders.reduce((sum, order) => {
      if (!["approved", "shipped", "delivered"].includes(order.status)) return sum;
      const item = order.items.find(i => i.id === p.id);
      return sum + (item?.quantity || 0);
    }, 0);

    const revenue = relevantOrders.reduce((sum, order) => {
      if (!["approved", "shipped", "delivered"].includes(order.status)) return sum;
      const item = order.items.find(i => i.id === p.id);
      return sum + ((item?.variante.precio || 0) * (item?.quantity || 0));
    }, 0);

    return {
      nombre: p.nombre,
      marca: p.marca,
      vendidos: soldCount,
      revenue
    };
  }).filter(p => p.vendidos > 0).sort((a, b) => b.revenue - a.revenue);

  return {
    kpis: {
      totalRevenue,
      totalOrders: relevantOrders.length,
      approvedOrders: approvedOrders.length,
      roi,
      abandonmentRate,
      aov: approvedOrders.length > 0 ? totalRevenue / approvedOrders.length : 0
    },
    salesTrend,
    statusData,
    depletionAlerts,
    topProducts: productPerformance.slice(0, 10)
  };
}
