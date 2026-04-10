import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { Producto, NotasOlfativas } from "@/types";
import { Database } from "@/types/database";

type DBProducto = Database['public']['Tables']['productos']['Row'] & {
  variantes: Database['public']['Tables']['variantes']['Row'][]
}

const mapProduct = (prod: DBProducto): Producto => ({
  id: prod.id,
  slug: prod.slug,
  nombre: prod.nombre,
  marca: prod.marca,
  descripcion: prod.descripcion,
  notas: (prod.notas as unknown as NotasOlfativas) || { salida: [], corazon: [], fondo: [] },
  imagenes: prod.imagenes || [],
  mlTotalesBotella: prod.ml_totales_botella,
  genero: prod.genero as any,
  variantes: (prod.variantes || [])
    .sort((a, b) => a.ml - b.ml)
    .map((v) => ({
      ml: v.ml,
      precio: Number(v.precio),
      stock: v.stock,
      costo: v.costo ? Number(v.costo) : undefined
    }))
});

/**
 * Fetches all products from the database.
 * Optimized select and strictly typed.
 */
export const getProductsServer = unstable_cache(
  async (): Promise<Producto[]> => {
    try {
      const supabase = await createAdminClient();
      
      const { data, error } = await supabase
        .from("productos")
        .select(`
          id, slug, nombre, marca, descripcion, notas, imagenes, ml_totales_botella, genero,
          variantes (ml, precio, stock, costo)
        `)
        .order('nombre');

      if (error) {
        console.error("Supabase error fetching products:", error);
        return [];
      }

      return (data as unknown as DBProducto[]).map(mapProduct);
    } catch (error) {
      console.error("Error in getProductsServer:", error);
      return [];
    }
  },
  ["productos-list"],
  {
    tags: ["productos"],
  }
);

/**
 * Fetches a single product by its ID.
 */
export const getProductByIdServer = async (id: string): Promise<Producto | null> => {
  try {
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from("productos")
      .select(`
        id, slug, nombre, marca, descripcion, notas, imagenes, ml_totales_botella, genero,
        variantes (ml, precio, stock, costo)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      if (error && error.code !== 'PGRST116') {
        console.error("Supabase error fetching product by ID:", error);
      }
      return null;
    }

    return mapProduct(data as unknown as DBProducto);
  } catch (error) {
    console.error("Error in getProductByIdServer:", error);
    return null;
  }
};

/**
 * Fetches a single product by its slug.
 */
export const getProductBySlugServer = async (slug: string): Promise<Producto | null> => {
  try {
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from("productos")
      .select(`
        id, slug, nombre, marca, descripcion, notas, imagenes, ml_totales_botella, genero,
        variantes (ml, precio, stock, costo)
      `)
      .eq("slug", slug)
      .single();

    if (error || !data) {
      if (error && error.code !== 'PGRST116') {
        console.error("Supabase error fetching product by slug:", error);
      }
      return null;
    }

    return mapProduct(data as unknown as DBProducto);
  } catch (error) {
    console.error("Error in getProductBySlugServer:", error);
    return null;
  }
};

