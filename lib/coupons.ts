import { createAdminClient } from "./supabase/server";
import { Coupon } from "@/types";
import { Database } from "@/types/database";

type DBCoupon = Database["public"]["Tables"]["cupones"]["Row"];

/**
 * Fetches all coupons from the database.
 */
export async function getCoupons(): Promise<Coupon[]> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("cupones")
      .select(`
        id, codigo, valor, tipo, activo, expiracion, 
        minimo_compra, usos_maximos, usos_actuales, created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching coupons:", error);
      return [];
    }

    return data as Coupon[];
  } catch (error) {
    console.error("Error in getCoupons:", error);
    return [];
  }
}

/**
 * Validates a coupon code against a subtotal.
 */
export async function validateCoupon(code: string, subtotal: number) {
  try {
    const supabase = await createAdminClient();
    
    const { data: coupon, error } = await supabase
      .from("cupones")
      .select("*")
      .ilike("codigo", code)
      .eq("activo", true)
      .single();

    if (error || !coupon) {
      return { valid: false, message: "El cupón no existe o no es válido" };
    }

    const now = new Date();
    
    if (coupon.expiracion && new Date(coupon.expiracion) < now) {
      return { valid: false, message: "El cupón ha expirado" };
    }

    if (coupon.usos_maximos && coupon.usos_actuales >= coupon.usos_maximos) {
      return { valid: false, message: "El cupón ha agotado su límite de usos" };
    }

    if (coupon.minimo_compra && subtotal < coupon.minimo_compra) {
      return { 
        valid: false, 
        message: `Este cupón requiere una compra mínima de $${coupon.minimo_compra.toLocaleString("es-AR")}` 
      };
    }

    let discount = 0;
    if (coupon.tipo === "porcentaje") {
      discount = Math.round((subtotal * coupon.valor) / 100);
    } else {
      discount = coupon.valor;
    }

    return { 
      valid: true, 
      coupon: coupon as Coupon,
      discount
    };
  } catch (error) {
    console.error("Error in validateCoupon:", error);
    return { valid: false, message: "Error al validar el cupón" };
  }
}

/**
 * Saves or updates a coupon.
 */
export async function saveCoupon(coupon: Partial<Coupon>) {
  const supabase = await createAdminClient();
  
  const { created_at, ...cleanCoupon } = coupon;
  
  const couponData: Database["public"]["Tables"]["cupones"]["Update"] = {
    ...cleanCoupon,
    expiracion: cleanCoupon.expiracion ? (new Date(cleanCoupon.expiracion)).toISOString() : null,
    minimo_compra: cleanCoupon.minimo_compra || null,
    usos_maximos: cleanCoupon.usos_maximos || null,
  };

  if (coupon.id) {
    const { data, error } = await supabase
      .from("cupones")
      .update(couponData)
      .eq("id", coupon.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("cupones")
      .insert(couponData as Database["public"]["Tables"]["cupones"]["Insert"])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

/**
 * Deletes a coupon by ID.
 */
export async function deleteCoupon(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("cupones").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/**
 * Increments the usage count of a coupon.
 */
export async function incrementCouponUsage(id: string) {
  const supabase = await createAdminClient();
  
  // Using direct update for simplicity, assuming low concurrency for individual coupons
  const { data: current } = await supabase
    .from("cupones")
    .select("usos_actuales")
    .eq("id", id)
    .single();
  
  if (current) {
    await supabase
      .from("cupones")
      .update({ usos_actuales: (current.usos_actuales || 0) + 1 } as any)
      .eq("id", id);
  }
}
