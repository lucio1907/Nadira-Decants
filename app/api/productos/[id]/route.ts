import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { deleteFilesFromStorage } from "@/lib/supabase/storage";

export const PUT = async (request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    const data = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, variantes, ...productData } = data;

    // Backend validation
    if (!variantes || variantes.length === 0) {
      return NextResponse.json({ error: "El producto debe tener al menos una variante." }, { status: 400 });
    }

    const hasInvalidPrice = variantes.some((v: any) => Number(v.precio) <= 0);
    if (hasInvalidPrice) {
      return NextResponse.json({ error: "Todas las variantes deben tener un precio mayor a 0." }, { status: 400 });
    }

    const supabase = await createAdminClient();
    
    // Cleanup removed images
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

    // Revalidate paths to update the UI
    revalidateTag("productos", "max");
    revalidatePath("/", "page");
    revalidatePath("/admin/productos", "page");
    revalidatePath("/admin/productos");
    revalidatePath(`/admin/productos/${id}`, "page");
    revalidatePath(`/producto/${productData.slug}`, "page");

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
    
    // Get product images to delete from storage
    const { data: product } = await supabase
      .from("productos")
      .select("imagenes")
      .eq("id", id)
      .single();

    if (product?.imagenes && product.imagenes.length > 0) {
      await deleteFilesFromStorage(supabase, product.imagenes);
    }
    
    // Due to ON DELETE CASCADE on the variantes table, 
    // deleting the product automatically deletes the variants.
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);
      
    if (error) throw error;

    // Revalidate paths
    revalidateTag("productos", "max");
    revalidatePath("/", "page");
    revalidatePath("/admin/productos", "page");
    revalidatePath("/admin/productos");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
};
