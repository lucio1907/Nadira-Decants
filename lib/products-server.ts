import { createAdminClient } from "@/lib/supabase/server";
import { Producto } from "@/types";

export async function getProductsServer(): Promise<Producto[]> {
  try {
    const supabase = await createAdminClient();
    
    const { data: productosData, error } = await supabase
      .from("productos")
      .select(`
        *,
        variantes (*)
      `);

    if (error) {
      console.error("Supabase error fetching products:", error);
      return [];
    }

    // Format response to match the expected Producto interface
    return productosData.map((prod: any) => ({
      id: prod.id,
      slug: prod.slug,
      nombre: prod.nombre,
      marca: prod.marca,
      descripcion: prod.descripcion,
      notas: prod.notas || { salida: [], corazon: [], fondo: [] },
      imagenes: prod.imagenes || [],
      mlTotalesBotella: prod.ml_totales_botella,
      variantes: (prod.variantes || []).sort((a: any, b: any) => a.ml - b.ml).map((v: any) => ({
        ml: v.ml,
        precio: Number(v.precio),
        stock: v.stock,
        costo: v.costo ? Number(v.costo) : undefined
      }))
    }));
  } catch (error) {
    console.error("Error in getProductsServer:", error);
    return [];
  }
}
