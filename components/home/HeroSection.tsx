"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalize to range -0.5 to 0.5
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;

    setMousePos({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ background: "var(--black)" }}
    >
      {/* 1. Background Grain / Noise */}
      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("https://grains-filter.com/wp-content/uploads/2021/04/Noise-Texture-1.png")` }}
      />

      {/* 2. Dynamic Ambient Light */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, var(--accent-subtle) 0%, transparent 60%)`,
          opacity: loaded ? 0.4 : 0,
        }}
      />

      {/* 3. Main Content Container */}
      <div className="container-nd relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">

        {/* TEXT COLUMN */}
        <div className="flex flex-col items-start text-left max-w-xl">
          <div className="overflow-hidden mb-6">
            <span
              className="text-nd-label inline-block"
              style={{
                color: "var(--accent)",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms",
              }}
            >
              Excellence en parfumerie
            </span>
          </div>

          <h1
            className="text-display-xl mb-8 tracking-tighter"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1) 300ms",
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
            }}
          >
            NADIRA<span style={{ color: "var(--accent)" }}>.</span>
          </h1>

          <p
            className="mb-10 text-nd-body lg:text-subheading font-light max-w-sm"
            style={{
              color: "var(--text-secondary)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1) 500ms",
            }}
          >
            Descubrí la sofisticación en cada gota. Nuestra curaduría de decants te acerca a las fragancias más exclusivas del mundo.
          </p>

          <div
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(16px)",
              transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1) 700ms",
            }}
          >
            <Link href="/#productos" className="nd-btn-primary px-10 gap-3 group">
              VER COLECCIÓN
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* IMAGE COLUMN (Desktop Only Visual Enhancement) */}
        <div
          className="relative hidden lg:flex items-center justify-center p-8 h-[70vh]"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded
              ? `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`
              : "translate(20px, 40px)",
            transition: loaded ? "transform 0.1s ease-out, opacity 1.5s ease-out 400ms" : "none",
          }}
        >
          {/* Subtle glow behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative w-full h-full max-w-md animate-float">
            <Image
              src="/images/hero_perfume_v5.png"
              alt="Luxury Perfume Bottle"
              fill
              sizes="(min-width: 1024px) 540px, 1px"
              quality={100}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* MOBILE IMAGE OVERLAY (Subtle) - Moved outside container for true 100vw */}
      <div className="absolute inset-0 lg:hidden z-[-1] opacity-30 pointer-events-none">
        <Image
          src="/images/hero_perfume_v5.png"
          alt="Luxury Perfume Bottle Background"
          fill
          sizes="(max-width: 1024px) 100vw, 1px"
          quality={80}
          className="object-cover object-center scale-110 blur-[10px]"
          priority
        />
      </div>

      {/* Scroll indicator - elegant vertical line */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1) 1200ms",
        }}
      >
        <div
          className="overflow-hidden"
          style={{ width: "1px", height: "64px" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom, var(--accent), transparent)",
              animation: "scrollDown 2.5s ease-in-out infinite",
              transformOrigin: "top"
            }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scrollDown {
          0% { transform: scaleY(0); transform-origin: top; }
          40% { transform: scaleY(1); transform-origin: top; }
          40.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </section>
  );
};
