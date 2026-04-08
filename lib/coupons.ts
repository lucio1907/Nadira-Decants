import { createAdminClient } from "./supabase/server";
import { Coupon } from "@/types";

export async function getCoupons() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("cupones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }

  return data as Coupon[];
}

export async function validateCoupon(code: string, subtotal: number) {
  const supabase = await createAdminClient();
  
  // Buscar cupón activo por código (case insensitive)
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
  
  // Verificar expiración
  if (coupon.expiracion && new Date(coupon.expiracion) < now) {
    return { valid: false, message: "El cupón ha expirado" };
  }

  // Verificar usos máximos
  if (coupon.usos_maximos && coupon.usos_actuales >= coupon.usos_maximos) {
    return { valid: false, message: "El cupón ha agotado su límite de usos" };
  }

  // Verificar monto mínimo
  if (coupon.minimo_compra && subtotal < coupon.minimo_compra) {
    return { 
      valid: false, 
      message: `Este cupón requiere una compra mínima de $${coupon.minimo_compra.toLocaleString("es-AR")}` 
    };
  }

  // Calcular descuento
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
}

export async function saveCoupon(coupon: Partial<Coupon>) {
  const supabase = await createAdminClient();
  
  if (coupon.id) {
    const { data, error } = await supabase
      .from("cupones")
      .update(coupon)
      .eq("id", coupon.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("cupones")
      .insert(coupon)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function deleteCoupon(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("cupones").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function incrementCouponUsage(id: string) {
  const supabase = await createAdminClient();
  
  // Usar rpc o update simple si no hay concurrencia pesada
  // Para evitar rpc complejas, haremos un update relativo
  const { data: current } = await supabase.from("cupones").select("usos_actuales").eq("id", id).single();
  
  if (current) {
    await supabase
      .from("cupones")
      .update({ usos_actuales: (current.usos_actuales || 0) + 1 })
      .eq("id", id);
  }
}
