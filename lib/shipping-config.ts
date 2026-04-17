import { createAdminClient } from "@/lib/supabase/server";

export interface ShippingConfig {
  id?: string;
  decant_weight_g: number;
  packaging_base_weight_g: number;
  updated_at?: string;
}

export interface ShippingBox {
  id?: string;
  nombre: string;
  largo_cm: number;
  ancho_cm: number;
  alto_cm: number;
  max_items: number;
  peso_base_g: number;
  created_at?: string;
}

export async function getShippingConfig(): Promise<ShippingConfig> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("shipping_config")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching shipping config:", error);
    return {
      decant_weight_g: 12,
      packaging_base_weight_g: 130,
    };
  }

  return data;
}

export async function updateShippingConfig(config: Partial<ShippingConfig>) {
  const supabase = await createAdminClient();
  const { data: existing } = await supabase.from("shipping_config").select("id").limit(1).single();
  
  if (!existing) {
     const { data, error } = await supabase
      .from("shipping_config")
      .insert([config])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("shipping_config")
    .update({ 
      ...config,
      updated_at: new Date().toISOString()
    })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getShippingBoxes(): Promise<ShippingBox[]> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("shipping_boxes")
    .select("*")
    .order("max_items", { ascending: true });

  if (error) {
    console.error("Error fetching shipping boxes:", error);
    return [];
  }
  return data;
}

export async function upsertShippingBox(box: Partial<ShippingBox>) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("shipping_boxes")
    .upsert([box], { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShippingBox(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("shipping_boxes")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
