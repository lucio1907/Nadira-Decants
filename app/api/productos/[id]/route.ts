/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const PUT = async (request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    const data = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, variantes, ...productData } = data;

    const supabase = await createAdminClient();
    
    const { error: updateError } = await supabase
      .from("productos")
      .update({
        slug: productData.slug,
        nombre: productData.nombre,
        marca: productData.marca,
        descripcion: productData.descripcion,
        notas: productData.notas,
        imagenes: productData.imagenes,
        ml_totales_botella: productData.mlTotalesBotella
      })
      .eq("id", id);
      
    if (updateError) throw updateError;

    // Delete existing variants
    const { error: deleteVariantesError } = await supabase
      .from("variantes")
      .delete()
      .eq("producto_id", id);
      
    if (deleteVariantesError) throw deleteVariantesError;

    // Insert new variants
    if (variantes && variantes.length > 0) {
      const variantesToInsert = variantes.map((v: any) => ({
        producto_id: id,
        ml: v.ml,
        precio: v.precio,
        stock: v.stock || 0,
        costo: v.costo || 0
      }));

      const { error: insertVariantesError } = await supabase
        .from("variantes")
        .insert(variantesToInsert);

      if (insertVariantesError) throw insertVariantesError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
};

export const DELETE = async (request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    
    const supabase = await createAdminClient();
    
    // Due to ON DELETE CASCADE on the variantes table, 
    // deleting the product automatically deletes the variants.
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);
      
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
};
