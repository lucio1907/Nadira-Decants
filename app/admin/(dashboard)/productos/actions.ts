"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { deleteFilesFromStorage } from "@/lib/supabase/storage";
import { Producto, Variante } from "@/types";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Creates or updates a product and its variants.
 * Next.js 15 Server Action.
 */
export const upsertProductAction = async (
  payload: Partial<Producto> & { id?: string; variants?: Variante[] }
): Promise<ActionResponse<string>> => {
  try {
    const supabase = await createAdminClient();
    const { id, variantes, ...productData } = payload as any;

    if (!variantes || variantes.length === 0) {
      return { success: false, error: "El producto debe tener al menos una variante." };
    }

    const hasInvalidPrice = variantes.some((v: Variante) => Number(v.precio) <= 0);
    if (hasInvalidPrice) {
      return { success: false, error: "Todas las variantes deben tener un precio mayor a 0." };
    }

    // 1. Cleanup removed images if editing
    if (id) {
      const { data: currentProduct } = await supabase
        .from("productos")
        .select("imagenes")
        .eq("id", id)
        .single();

      if (currentProduct?.imagenes) {
        const removedImages = currentProduct.imagenes.filter(
          (img: string) => !productData.imagenes.includes(img)
        );
        if (removedImages.length > 0) {
          await deleteFilesFromStorage(supabase, removedImages);
        }
      }
    }

    // 2. Upsert Product
    const dbProduct = {
      slug: productData.slug,
      nombre: productData.nombre,
      marca: productData.marca,
      descripcion: productData.descripcion,
      notas: productData.notas,
      imagenes: productData.imagenes,
      ml_totales_botella: productData.mlTotalesBotella,
      genero: productData.genero
    };

    let productId = id;

    if (id) {
      const { error: updateError } = await supabase
        .from("productos")
        .update(dbProduct)
        .eq("id", id);
      
      if (updateError) throw updateError;
    } else {
      const { data: newProduct, error: insertError } = await supabase
        .from("productos")
        .insert([dbProduct])
        .select("id")
        .single();
      
      if (insertError) throw insertError;
      productId = newProduct.id;
    }

    // 3. Handle Variants (Delete and re-insert for simplicity/consistency)
    const { error: deleteVariantesError } = await supabase
      .from("variantes")
      .delete()
      .eq("producto_id", productId);
      
    if (deleteVariantesError) throw deleteVariantesError;

    const variantesToInsert = variantes.map((v: Variante) => ({
      producto_id: productId,
      ml: Number(v.ml),
      precio: Number(v.precio),
      stock: Number(v.stock) || 0,
      costo: Number(v.costo) || 0,
      peso_g: Number(v.peso_g) || 100,
      largo_cm: Number(v.largo_cm) || 10,
      ancho_cm: Number(v.ancho_cm) || 10,
      alto_cm: Number(v.alto_cm) || 5
    }));

    const { error: insertVariantesError } = await supabase
      .from("variantes")
      .insert(variantesToInsert);

    if (insertVariantesError) throw insertVariantesError;

    // 4. Revalidate
    revalidateTag("productos", { expire: 0 });
    revalidatePath("/", "layout");
    revalidatePath("/admin/productos", "page");
    if (productData.slug) {
      revalidatePath(`/producto/${productData.slug}`, "page");
    }

    return { success: true, data: productId };
  } catch (error: any) {
    console.error("Error in upsertProductAction:", error);
    return { success: false, error: error.message || "Failed to save product" };
  }
};

/**
 * Deletes a product and its related variants/images.
 */
export const deleteProductAction = async (id: string): Promise<ActionResponse> => {
  try {
    const supabase = await createAdminClient();
    
    // Get images and slug for cleanup/revalidation
    const { data: product } = await supabase
      .from("productos")
      .select("imagenes, slug")
      .eq("id", id)
      .single();

    if (product?.imagenes && product.imagenes.length > 0) {
      await deleteFilesFromStorage(supabase, product.imagenes);
    }
    
    // Delete product (variants will cascade if configured in DB)
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);
      
    if (error) throw error;

    revalidateTag("productos", { expire: 0 });
    revalidatePath("/", "layout");
    revalidatePath("/admin/productos", "page");
    if (product?.slug) {
      revalidatePath(`/producto/${product.slug}`, "page");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteProductAction:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
};
