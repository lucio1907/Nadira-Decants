"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <footer
      className="transition-colors duration-500 ease-in-out"
      style={{
        background: "var(--black)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="container-nd" style={{ padding: "var(--space-2xl) var(--space-md)" }}>
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
          <Link
            href="/"
            className="tracking-[0.15em] hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 500,
              color: "var(--text-display)",
              textDecoration: "none",
            }}
          >
            NADIRA
          </Link>

          <div
            className="flex items-center gap-6 sm:gap-10"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}
          >
            {[
              { href: "/", label: "Inicio" },
              { href: "/#productos", label: "Catálogo" },
              { href: "/carrito", label: "Carrito" },
            ].map((link, i) => (
              <span key={link.label} className="flex items-center gap-6 sm:gap-10">
                {i > 0 && (
                  <span style={{ color: "var(--border-visible)" }}>·</span>
                )}
                <Link
                  href={link.href}
                  className="transition-colors duration-300 hover:text-[var(--text-display)]"
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="nd-divider mb-8 opacity-50" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.05em",
              color: "var(--text-disabled)",
            }}
          >
            © {new Date().getFullYear()} NADIRA
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "var(--text-disabled)",
              textTransform: "uppercase" as const,
            }}
          >
            Maison de Parfums · Decants de lujo
          </p>
        </div>
      </div>
    </footer>
  );
};
