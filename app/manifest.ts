import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nadira — Decants de Perfumes de Lujo",
    short_name: "Nadira Decants",
    description:
      "Descubrí las fragancias más exclusivas del mundo en formato decant. Perfumes originales en envases de 5ml para probar antes de comprometerte con el frasco completo.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#d3b000",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle"],
    lang: "es-AR",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
