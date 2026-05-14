"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, clientX: -1000, clientY: -1000 });
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial mouse pos in center
    setMousePos({ 
      x: 0, 
      y: 0, 
      clientX: window.innerWidth / 2, 
      clientY: window.innerHeight / 2 
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePos({ x, y, clientX, clientY });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--black)" }}
      aria-label="Nadira Decants — Probá perfumes de lujo antes de elegir"
    >
      {/* 1. Subtle Animated Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />
      {/* Grid fade masks using var(--black) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ background: "linear-gradient(to bottom, var(--black) 0%, transparent 20%, transparent 80%, var(--black) 100%)" }} 
      />
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ background: "linear-gradient(to right, var(--black) 0%, transparent 20%, transparent 80%, var(--black) 100%)" }} 
      />

      {/* 2. Kinetic Background Outline Text */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] select-none mix-blend-screen"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <div className="whitespace-nowrap animate-pan-text">
          <span className="text-[25vw] font-black tracking-tighter text-transparent stroke-text" style={{ fontFamily: "var(--font-display)" }}>
            PERFUMES DE AUTOR — DECANTS — 
          </span>
          <span className="text-[25vw] font-black tracking-tighter text-transparent stroke-text" style={{ fontFamily: "var(--font-display)" }}>
            PERFUMES DE AUTOR — DECANTS — 
          </span>
        </div>
      </div>

      {/* 3. Interactive Mouse Spotlight */}
      {isMounted && (
        <div 
          className="absolute rounded-full pointer-events-none mix-blend-screen blur-[100px] z-0 transition-transform duration-700 ease-out"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, var(--accent-subtle) 0%, transparent 60%)",
            transform: `translate(${mousePos.clientX - 300}px, ${mousePos.clientY - 300}px)`,
            left: 0,
            top: 0
          }}
        />
      )}

      {/* 4. Grain Overlay for Texture */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("https://grains-filter.com/wp-content/uploads/2021/04/Noise-Texture-1.png")` }}
      />

      {/* 5. Main Content Layer */}
      <div
        className="container-nd relative z-10 flex flex-col items-center text-center px-4"
        style={{
          transform: `translateY(${scrollY * -0.1}px)`
        }}
      >
        <div className="overflow-hidden mb-6">
          <span
            className="text-nd-label inline-block animate-slide-up"
            style={{ color: "var(--accent)" }}
          >
            Probá antes de elegir
          </span>
        </div>

        <div className="relative mb-10 group">
          {/* Subtle glow behind title that pulses */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full blur-[80px] animate-pulse-slow pointer-events-none" style={{ background: "var(--accent-subtle)", opacity: 0.3 }} />

          <h1
            className="tracking-tighter ml-[-0.05em] animate-slide-up-delayed relative z-10"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4rem, 12vw, 8.5rem)",
              lineHeight: 0.95,
              fontWeight: 700,
              color: "var(--text-display)",
              letterSpacing: "-0.03em",
            }}
          >
            NADIRA<span style={{ color: "var(--accent)", fontStyle: "italic" }}>.</span>
          </h1>
        </div>

        <p
          className="mb-10 lg:text-subheading font-light max-w-sm animate-slide-up-delayed-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          Probá perfumes sin tener que comprar el frasco entero.
          Te ayudo a encontrar el indicado para vos.
        </p>

        <div className="animate-slide-up-delayed-3">
          <Link href="/#productos" className="nd-btn-primary px-10 gap-3 group">
            VER COLECCIÓN
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* 6. Scroll Indicator - Animated Line */}
      <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in-delayed hidden sm:flex">
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
        <div className="w-[1px] h-[48px] overflow-hidden">
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

      {/* 7. Infinite Marquee Banner */}
      <div 
        className="absolute bottom-0 w-full overflow-hidden z-20"
        style={{ 
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "16px 0"
        }}
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-4 text-xs tracking-[0.3em] uppercase" style={{ color: "var(--text-secondary)" }}>
              <span>PROBÁ ANTES DE COMPRAR</span>
              <span className="mx-8" style={{ color: "var(--accent)" }}>✦</span>
              <span>ENVÍOS A TODO EL PAÍS</span>
              <span className="mx-8" style={{ color: "var(--accent)" }}>✦</span>
              <span>100% ORIGINALES</span>
              <span className="mx-8" style={{ color: "var(--accent)" }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Corner Decorative Accents */}
      <div className="absolute top-12 left-12 w-24 h-24 pointer-events-none opacity-20 hidden lg:block z-0">
        <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }} />
        <div className="absolute top-0 left-0 h-full w-[1px]" style={{ background: "linear-gradient(180deg, var(--accent), transparent)" }} />
      </div>
      <div className="absolute bottom-32 right-12 w-24 h-24 pointer-events-none opacity-20 hidden lg:block z-0">
        <div className="absolute bottom-0 right-0 w-full h-[1px]" style={{ background: "linear-gradient(270deg, var(--accent), transparent)" }} />
        <div className="absolute bottom-0 right-0 h-full w-[1px]" style={{ background: "linear-gradient(0deg, var(--accent), transparent)" }} />
      </div>

      {/* 9. Floating Particles */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-[var(--accent)] opacity-20 blur-[1px] animate-float-particle"
              style={{
                width: "2px",
                height: "2px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${15 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * -20}s`
              }}
            />
          ))}
        </div>
      )}

      {/* CSS Configurations & Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
        }

        @keyframes panText {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-pan-text {
          display: inline-block;
          animation: panText 60s linear infinite;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up-delayed {
          opacity: 0;
          animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .animate-slide-up-delayed-2 {
          opacity: 0;
          animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }
        .animate-slide-up-delayed-3 {
          opacity: 0;
          animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
        }

        @keyframes scrollDown {
          0% { transform: scaleY(0); transform-origin: top; }
          40% { transform: scaleY(1); transform-origin: top; }
          40.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        @keyframes pulseSlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-delayed {
          opacity: 0;
          animation: fadeIn 1s ease-out 1s forwards;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }

        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        .animate-float-particle {
          animation: floatParticle linear infinite;
        }
      `}} />
    </section>
  );
};
