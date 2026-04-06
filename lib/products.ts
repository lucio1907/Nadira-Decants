import { Producto } from "@/types";
import { mockProductos } from "./mock-data";

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export const getProducts = async (): Promise<Producto[]> => {
  if (USE_MOCK) {
    return mockProductos;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/productos`, {
    next: { tags: ["productos"] },
  });

  if (!res.ok) {
    console.error("Error fetching products:", res.statusText);
    return mockProductos;
  }

  return res.json();
};

export const getProductBySlug = async (
  slug: string
): Promise<Producto | undefined> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
};
