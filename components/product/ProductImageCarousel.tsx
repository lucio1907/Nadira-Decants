"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  imagenes: string[];
  nombre: string;
}

export const ProductImageCarousel = ({ imagenes, nombre }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fallback for empty images
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 opacity-30 h-full">
        <svg width="60" height="135" viewBox="0 0 40 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="2" width="12" height="14" rx="1" fill="var(--accent)" fillOpacity="0.8" />
          <rect x="12" y="16" width="16" height="4" rx="1" fill="var(--accent)" />
          <rect x="6" y="24" width="28" height="64" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" fill="transparent" />
        </svg>
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--text-disabled)" }}>Sin Imagen</span>
      </div>
    );
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollPosition / width);
    if (index !== activeIndex && index >= 0 && index < imagenes.length) {
      setActiveIndex(index);
    }
  };

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
  }, []);

  const next = () => {
    const nextIndex = (activeIndex + 1) % imagenes.length;
    scrollTo(nextIndex);
  };

  const prev = () => {
    const prevIndex = (activeIndex - 1 + imagenes.length) % imagenes.length;
    scrollTo(prevIndex);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <div 
      className="relative w-full h-full group flex flex-col touch-pan-y"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Galería de imágenes de ${nombre}`}
    >
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full flex-1 overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {imagenes.filter(Boolean).map((src, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-full h-full snap-start flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`${nombre} - Imagen ${idx + 1} de ${imagenes.length}`}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                quality={95}
                className="aspect-[3/4] object-cover transition-transform duration-700 ease-in-out"
                priority={idx === 0}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows — more refined, appear on hover */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
            }}
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
            }}
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </>
      )}

      {/* Bottom bar: indicators + counter */}
      {imagenes.length > 1 && (
        <div className="flex items-center justify-center gap-4 py-4" style={{ background: "transparent" }}>
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {imagenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className="group/dot p-1"
                aria-label={`Ir a imagen ${idx + 1}`}
              >
                <div 
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: activeIndex === idx ? "24px" : "6px",
                    height: "6px",
                    background: activeIndex === idx ? "var(--accent)" : "var(--border-visible)",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Counter */}
          <span
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-body)",
              color: "var(--text-disabled)",
              letterSpacing: "0.1em",
            }}
          >
            {activeIndex + 1} / {imagenes.length}
          </span>
        </div>
      )}
    </div>
  );
};
