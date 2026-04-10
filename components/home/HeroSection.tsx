"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const [phase, setPhase] = useState(0); // 0=hidden, 1=line, 2=tag, 3=title, 4=subtitle, 5=cta, 6=image
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Orchestrated reveal sequence — each phase triggers the next
    const timers = [
      setTimeout(() => setPhase(1), 200),   // Golden line
      setTimeout(() => setPhase(2), 600),   // Tag
      setTimeout(() => setPhase(3), 900),   // Title  
      setTimeout(() => setPhase(4), 1400),  // Subtitle
      setTimeout(() => setPhase(5), 1800),  // CTA
      setTimeout(() => setPhase(6), 2100),  // Image + scroll indicator
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
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
      {/* Background Grain / Noise */}
      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("https://grains-filter.com/wp-content/uploads/2021/04/Noise-Texture-1.png")` }}
      />

      {/* Dynamic Ambient Light — follows mouse */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, var(--accent-subtle) 0%, transparent 60%)`,
          opacity: phase >= 1 ? 0.5 : 0,
        }}
      />

      {/* Secondary ambient glow — top right corner */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(211, 176, 0, 0.06) 0%, transparent 70%)",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 2s ease",
        }}
      />

      {/* Main Content Container */}
      <div className="container-nd relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">

        {/* TEXT COLUMN */}
        <div className="flex flex-col items-start text-left max-w-xl">

          {/* Golden decorative line — first to appear */}
          <div
            className="mb-8 overflow-hidden"
            style={{
              width: phase >= 1 ? "80px" : "0px",
              transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="h-[1px]"
              style={{
                background: "linear-gradient(90deg, var(--accent), transparent)",
                opacity: phase >= 1 ? 0.8 : 0,
                transition: "opacity 800ms ease 200ms",
              }}
            />
          </div>

          {/* Tag — Probá antes de elegir */}
          <div className="overflow-hidden mb-6">
            <span
              className="text-nd-label inline-block"
              style={{
                color: "var(--accent)",
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
                transition: "all 800ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Probá antes de elegir
            </span>
          </div>

          {/* Title — NADIRA with editorial serif */}
          <div className="overflow-hidden mb-8">
            <h1
              className="tracking-tighter ml-[-0.05em]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 12vw, 8.5rem)",
                lineHeight: 0.95,
                fontWeight: 700,
                color: "var(--text-display)",
                letterSpacing: "-0.03em",
                opacity: phase >= 3 ? 1 : 0,
                transform: phase >= 3 ? "translateY(0)" : "translateY(100%)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              NADIRA<span style={{ color: "var(--accent)", fontStyle: "italic" }}>.</span>
            </h1>
          </div>

          {/* Second golden line under title */}
          <div
            className="mb-10 overflow-hidden"
            style={{
              width: phase >= 3 ? "120px" : "0px",
              transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 300ms",
            }}
          >
            <div
              className="h-[1px]"
              style={{
                background: "linear-gradient(90deg, var(--accent) 60%, transparent)",
                opacity: phase >= 3 ? 0.5 : 0,
                transition: "opacity 1s ease 400ms",
              }}
            />
          </div>

          {/* Subtitle */}
          <p
            className="mb-10 lg:text-subheading font-light max-w-sm"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              opacity: phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? "translateY(0)" : "translateY(20px)",
              transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Probá perfumes sin tener que comprar el frasco entero.
            Te ayudo a encontrar el indicado para vos.
          </p>

          {/* CTA Button */}
          <div
            style={{
              opacity: phase >= 5 ? 1 : 0,
              transform: phase >= 5 ? "translateY(0)" : "translateY(16px)",
              transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1)",
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
            opacity: phase >= 6 ? 1 : 0,
            transform: phase >= 6
              ? `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`
              : "translate(20px, 40px)",
            transition: phase >= 6 ? "transform 0.1s ease-out, opacity 1.5s ease-out" : "none",
          }}
        >
          {/* Subtle glow behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Decorative frame — editorial style */}
          <div
            className="absolute top-8 right-8 w-32 h-32 pointer-events-none"
            style={{
              borderTop: "1px solid rgba(211, 176, 0, 0.2)",
              borderRight: "1px solid rgba(211, 176, 0, 0.2)",
              opacity: phase >= 6 ? 1 : 0,
              transition: "opacity 1.5s ease 300ms",
            }}
          />
          <div
            className="absolute bottom-8 left-8 w-32 h-32 pointer-events-none"
            style={{
              borderBottom: "1px solid rgba(211, 176, 0, 0.2)",
              borderLeft: "1px solid rgba(211, 176, 0, 0.2)",
              opacity: phase >= 6 ? 1 : 0,
              transition: "opacity 1.5s ease 500ms",
            }}
          />

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

      {/* MOBILE IMAGE OVERLAY (Subtle) */}
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

      {/* Scroll indicator — elegant vertical line */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        style={{
          opacity: phase >= 6 ? 1 : 0,
          transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span
          className="text-nd-caption"
          style={{
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "var(--text-disabled)",
          }}
        >
          SCROLL
        </span>
        <div
          className="overflow-hidden"
          style={{ width: "1px", height: "48px" }}
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
