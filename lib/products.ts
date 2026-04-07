import { Producto } from "@/types";

export const getProducts = async (): Promise<Producto[]> => {
  // If on server, call the direct function to avoid fetch issues during build
  if (typeof window === 'undefined') {
    const { getProductsServer } = await import("./products-server");
    return getProductsServer();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const res = await fetch(`${baseUrl}/api/productos`, {
    next: { tags: ["productos"] },
  });

  if (!res.ok) {
    console.error("Error fetching products:", res.statusText);
    return [];
  }

  return res.json();
};

export const getProductBySlug = async (
  slug: string
): Promise<Producto | undefined> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
};
