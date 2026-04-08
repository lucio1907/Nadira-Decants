"use server";

import { revalidatePath } from "next/cache";
import { saveCoupon, deleteCoupon } from "@/lib/coupons";
import { Coupon } from "@/types";

export async function saveCouponAction(coupon: Partial<Coupon>) {
  try {
    await saveCoupon(coupon);
    revalidatePath("/admin/cupones");
    return { success: true };
  } catch (error: any) {
    console.error("Error in saveCouponAction:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    await deleteCoupon(id);
    revalidatePath("/admin/cupones");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteCouponAction:", error);
    return { success: false, error: error.message };
  }
}
