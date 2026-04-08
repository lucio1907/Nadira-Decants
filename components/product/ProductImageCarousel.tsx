"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  imagenes: string[];
  nombre: string;
}

export const ProductImageCarousel = ({ imagenes, nombre }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fallback for empty images
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 opacity-30">
        <svg width="60" height="135" viewBox="0 0 40 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="2" width="12" height="14" rx="1" fill="var(--accent)" fillOpacity="0.8" />
          <rect x="12" y="16" width="16" height="4" rx="1" fill="var(--accent)" />
          <rect x="6" y="24" width="28" height="64" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" fill="transparent" />
        </svg>
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono">Sin Imagen</span>
      </div>
    );
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollPosition / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
  };

  const next = () => {
    const nextIndex = (activeIndex + 1) % imagenes.length;
    scrollTo(nextIndex);
  };

  const prev = () => {
    const prevIndex = (activeIndex - 1 + imagenes.length) % imagenes.length;
    scrollTo(prevIndex);
  };

  return (
    <div className="relative w-full h-full group flex flex-col items-center justify-center">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {imagenes.map((src, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-full h-full snap-start flex items-center justify-center p-6 md:p-8"
          >
            <div className="relative w-full h-full aspect-square">
              <Image
                src={src}
                alt={`${nombre} - ${idx + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-transform duration-700 ease-in-out hover:scale-105"
                priority={idx === 0}
              />
              {/* Subtle reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only if > 1 image */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Indicators / Dots - Only if > 1 image */}
      {imagenes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {imagenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "bg-[var(--accent)] w-4"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative Side Text */}
      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 hidden sm:block pointer-events-none">
        <span className="text-[8px] tracking-[0.4em] uppercase text-nd-text-disabled vertical-text opacity-40 font-mono">
          NADIRA_DECANTS © 2026
        </span>
      </div>
      
      {/* Decorative Image Info (e.g. 1/3) */}
      {imagenes.length > 1 && (
        <div className="absolute top-6 right-6 z-20 pointer-events-none">
          <span className="text-[10px] tracking-[0.2em] font-mono text-white/30">
            0{activeIndex + 1} <span className="text-white/10">/</span> 0{imagenes.length}
          </span>
        </div>
      )}
    </div>
  );
};
