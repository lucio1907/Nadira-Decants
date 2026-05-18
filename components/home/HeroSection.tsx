"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  return (
    <section
      className="relative w-full min-h-[100svh] flex flex-col overflow-hidden"
      aria-label="Nadira Decants — Probá perfumes de lujo antes de elegir"
    >
      {/* Background image — full cover with parallax */}
      <Image
        src="/images/wallpaperherosection.webp"
        alt=""
        fill
        priority
        quality={90}
        sizes="(max-width: 768px) 220vw, 100vw"
        aria-hidden="true"
        style={{
          objectFit: "cover",
          objectPosition: "center 30%",
          transform: isDesktop
            ? `scale(1.08) translateY(${scrollY * 0.25}px)`
            : "none",
          transformOrigin: "center top",
          willChange: isDesktop ? "transform" : "auto",
        }}
      />

      {/* Base dark layer — mobile */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none lg:hidden"
        style={{ background: "rgba(0,0,0,0.3)" }}
      />

      {/* Vignette — solo desktop */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden lg:block"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Top fade */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%)",
        }}
      />

      {/* Bottom fade into page */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.65) 80%, var(--black) 100%)",
        }}
      />

      {/* Left darkening */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, transparent 75%)",
        }}
      />

      {/* Content */}
      <div className="container-nd relative z-10 flex items-center min-h-[100svh] py-24 lg:py-0">

        {/* Glass panel + text */}
        <div
          className="hero-reveal w-full lg:w-auto"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: "0px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            borderLeft: "2px solid rgba(211,176,0,0.3)",
            padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 3rem)",
            maxWidth: "580px",
          }}
        >

          {/* Eyebrow */}
          <div className="hero-reveal hero-delay-1 flex items-center gap-3 mb-6">
            <div className="w-6 h-px flex-shrink-0" style={{ background: "var(--accent)" }} />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              Decants de Perfumes de Lujo
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6">
            <span
              className="hero-reveal hero-delay-2 block"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "-0.02em",
              }}
            >
              Probá antes
            </span>
            <span
              className="hero-reveal hero-delay-3 block"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                color: "#ffffff",
                letterSpacing: "-0.03em",
              }}
            >
              de elegir<span style={{ color: "var(--accent)" }}>.</span>
            </span>
          </h1>

          {/* Separator */}
          <div
            className="hero-reveal hero-delay-4 mb-6"
            style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, var(--accent), transparent)" }}
          />

          {/* Subline */}
          <p
            className="hero-reveal hero-delay-4 mb-8"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 300,
            }}
          >
            Probá perfumes sin tener que comprar el frasco entero.
            Te ayudo a encontrar el indicado para vos.
          </p>

          {/* CTAs */}
          <div className="hero-reveal hero-delay-5 flex flex-col sm:flex-row gap-3 mb-8">
            <Link href="/#productos" className="nd-btn-primary px-7 gap-3 group justify-center">
              VER COLECCIÓN
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/#sobre-mi" className="nd-btn-secondary px-7 justify-center">
              CÓMO FUNCIONA
            </Link>
          </div>

          {/* Trust strip */}
          <div
            className="hero-reveal hero-delay-6 flex flex-wrap gap-x-5 gap-y-2 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {["100% Originales", "Envíos a Todo el País", "Probá Antes de Comprar"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span style={{ color: "var(--accent)", fontSize: "6px" }}>✦</span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll-indicator absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ bottom: "calc(44px + 1px)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--text-disabled)",
          }}
        >
          SCROLL
        </span>
        <div className="w-px h-10 overflow-hidden">
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom, var(--accent), transparent)",
              animation: "heroScrollLine 2.5s ease-in-out infinite",
              transformOrigin: "top",
            }}
          />
        </div>
      </div>

      {/* Marquee banner */}
      <div
        className="absolute bottom-0 w-full overflow-hidden z-20"
        style={{
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          height: "44px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="hero-marquee flex whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center mx-6"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
              }}
            >
              <span>Probá Antes de Comprar</span>
              <span
                className="mx-8"
                style={{ color: "var(--accent)", fontSize: "7px" }}
              >
                ✦
              </span>
              <span>Envíos a Todo el País</span>
              <span
                className="mx-8"
                style={{ color: "var(--accent)", fontSize: "7px" }}
              >
                ✦
              </span>
              <span>100% Originales</span>
              <span
                className="mx-8"
                style={{ color: "var(--accent)", fontSize: "7px" }}
              >
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Component-scoped styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Entry animations */
          .hero-reveal {
            opacity: 0;
            animation: heroReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .hero-delay-1 { animation-delay: 0.05s; }
          .hero-delay-2 { animation-delay: 0.18s; }
          .hero-delay-3 { animation-delay: 0.30s; }
          .hero-delay-4 { animation-delay: 0.44s; }
          .hero-delay-5 { animation-delay: 0.58s; }
          .hero-delay-6 { animation-delay: 0.75s; }

          @keyframes heroReveal {
            from { opacity: 0; transform: translateY(22px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          /* Scroll line */
          .hero-scroll-indicator {
            opacity: 0;
            animation: heroFadeIn 0.8s ease-out 1.2s forwards;
          }
          @keyframes heroFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes heroScrollLine {
            0%    { transform: scaleY(0); transform-origin: top; }
            40%   { transform: scaleY(1); transform-origin: top; }
            40.1% { transform: scaleY(1); transform-origin: bottom; }
            100%  { transform: scaleY(0); transform-origin: bottom; }
          }

          /* Marquee */
          .hero-marquee {
            width: max-content;
            animation: heroMarquee 35s linear infinite;
          }
          @keyframes heroMarquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `
      }} />
    </section>
  );
};
