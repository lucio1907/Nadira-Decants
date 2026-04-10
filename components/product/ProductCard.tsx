"use client";

import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { useRef, useState } from "react";
import { Mars, Venus, Users } from "lucide-react";

interface Props {
  producto: Producto;
  index?: number;
}

export const ProductCard = ({ producto, index = 0 }: Props) => {
  const lowestPrice = producto.variantes.length > 0
    ? Math.min(...producto.variantes.map((v) => v.precio))
    : 0;

  const totalStock = producto.variantes.reduce((acc, v) => acc + (v.stock || 0), 0);
  const isOutOfStock = totalStock === 0;
  
  const [isHovering, setIsHovering] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const GenderIcon = producto.genero === "Hombre" ? Mars : producto.genero === "Mujer" ? Venus : Users;

  return (
    <ScrollReveal delay={index * 0.1}>
      <Link href={`/producto/${producto.slug}`} className="block group h-full">
        <div
          ref={cardRef}
          className="flex flex-col h-full bg-transparent border border-transparent hover:border-[var(--border-visible)] hover:bg-white/[0.02] rounded-lg transition-all duration-500 ease-out"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
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
            {/* Subtle gradient background */}
            <div
              className="absolute inset-0 opacity-20 dark:opacity-10 transition-opacity duration-500 group-hover:opacity-40 dark:group-hover:opacity-20"
              style={{
                background: "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)"
              }}
            />

            {/* Status Badge (Corner) - Only for low stock, not for out of stock */}
            {!isOutOfStock && totalStock <= 5 && (
              <div 
                className="absolute bottom-16 right-4 z-30 py-1.5 px-3 rounded-sm text-[9px] tracking-[0.2em] uppercase font-bold animate-in fade-in zoom-in duration-700"
                style={{
                  background: "rgba(211, 176, 0, 0.12)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(211, 176, 0, 0.25)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-body)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* Status Dot */}
                <span 
                  className={`w-1.5 h-1.5 rounded-full ${totalStock === 1 ? "animate-pulse" : ""}`}
                  style={{ 
                    background: "var(--accent)",
                    boxShadow: "0 0 6px var(--accent)",
                  }}
                />
                
                {totalStock === 1 ? "¡Última unidad!" : "¡Últimas unidades!"}
              </div>
            )}

            {/* Out of Stock Ribbon */}
            {isOutOfStock && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
                <div 
                  className="w-[140%] bg-[var(--error)]/90 backdrop-blur-md text-white text-[11px] py-1.5 text-center font-bold uppercase tracking-[0.3em] rotate-[-15deg] scale-110 shadow-2xl border-y border-white/10"
                  style={{
                    fontFamily: "var(--font-body)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                  }}
                >
                  AGOTADO
                </div>
              </div>
            )}

            {/* Marca & Gender label */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
              <span
                className="tracking-[0.2em] uppercase text-[10px] whitespace-nowrap opacity-60"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--text-primary)",
                }}
              >
                {producto.marca}
              </span>
              {producto.genero && (
                <div 
                  className="flex items-center gap-1.5 opacity-90 scale-95 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                  style={{ color: "var(--accent)" }}
                >
                  <GenderIcon size={9} strokeWidth={2.5} />
                  <span className="tracking-[0.15em] uppercase text-[9px] font-bold">
                    {producto.genero}
                  </span>
                </div>
              )}
            </div>

            {/* Product Image with parallax */}
            <div 
              className={`relative z-10 flex items-center justify-center w-full h-full p-8 ${isOutOfStock ? "grayscale opacity-40" : ""}`}
            >
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
                  priority={index < 4}
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

            {/* ML badges */}
            <div className="absolute bottom-5 left-0 w-full flex justify-center gap-3 z-10">
              {producto.variantes.slice(0, 3).map((v) => (
                <span key={v.ml} className="text-[10px] tracking-wider text-center" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  {v.ml}ML
                </span>
              ))}
            </div>
          </div>

          {/* Golden separator — expands on hover */}
          <div className="relative h-[1px] w-full overflow-hidden">
            <div
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                transform: isHovering ? "scaleX(1)" : "scaleX(0)",
                opacity: isHovering ? 0.6 : 0,
              }}
            />
          </div>

          {/* Info */}
          <div className="pt-6 flex flex-col flex-1 text-center">
            {/* Name — now serif font via CSS */}
            <h3
              className="text-[22px] mb-2 transition-colors duration-300 group-hover:text-[var(--accent)]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: isOutOfStock ? "var(--text-disabled)" : "var(--text-display)",
              }}
            >
              {producto.nombre}
            </h3>

            {/* Description */}
            <p
              className="line-clamp-2 text-nd-body-sm mb-6 flex-1 mx-auto max-w-[240px]"
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
                  color: isOutOfStock ? "var(--text-disabled)" : "var(--text-display)",
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
                  {isOutOfStock ? "Sin stock" : `desde ${producto.variantes[0].ml}ml`}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
};
