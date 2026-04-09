"use server";

import { Coupon } from "@/types";
import { saveCoupon, deleteCoupon, validateCoupon } from "@/lib/coupons";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Server Action to create or update a coupon.
 */
export async function upsertCouponAction(coupon: Partial<Coupon>) {
  try {
    const result = await saveCoupon(coupon);
    
    revalidatePath("/admin/cupones", "page");
    revalidateTag("cupones", "max");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in upsertCouponAction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al guardar el cupón" 
    };
  }
}

/**
 * Server Action to delete a coupon.
 */
export async function deleteCouponAction(id: string) {
  try {
    await deleteCoupon(id);
    
    revalidatePath("/admin/cupones", "page");
    revalidateTag("cupones", "max");
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteCouponAction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al eliminar el cupón" 
    };
  }
}

/**
 * Server Action to validate a coupon for the checkout flow.
 */
export async function validateCouponAction(code: string, subtotal: number) {
  try {
    return await validateCoupon(code, subtotal);
  } catch (error) {
    console.error("Error in validateCouponAction:", error);
    return { valid: false, message: "Error al validar el cupón" };
  }
}
