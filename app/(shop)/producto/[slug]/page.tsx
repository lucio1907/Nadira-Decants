import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ProductNotasSection } from "@/components/product/ProductNotasSection";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

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
    <div style={{ paddingTop: "80px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          transition:
            "background-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        <div className="container-nd" style={{ padding: "var(--space-sm) var(--space-md)" }}>
          <nav
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--label)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-disabled)",
            }}
          >
            <Link
              href="/"
              className="nd-nav-link"
            >
              Inicio
            </Link>
            <span style={{ color: "var(--border-visible)" }}>/</span>
            <Link
              href="/#productos"
              className="nd-nav-link"
            >
              Catálogo
            </Link>
            <span style={{ color: "var(--border-visible)" }}>/</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {producto.nombre}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section
        style={{
          background: "var(--black)",
          padding: "var(--space-2xl) 0 var(--space-3xl)",
          transition: "background-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        <div className="container-nd">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image Section */}
            <div className="nd-animate-fade-in">
              <div
                className="sticky"
                style={{
                  top: "72px",
                  aspectRatio: "1 / 1.1",
                  background: "var(--surface-raised)",
                  borderRadius: "2px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 400ms ease",
                }}
              >
                {/* Visual Depth Background */}
                <div
                  className="absolute inset-0 opacity-40 dark:opacity-20"
                  style={{
                    background: "radial-gradient(circle at center, var(--accent-subtle) 0%, transparent 70%)"
                  }}
                />
                <div
                  className="absolute inset-0 dot-grid-subtle"
                  style={{ opacity: 0.2 }}
                />

                {/* The "Stage" or frame for the image */}
                <div 
                  className="relative z-10 w-[85%] h-[85%] bg-white/[0.03] backdrop-blur-3xl flex items-center justify-center p-8 border border-white/[0.05] shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                  style={{
                    borderRadius: "4px",
                  }}
                >
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <div className="relative w-full h-full group">
                      <Image 
                        src={producto.imagenes[0]} 
                        alt={producto.nombre}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-transform duration-700 ease-in-out group-hover:scale-110"
                        priority
                      />
                      {/* Subtle reflection overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <svg width="60" height="135" viewBox="0 0 40 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="14" y="2" width="12" height="14" rx="1" fill="var(--accent)" fillOpacity="0.8" />
                        <rect x="12" y="16" width="16" height="4" rx="1" fill="var(--accent)" />
                        <rect x="6" y="24" width="28" height="64" rx="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="1" fill="transparent" />
                      </svg>
                      <span className="text-[10px] tracking-[0.3em] uppercase font-mono">Sin Imagen</span>
                    </div>
                  )}
                </div>

                {/* Decorative info badge on image corner */}
                <div className="absolute bottom-10 right-10 z-20">
                  <span className="text-[8px] tracking-[0.4em] uppercase text-nd-text-disabled vertical-text opacity-40 font-mono">
                    NADIRA_DECANTS © 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="nd-animate-fade-in-up">
              {/* Brand */}
              <p
                className="text-nd-label"
                style={{
                  color: "var(--text-disabled)",
                  marginBottom: "var(--space-sm)",
                }}
              >
                {producto.marca}
              </p>

              {/* Name */}
              <h1
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(2rem, 5vw, var(--display-lg))",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "var(--text-display)",
                  marginBottom: "var(--space-lg)",
                }}
              >
                {producto.nombre}
              </h1>

              {/* Description */}
              <p
                className="text-nd-body"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-xl)",
                  maxWidth: "480px",
                  lineHeight: 1.6,
                }}
              >
                {producto.descripcion}
              </p>

              {/* Divider */}
              <div className="nd-divider" style={{ marginBottom: "var(--space-xl)" }} />

              {/* Variant Selector */}
              <VariantSelector
                productId={producto.id}
                productSlug={producto.slug}
                productName={producto.nombre}
                productMarca={producto.marca}
                productImage={producto.imagenes[0] || ""}
                variantes={producto.variantes}
              />
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
