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
    <div className="relative w-full h-full group flex flex-col items-center justify-center touch-pan-y">
      {/* Invisible Tap Zones for Navigation (Mobile Friendly) */}
      <div 
        className="absolute left-0 top-0 w-1/4 h-full z-20 cursor-pointer" 
        onClick={prev}
        aria-label="Imagen anterior"
      />
      <div 
        className="absolute right-0 top-0 w-1/4 h-full z-20 cursor-pointer" 
        onClick={next}
        aria-label="Siguiente imagen"
      />

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
            className="relative flex-shrink-0 w-full h-full snap-start flex items-center justify-center p-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`${nombre} - ${idx + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                quality={95}
                className="object-contain transition-transform duration-700 ease-in-out hover:scale-[1.02]"
                priority={idx === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 text-white hover:text-[var(--accent)] transition-all active:scale-90 flex items-center justify-center bg-black/5 hover:bg-black/20 rounded-r-lg"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 text-white hover:text-[var(--accent)] transition-all active:scale-90 flex items-center justify-center bg-black/5 hover:bg-black/20 rounded-l-lg"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Simple Indicators - Only if > 1 image */}
      {imagenes.length > 1 && (
        <div className="flex justify-center gap-3 p-4 mt-2 mb-4">
          {imagenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className="group/indicator relative p-1" // Large hit area
              aria-label={`Ir a imagen ${idx + 1}`}
            >
              <div 
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  activeIndex === idx
                    ? "bg-[var(--accent)] w-10"
                    : "bg-white/10 w-4 group-hover/indicator:bg-white/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
