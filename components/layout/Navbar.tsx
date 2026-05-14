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
    { href: "/#sobre-mi", label: "Sobre Mí" },
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
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center z-[60] group"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ color: "var(--text-display)" }}
            >
              <div className="flex flex-col gap-1.5 items-end">
                <span
                  className="h-[1px] bg-current transition-all duration-500 ease-out"
                  style={{
                    width: mobileOpen ? "24px" : "20px",
                    transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                  }}
                />
                <span
                  className="h-[1px] bg-current transition-all duration-500 ease-out"
                  style={{
                    width: "24px",
                    opacity: mobileOpen ? 0 : 1,
                  }}
                />
                <span
                  className="h-[1px] bg-current transition-all duration-500 ease-out"
                  style={{
                    width: mobileOpen ? "24px" : "16px",
                    transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu - Modern Sidebar Style */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-[320px] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background: "var(--black)",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            borderLeft: "1px solid var(--border)",
          }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-end p-6 border-b border-[var(--border)] border-opacity-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
            {[
              { href: "/", label: "Inicio", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
              { href: "/#productos", label: "Catálogo", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4v2h-4z"></path><path d="M12 4v3"></path><rect x="8" y="7" width="8" height="14" rx="1"></rect><path d="M10 7v14"></path></svg> },
              { href: "/#sobre-mi", label: "Sobre Mí", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
              { href: "/#faq", label: "Preguntas", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg> },
              { href: "/carrito", label: "Mi Bolso", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg> }
            ].map((link, i) => {
              const isActive = pathname === link.href || (link.href.includes('#') && pathname === '/');
              return (
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
                  className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300`}
                >
                  <div className={`transition-colors duration-300 ${isActive ? "text-[var(--text-display)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-display)]"}`}>
                    {link.icon}
                  </div>

                  <span className={`text-[13px] font-medium tracking-wide transition-colors duration-300 ${isActive ? "text-[var(--text-display)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-display)]"
                    }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}

            <div className="mt-8 px-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-disabled)] font-bold">Explorar</span>
              <div className="h-[1px] w-full bg-white/5 mt-3 mb-4" />
            </div>

            <Link
              href="https://www.instagram.com/nadiradecants.baradero/"
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 group transition-all"
              target="_blank"
            >
              <div className="text-[var(--text-secondary)] group-hover:text-[var(--text-display)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <span className="text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text-display)]">Instagram</span>
            </Link>

            <Link
              href="https://wa.me"
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 group transition-all"
            >
              <div className="text-[var(--text-secondary)] group-hover:text-[var(--text-display)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <span className="text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text-display)]">Atención WhatsApp</span>
            </Link>
          </div>

          {/* Sidebar Footer */}
          <div className="p-8 border-t border-[var(--border)] border-opacity-50 bg-white/[0.02]">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-disabled)] font-body mb-1">Nadira Decants</p>
            <p className="text-[9px] text-[var(--text-secondary)] opacity-50">Tu fragancia favorita en formato decant</p>
          </div>
        </div>
      </div>
    </>
  );
};
