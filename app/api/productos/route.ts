/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

import { getProductsServer } from "@/lib/products-server";

export const GET = async () => {
  const products = await getProductsServer();
  return NextResponse.json(products);
};

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const { id, variantes, ...productData } = data; // remove id if sent

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createAdminClient();
      
      const { data: newProduct, error: productError } = await supabase
        .from("productos")
        .insert([
          {
            slug: productData.slug,
            nombre: productData.nombre,
            marca: productData.marca,
            descripcion: productData.descripcion,
            notas: productData.notas,
            imagenes: productData.imagenes
          }
        ])
        .select()
        .single();
      
      if (productError) {
        throw productError;
      }

      if (variantes && variantes.length > 0) {
        const variantesToInsert = variantes.map((v: any) => ({
          producto_id: newProduct.id,
          ml: v.ml,
          precio: v.precio,
          stock: v.stock || 0
        }));

        const { error: variantesError } = await supabase
          .from("variantes")
          .insert(variantesToInsert);

        if (variantesError) {
          throw variantesError;
        }
      }

      return NextResponse.json({ id: newProduct.id, ...data });
    }

    return NextResponse.json({ id: Date.now().toString(), ...data });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
};
