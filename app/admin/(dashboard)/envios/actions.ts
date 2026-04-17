"use server";

import { updateShippingConfig, ShippingConfig, ShippingBox, upsertShippingBox, deleteShippingBox } from "@/lib/shipping-config";
import { revalidatePath } from "next/cache";

export async function updateShippingConfigAction(config: Partial<ShippingConfig>) {
  try {
    await updateShippingConfig(config);
    revalidatePath("/admin/envios");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating shipping config:", error);
    return { success: false, error: error.message };
  }
}

export async function upsertShippingBoxAction(box: Partial<ShippingBox>) {
  try {
    await upsertShippingBox(box);
    revalidatePath("/admin/envios");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving shipping box:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteShippingBoxAction(id: string) {
  try {
    await deleteShippingBox(id);
    revalidatePath("/admin/envios");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting shipping box:", error);
    return { success: false, error: error.message };
  }
}
