"use server";

import { Order } from "@/types";
import { updateOrderStatus } from "@/lib/orders";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Server Action to update an order status and revalidate.
 */
export async function updateOrderAction(
  orderId: string, 
  status: Order["status"], 
  trackingNumber?: string
) {
  try {
    await updateOrderStatus(orderId, status, trackingNumber);
    
    // Revalidate relevant paths and tags
    revalidatePath("/admin/ordenes", "page");
    revalidatePath("/admin/estadisticas", "page");
    revalidateTag("ordenes", { expire: 0 });
    revalidateTag("productos", { expire: 0 });
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateOrderAction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al actualizar la orden" 
    };
  }
}
