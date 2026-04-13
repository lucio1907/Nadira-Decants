"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Reset URL hash
      window.history.pushState(null, "", window.location.pathname);
    }
    setMobileOpen(false);
  };

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Update URL hash manually
        window.history.pushState(null, "", href);
      }
    }
    setMobileOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/#productos", label: "Catálogo" },
    { href: "/#sobre-nosotros", label: "Sobre Nosotros" },
    { href: "/#faq", label: "Preguntas" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "bg-[var(--black)] border-b border-[var(--border)] py-4 shadow-sm" : "bg-transparent border-b border-transparent py-6"
          }`}
      >
        <div className="container-nd flex items-center justify-between">
          {/* Logo — Playfair */}
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`transition-all duration-500 flex items-center ${mobileOpen ? "opacity-0 pointer-events-none" : "opacity-100 hover:opacity-80"
              }`}
          >
            <Image
              src="/images/logonadira.png"
              alt="NADIRA"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href === "/") {
                    handleHomeClick(e);
                  } else if (link.href.includes("#")) {
                    handleAnchorClick(e, link.href);
                  }
                }}
                className="nd-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-6">
            <ThemeToggle />

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-1 transition-all duration-300 group hover:scale-110 active:scale-95"
              style={{ color: "var(--text-primary)" }}
              aria-label="Ver Bolso"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-[var(--accent)] transition-all"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {mounted && itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-2 min-w-[17px] h-[17px] rounded-full flex items-center justify-center px-1"
                  style={{
                    background: "var(--accent)",
                    color: "var(--black)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(195, 163, 109, 0.4)",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden relative w-6 h-6 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ color: "var(--text-display)" }}
            >
              <span
                className="absolute h-[1.5px] bg-current transition-all duration-300 ease-in-out"
                style={{
                  width: "18px",
                  transform: mobileOpen
                    ? "rotate(45deg) translateY(0)"
                    : "translateY(-5px)",
                }}
              />
              <span
                className="absolute h-[1.5px] bg-current transition-all duration-300 ease-in-out"
                style={{
                  width: "18px",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="absolute h-[1.5px] bg-current transition-all duration-300 ease-in-out"
                style={{
                  width: "18px",
                  transform: mobileOpen
                    ? "rotate(-45deg) translateY(0)"
                    : "translateY(5px)",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-700 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            opacity: mobileOpen ? 1 : 0,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-[400px] flex flex-col transition-transform duration-700"
          style={{
            background: "var(--black)",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            borderLeft: "1px solid var(--border)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="flex-1 flex flex-col justify-center px-12 gap-8">
            {[
              { href: "/", label: "Inicio" },
              { href: "/#productos", label: "Catálogo" },
              { href: "/#sobre-nosotros", label: "Sobre Nosotros" },
              { href: "/#faq", label: "Preguntas" },
              { href: "/carrito", label: "Carrito" }
            ].map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href === "/") {
                    handleHomeClick(e);
                  } else if (link.href.includes("#")) {
                    handleAnchorClick(e, link.href);
                  } else {
                    setMobileOpen(false);
                  }
                }}
                className="group w-fit"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "36px",
                  color: "var(--text-display)",
                  textDecoration: "none",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateY(0)" : "translateY(24px)",
                  transition: mobileOpen
                    ? `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s, color 0.3s ease`
                    : `opacity 0.3s ease, transform 0.3s ease`,
                }}
              >
                <span className="group-hover:text-[var(--accent)] transition-colors duration-500">{link.label}</span>
              </Link>
            ))}
          </div>

          <div
            className="p-12 border-t border-[var(--border)] border-opacity-50"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
              transition: mobileOpen
                ? `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s`
                : `opacity 0.3s ease, transform 0.3s ease`,
            }}
          >
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] font-body">Maison de Parfums</p>
          </div>
        </div>
      </div>
    </>
  );
};
