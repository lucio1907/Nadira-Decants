import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://nadiradecants.com.ar";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/producto/"],
        disallow: [
          "/admin/",
          "/api/",
          "/checkout/",
          "/checkout/status/",
          "/carrito/",
          "/carrito",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "Anthropic-AI",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
        ],
        allow: ["/", "/producto/", "/llms.txt"],
        disallow: ["/admin/", "/api/", "/checkout/", "/carrito/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
