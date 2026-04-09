import { Producto } from "@/types";
import { getProductsServer, getProductBySlugServer } from "./products-server";

/**
 * Fetches all products. 
 * Proxies to getProductsServer which is cache-wrapped.
 */
export const getProducts = async (): Promise<Producto[]> => {
  return getProductsServer();
};

/**
 * Fetches a single product by slug.
 * Proxies to getProductBySlugServer for optimized lookup.
 */
export const getProductBySlug = async (
  slug: string
): Promise<Producto | null> => {
  return getProductBySlugServer(slug);
};
