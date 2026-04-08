"use client";

import Link from "next/link";
import Image from "next/image";

// Helper components for icons to ensure they work regardless of package versions
const InstagramIcon = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const TikTokIcon = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /><path d="M15 9s-1.5 0-3-1.5" /></svg>
);

const FacebookIcon = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const ArrowRightIcon = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

const MailIcon = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

const ClockIcon = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explorar: [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/#productos" },
      { label: "Sobre Nosotros", href: "/#sobre-nosotros" },
      { label: "Preguntas Frecuentes", href: "/#faq" },
    ],
    social: [
      { label: "Instagram", href: "https://instagram.com/nadiradecants", icon: InstagramIcon },
      { label: "TikTok", href: "https://tiktok.com/@nadiradecants", icon: TikTokIcon },
      { label: "Facebook", href: "https://facebook.com/nadiradecants", icon: FacebookIcon },
    ]
  };

  return (
    <footer
      className="transition-colors duration-500 ease-in-out mt-auto"
      style={{
        background: "var(--black)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="container-nd" style={{ padding: "var(--space-3xl) var(--space-md) var(--space-xl)" }}>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 mb-16">

          {/* Brand & Description - 4 columns */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link
              href="/"
              className="hover:opacity-80 transition-all duration-500 flex items-center w-fit"
            >
              <Image
                src="/images/nadira-new.svg"
                alt="NADIRA"
                width={100}
                height={100}
                className="object-contain"
              />
            </Link>
            <p
              className="text-nd-body-sm max-w-xs leading-loose"
              style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 300 }}
            >
              Curamos las fragancias más exclusivas del mundo, permitiéndote explorar el lujo gota a gota. Maison de Parfums & Decants de Autor.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 transition-all duration-500 hover:scale-105 active:scale-95 flex items-center justify-center rounded-full"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      background: "transparent"
                    }}
                    aria-label={social.label}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--black)";
                      e.currentTarget.style.background = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Grid - 4 columns */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h4 className="text-nd-label text-[var(--accent)] mb-2">Explorar</h4>
              <ul className="flex flex-col gap-4">
                {footerLinks.explorar.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-nd-body-sm transition-all duration-500 hover:translate-x-1 flex items-center gap-2 group"
                      style={{ color: "var(--text-secondary)", fontSize: "14px" }}
                    >
                      <span className="w-0 h-[1px] bg-[var(--accent)] transition-all duration-500 group-hover:w-3"></span>
                      <span className="group-hover:text-[var(--text-display)]">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Our Promise - 4 columns */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h4 className="text-nd-label text-[var(--accent)] mb-2">Nuestra Promesa</h4>
              <ul className="flex flex-col gap-6">
                <li className="flex gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--border)] transition-all duration-500 group-hover:border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div>
                    <h5 className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-display)] mb-1">100% Original</h5>
                    <p className="text-[13px] text-[var(--text-secondary)] font-light leading-relaxed">Garantía total de autenticidad en cada gota.</p>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--border)] transition-all duration-500 group-hover:border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="4" y="5" rx="2" /><path d="m4 9 8 5 8-5" /></svg>
                  </div>
                  <div>
                    <h5 className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-display)] mb-1">Envíos Asegurados</h5>
                    <p className="text-[13px] text-[var(--text-secondary)] font-light leading-relaxed">Despachos diarios a todo el país.</p>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--border)] transition-all duration-500 group-hover:border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10h-10V2z" /><path d="M12 12L2.8 2.2" /><path d="M12 12L19.8 4.2" /></svg>
                  </div>
                  <div>
                    <h5 className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-display)] mb-1">Experiencia Curada</h5>
                    <p className="text-[13px] text-[var(--text-secondary)] font-light leading-relaxed">Asesoramiento premium personalizado.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-nd-body-sm" style={{ color: "var(--text-secondary)" }}>
                <MailIcon size={14} strokeWidth={1.5} className="text-[var(--accent)]" />
                <span>contacto@nadiradecants.com</span>
              </div>
              <div className="flex items-center gap-3 text-nd-body-sm" style={{ color: "var(--text-secondary)" }}>
                <ClockIcon size={14} strokeWidth={1.5} className="text-[var(--accent)]" />
                <span>Atención: Lun - Vie, 10:00 - 19:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="nd-divider mb-8 opacity-40" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="order-2 md:order-1">
            <p
              className="text-nd-label"
              style={{
                fontSize: "10px",
                color: "var(--text-disabled)",
                textTransform: "none",
                letterSpacing: "0.05em"
              }}
            >
              © {currentYear} NADIRA DECANTS. Todos los derechos reservados.
            </p>
          </div>

          <div className="order-3">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] font-body">
              Maison de Parfums · Buenos Aires
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
