import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ProductNotasSection } from "@/components/product/ProductNotasSection";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
import Link from "next/link";
import type { Metadata } from "next";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Mars, Venus, Users } from "lucide-react";

export const generateStaticParams = async () => {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const producto = await getProductBySlug(slug);

  if (!producto) return { title: "Producto no encontrado — Nadira" };

  return {
    title: `${producto.nombre} — ${producto.marca} | Nadira Decants`,
    description: producto.descripcion,
  };
};

const ProductoPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const producto = await getProductBySlug(slug);

  if (!producto) notFound();

  return (
    <div className="pt-20 lg:pt-24">
      {/* Breadcrumb — refined with back arrow */}
      <div
        style={{
          background: "transparent",
          transition:
            "background-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
        className="relative z-20 border-b border-transparent md:border-[var(--border)]"
      >
        <div className="container-nd" style={{ padding: "var(--space-md) var(--space-md)" }}>
          <nav
            className="flex items-center gap-3 overflow-x-auto whitespace-nowrap"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-disabled)",
            }}
          >
            <Link
              href="/#productos"
              className="nd-nav-link opacity-60 hover:opacity-100 flex items-center gap-2 group transition-all duration-300"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
              Catálogo
            </Link>
            <span style={{ color: "var(--border-visible)" }}>/</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                fontSize: "11px",
                fontStyle: "italic",
                letterSpacing: "0.05em",
                textTransform: "none",
              }}
            >
              {producto.marca} — {producto.nombre}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section
        className="nd-grain nd-mesh-dark overflow-hidden relative"
        style={{
          paddingTop: "clamp(2rem, 5vw, 4rem)",
          paddingBottom: "clamp(3rem, 8vw, 7rem)",
        }}
      >
        <div className="container-nd">
          <div className="flex flex-col lg:grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-start">
            {/* Product Image Section */}
            <div className="nd-animate-fade-in w-full lg:sticky lg:top-28 relative group">
              {/* Decorative frame corners */}
              <div className="absolute -top-3 -left-3 w-16 h-16 pointer-events-none hidden lg:block"
                style={{
                  borderTop: "1px solid rgba(211, 176, 0, 0.2)",
                  borderLeft: "1px solid rgba(211, 176, 0, 0.2)",
                }}
              />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 pointer-events-none hidden lg:block"
                style={{
                  borderBottom: "1px solid rgba(211, 176, 0, 0.2)",
                  borderRight: "1px solid rgba(211, 176, 0, 0.2)",
                }}
              />
              
              {/* Background Grid Lines from Incoming */}
              <div className="absolute inset-0 nd-pattern-grid opacity-[0.05] hidden md:block" />
              
              {/* Subtle accent lines */}
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent hidden md:block" />

              <div
                className="relative w-full aspect-[4/5] sm:aspect-square flex items-center justify-center overflow-hidden"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Accent glow behind product */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)",
                  }}
                />

                {/* Carousel */}
                <div className="relative w-full h-full">
                  <ProductImageCarousel
                    imagenes={producto.imagenes}
                    nombre={producto.nombre}
                  />
                </div>
              </div>

              {/* Image count badge */}
              {producto.imagenes.length > 1 && (
                <div
                  className="absolute top-4 left-4 z-20 py-1 px-3 text-[9px] tracking-[0.15em] uppercase"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {producto.imagenes.length} fotos
                </div>
              )}
            </div>

            {/* Product Info — improved hierarchy */}
            <div className="w-full">
              {/* Brand + Name Group */}
              <div className="nd-animate-fade-in-up">
                {/* Brand line */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="h-[1px] nd-golden-line"
                    style={{ width: "24px", animation: "none", opacity: 0.5 }}
                  />
                  <div className="flex items-center gap-3">
                    <p
                      className="text-nd-label"
                      style={{
                        color: "var(--accent)",
                        letterSpacing: "0.2em",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {producto.marca}
                    </p>
                    {producto.genero && (
                      <div className="flex items-center gap-2 pl-3 border-l border-[var(--border-visible)]">
                        {producto.genero === "Hombre" ? (
                          <Mars size={13} className="text-nd-accent opacity-80" strokeWidth={2.5} />
                        ) : producto.genero === "Mujer" ? (
                          <Venus size={13} className="text-nd-accent opacity-80" strokeWidth={2.5} />
                        ) : (
                          <Users size={13} className="text-nd-accent opacity-80" strokeWidth={2.5} />
                        )}
                        <span
                          className="text-[10px] font-bold tracking-[0.05em] uppercase py-0.5 px-2 rounded-sm"
                          style={{
                            background: "var(--accent-subtle)",
                            color: "var(--accent)",
                            border: "1px solid rgba(211, 176, 0, 0.2)"
                          }}
                        >
                          {producto.genero}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h1
                  className="nd-delay-1 nd-animate-fade-in-up"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "var(--text-display)",
                    marginBottom: "var(--space-lg)",
                  }}
                >
                  {producto.nombre}
                </h1>

                {/* Decorative separator */}
                <div
                  className="mb-6"
                  style={{
                    width: "48px",
                    height: "1px",
                    background: "linear-gradient(90deg, var(--accent), transparent)",
                    opacity: 0.4,
                  }}
                />

                {/* Description */}
                <p
                  className="nd-delay-2 nd-animate-fade-in-up"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-xl)",
                    maxWidth: "480px",
                    lineHeight: 1.7,
                    fontSize: "var(--body)",
                  }}
                >
                  {producto.descripcion}
                </p>
              </div>

              {/* Divider before variant selector */}
              <div
                className="nd-delay-3 nd-animate-fade-in-up"
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "var(--space-lg)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                {/* Variant Selector */}
                <VariantSelector
                  productId={producto.id}
                  productSlug={producto.slug}
                  productName={producto.nombre}
                  productMarca={producto.marca}
                  productImage={producto.imagenes?.find(Boolean) || ""}
                  variantes={producto.variantes}
                />
              </div>

              {/* Trust Badges — refined layout */}
              <div className="nd-delay-4 nd-animate-fade-in-up mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
                {/* Main guarantee — using updated copy from Incoming */}
                <div className="flex items-center gap-4 py-5 px-5 mb-3 rounded-lg transition-all duration-300 hover:bg-white/[0.03] group" style={{ border: "1px solid var(--border)" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(211,176,0,0.15)]"
                    style={{
                      background: "var(--accent-subtle)",
                      border: "1px solid rgba(211, 176, 0, 0.25)",
                      color: "var(--accent)",
                    }}
                  >
                    <ShieldCheck size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                      Garantía 100% Original
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-disabled)" }}>
                      Cada gota proviene directamente del frasco de autor. Autenticidad certificada.
                    </p>
                  </div>
                </div>

                {/* Secondary badges — compact horizontal */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-4 flex-1 py-5 px-5 rounded-lg transition-all duration-300 hover:bg-white/[0.03]" style={{ border: "1px solid var(--border)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
                      <CreditCard size={18} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>Pago Seguro</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-disabled)" }}>Mercado Pago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-1 py-5 px-5 rounded-lg transition-all duration-300 hover:bg-white/[0.03]" style={{ border: "1px solid var(--border)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
                      <Truck size={18} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>Envío Nacional</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-disabled)" }}>Correo Argentino</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notas section */}
      <ProductNotasSection notas={producto.notas} />
    </div>
  );
};

export default ProductoPage;
