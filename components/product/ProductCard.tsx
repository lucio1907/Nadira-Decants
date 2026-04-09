"use client";

import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types";
import { ScrollReveal } from "@/hooks/useScrollAnimation";

interface Props {
  producto: Producto;
  index?: number;
}

export const ProductCard = ({ producto, index = 0 }: Props) => {
  const lowestPrice = producto.variantes.length > 0
    ? Math.min(...producto.variantes.map((v) => v.precio))
    : 0;

  return (
    <ScrollReveal delay={index * 0.1}>
      <Link href={`/producto/${producto.slug}`} className="block group h-full">
        <div
          className="flex flex-col h-full bg-transparent transition-all duration-500 hover:-translate-y-1"
        >
          {/* Image area */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "3 / 4",
              background: "var(--surface-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border)",
            }}
          >
            {/* Beautiful subtle gradient background layer inside */}
            <div
              className="absolute inset-0 opacity-20 dark:opacity-10 transition-opacity duration-500 group-hover:opacity-40 dark:group-hover:opacity-20"
              style={{
                background: "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)"
              }}
            />

            {/* Marca label — subtle sideways text or top center? Top center is elegant. */}
            <span
              className="absolute top-6 left-1/2 -translate-x-1/2 z-10 tracking-[0.2em] uppercase text-[10px]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-disabled)",
              }}
            >
              {producto.marca}
            </span>

            {/* Product Image or Premium Bottle Silhouette fallback */}
            <div className="relative z-10 transition-transform duration-700 ease-in-out group-hover:scale-105 flex items-center justify-center w-full h-full p-8">
              {producto.imagenes && producto.imagenes.length > 0 ? (
                <Image
                  src={producto.imagenes[0]}
                  alt={producto.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  quality={90}
                  className="object-contain drop-shadow-2xl p-8"
                  style={{
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
                  }}
                  priority={index < 4} // Priority for the first few items for better LCP
                />
              ) : (
                <svg width="40" height="90" viewBox="0 0 40 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Cap */}
                  <rect x="14" y="2" width="12" height="14" rx="1" fill="var(--accent)" fillOpacity="0.8" />
                  <rect x="12" y="16" width="16" height="4" rx="1" fill="var(--accent)" />
                  {/* Bottle Body */}
                  <rect x="6" y="24" width="28" height="64" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" fill="var(--surface)" />
                  {/* Liquid Level */}
                  <rect x="8" y="44" width="24" height="42" rx="2" fill="var(--accent)" fillOpacity="0.1" />
                  {/* Label */}
                  <rect x="12" y="52" width="16" height="20" rx="1" fill="currentColor" fillOpacity="0.05" />
                </svg>
              )}
            </div>

            {/* Badges - subtle text at the bottom */}
            <div className="absolute bottom-5 left-0 w-full flex justify-center gap-3 z-10">
              {producto.variantes.slice(0, 3).map((v) => (
                <span key={v.ml} className="text-[10px] tracking-wider text-center" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  {v.ml}ML
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pt-6 flex flex-col flex-1 text-center">
            {/* Name */}
            <h3
              className="text-[18px] mb-2 transition-colors duration-300 group-hover:text-[var(--accent)]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: "var(--text-display)",
              }}
            >
              {producto.nombre}
            </h3>

            {/* Description */}
            <p
              className="line-clamp-2 text-[13px] mb-6 flex-1 mx-auto max-w-[240px]"
              style={{
                fontFamily: "var(--font-body)",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
              }}
            >
              {producto.descripcion}
            </p>

            {/* Price */}
            <div className="flex flex-col items-center justify-center pt-4 border-t border-[var(--border)] border-opacity-50">
              <span
                className="text-[15px] font-medium"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--text-display)",
                }}
              >
                ${lowestPrice.toLocaleString("es-AR")}
              </span>
              {producto.variantes.length > 0 && (
                <span
                  className="text-[10px] uppercase tracking-widest mt-1 opacity-60"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-secondary)",
                  }}
                >
                  desde {producto.variantes[0].ml}ml
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
};
