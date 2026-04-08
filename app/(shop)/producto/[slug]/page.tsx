import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ProductNotasSection } from "@/components/product/ProductNotasSection";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
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
    <div className="pt-20 lg:pt-24">
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
          transition: "background-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
        className="py-8 md:py-16 lg:py-24"
      >
        <div className="container-nd">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image Section */}
            <div className="nd-animate-fade-in w-full">
              <div
                className="relative static lg:sticky lg:aspect-[1/1.1] py-12 lg:py-0"
                style={{
                  top: "100px",
                  background: "var(--surface-raised)",
                  borderRadius: "2px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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

                {/* The "Stage" or frame for the carousel */}
                <div 
                  className="relative z-10 w-[80%] h-auto aspect-square bg-white/[0.03] backdrop-blur-3xl flex items-center justify-center border border-white/[0.05] shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                  style={{
                    borderRadius: "4px",
                    overflow: "hidden", // Important to keep carousel inside the stage
                  }}
                >
                  <ProductImageCarousel 
                    imagenes={producto.imagenes} 
                    nombre={producto.nombre} 
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="nd-animate-fade-in-up w-full">
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
                className="text-display-lg lg:text-display-xl"
                style={{
                  fontFamily: "var(--font-body)",
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
