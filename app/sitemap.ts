import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nadiradecants.com.ar";

  const productos = await getProducts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2026-05-18"),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const productPages: MetadataRoute.Sitemap = productos.map((producto) => ({
    url: `${baseUrl}/producto/${producto.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
