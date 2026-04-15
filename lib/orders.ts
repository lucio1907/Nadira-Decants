import { createAdminClient } from "./supabase/server";
import { Order } from "@/types";
import { Database } from "@/types/database";
import { getProductsServer } from "./products-server";
import { startOfDay, subDays, eachDayOfInterval, format } from "date-fns";
import { sendOrderConfirmationEmail } from "./resend";

type DBOrder = Database["public"]["Tables"]["ordenes"]["Row"];

export const mapOrder = (order: DBOrder): Order => ({
  id: order.id,
  items: order.items as any, // Typed in Order interface
  total: order.total,
  status: order.status as Order["status"],
  mpPaymentId: order.mp_payment_id || undefined,
  payerEmail: order.payer_email || undefined,
  metodoEntrega: (order.metodo_entrega as Order["metodoEntrega"]) || undefined,
  clienteNombre: order.cliente_nombre || undefined,
  clienteApellido: order.cliente_apellido || undefined,
  clienteTelefono: order.cliente_telefono || undefined,
  direccionEnvio: order.direccion_envio ? {
    ...(order.direccion_envio as any),
    codigoPostal: (order.direccion_envio as any).cp || (order.direccion_envio as any).codigoPostal,
    ciudad: (order.direccion_envio as any).localidad || (order.direccion_envio as any).ciudad,
  } : undefined,
  shippingCost: order.shipping_cost || undefined,
  trackingNumber: order.nro_seguimiento || undefined,
  cupon_id: order.cupon_id || undefined,
  descuento: order.descuento || undefined,
  createdAt: new Date(order.created_at),
  updatedAt: order.updated_at ? new Date(order.updated_at) : undefined,
});

/**
 * Fetches all orders from Supabase.
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from("ordenes")
      .select(`
        id, items, total, status, mp_payment_id, payer_email, metodo_entrega,
        cliente_nombre, cliente_apellido, cliente_telefono, direccion_envio,
        shipping_cost, nro_seguimiento, cupon_id, descuento, created_at, updated_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return (data as DBOrder[]).map(mapOrder);
  } catch (error) {
    console.error("Error in getOrders:", error);
    return [];
  }
}

/**
 * Updates an order status and optionally the tracking number.
 * Note: Prefer using individual Server Actions for this in the UI.
 */
export async function updateOrderStatus(orderId: string, status: Order["status"], trackingNumber?: string) {
  const supabase = await createAdminClient();
  
  // Fetch current order to check previous status
  const { data: currentOrder } = await supabase
    .from("ordenes")
    .select("status, items, cupon_id")
    .eq("id", orderId)
    .single();

  const updateData: Database["public"]["Tables"]["ordenes"]["Update"] = { 
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

  // Handle stock and coupon logic when approving an order manually
  if (currentOrder && status === "approved" && 
      !["approved", "shipped", "delivered"].includes(currentOrder.status)) {
    
    // 1. Update stock for each variant
    if (currentOrder.items) {
      for (const item of (currentOrder.items as any[])) {
         const { data: varianteData } = await supabase
           .from("variantes")
           .select("id, stock")
           .eq("producto_id", item.id)
           .eq("ml", item.variante.ml)
           .single();

         if (varianteData) {
           const currentStock = varianteData.stock || 0;
           await supabase
             .from("variantes")
             .update({ stock: Math.max(0, currentStock - item.quantity) })
             .eq("id", varianteData.id);
         }
      }
    }

    // 2. Increment coupon usage if exists
    if (currentOrder.cupon_id) {
      const { data: currentCoupon } = await supabase
        .from("cupones")
        .select("usos_actuales")
        .eq("id", currentOrder.cupon_id)
        .single();
      
      if (currentCoupon) {
        await supabase
          .from("cupones")
          .update({ usos_actuales: (currentCoupon.usos_actuales || 0) + 1 })
          .eq("id", currentOrder.cupon_id);
      }
    }

    // 3. Send confirmation email
    // We do this asynchronously so we don't block the UI/Response
    sendOrderConfirmationEmail(orderId).catch(err => console.error("Async email error:", err));


  }

  return true;
}

/**
 * Generates a summary of orders for basic display.
 */
export async function getOrderSummary() {
  const orders = await getOrders();
  
  const totalSales = orders
    .filter(o => ["approved", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
    
  const pendingOrders = orders.filter(o => ["pending", "in_process"].includes(o.status)).length;
  const approvedOrders = orders.filter(o => o.status === "approved").length;
  const shippedSales = orders
    .filter(o => o.metodoEntrega === "envio" && ["shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
  
  return {
    totalSales,
    totalOrders: orders.length,
    pendingOrders,
    approvedOrders,
    shippedSales
  };
}

/**
 * Generates detailed statistics for the dashboard.
 */
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
  const statusCounts = relevantOrders.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // 4. Cart Abandonment
  const pendingCount = relevantOrders.filter(o => ["pending", "in_process"].includes(o.status)).length;
  const totalAttempted = relevantOrders.length;
  const abandonmentRate = totalAttempted > 0 ? (pendingCount / totalAttempted) * 100 : 0;

  // 5. Product Depletion (Botella Madre)
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
