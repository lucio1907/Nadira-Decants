import { createAdminClient } from "./supabase/server";
import { Order } from "@/types";

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
