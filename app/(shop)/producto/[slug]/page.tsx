import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ProductNotasSection } from "@/components/product/ProductNotasSection";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";

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
          background: "transparent",
          borderBottom: "1px solid var(--border)",
          transition:
            "background-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 350ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
        className="relative z-20"
      >
        <div className="container-nd" style={{ padding: "var(--space-md) var(--space-md)" }}>
          <nav
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-disabled)",
            }}
          >
            <Link href="/" className="nd-nav-link opacity-60 hover:opacity-100">Inicio</Link>
            <span style={{ color: "var(--border-visible)" }}>/</span>
            <Link href="/#productos" className="nd-nav-link opacity-60 hover:opacity-100">Catálogo</Link>
            <span style={{ color: "var(--border-visible)" }}>/</span>
            <span style={{ color: "var(--accent)" }} className="font-medium">
              {producto.nombre}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section
        className="nd-grain nd-mesh-dark py-12 md:py-20 lg:py-28 overflow-hidden relative"
      >
        <div className="container-nd">
          <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-start">
            {/* Product Image Section */}
            <div className="nd-animate-fade-in w-full lg:sticky lg:top-32 relative group flex items-center justify-center overflow-hidden">
              
              {/* Background Grid Lines */}
              <div className="absolute inset-0 nd-pattern-grid opacity-[0.05]" />
              
              {/* Subtle accent lines */}
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <div
                className="relative w-full aspect-[4/5] sm:aspect-square flex items-center justify-center transition-all duration-700"
                style={{
                  zIndex: 1,
                }}
              >
                {/* Clean, simple background for contrast */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)",
                  }}
                />
                
                {/* Maximized Carousel */}
                <div 
                  className="relative w-full sm:w-[95%] h-auto aspect-square flex items-center justify-center"
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
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[1px] w-8 bg-[var(--accent)] opacity-40" />
                <p
                  className="text-nd-label"
                  style={{
                    color: "var(--accent)",
                    letterSpacing: "0.2em",
                    fontSize: "11px"
                  }}
                >
                  {producto.marca}
                </p>
              </div>

              {/* Name */}
              <h1
                className="text-display-lg lg:text-display-xl nd-delay-1 nd-animate-fade-in-up"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "var(--text-display)",
                  marginBottom: "var(--space-md)",
                }}
              >
                {producto.nombre}
              </h1>

              {/* Description */}
              <p
                className="text-nd-body nd-delay-2 nd-animate-fade-in-up"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-xl)",
                  maxWidth: "520px",
                  lineHeight: 1.7,
                  fontSize: "15px",
                  opacity: 0.8,
                }}
              >
                {producto.descripcion}
              </p>


              {/* Variant Selector */}
              <VariantSelector
                productId={producto.id}
                productSlug={producto.slug}
                productName={producto.nombre}
                productMarca={producto.marca}
                productImage={producto.imagenes[0] || ""}
                variantes={producto.variantes}
              />

              {/* Trust Information Section - Compact & Below CTA */}
              <div className="flex flex-col gap-4 mt-12 nd-delay-3 nd-animate-fade-in-up border-t border-white/5 pt-8">
                {/* 100% Original Guarantee */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 group transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] flex-shrink-0 shadow-[0_0_15px_rgba(211,176,0,0.1)]">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] font-semibold text-white tracking-wide uppercase" style={{ fontFamily: "var(--font-display)" }}>Garantía 100% Original</p>
                    <p className="text-[12px] text-white/50 leading-relaxed">Cada gota proviene directamente del frasco de autor. Autenticidad certificada.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Payment Methods */}
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-500 hover:bg-white/[0.04]">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 flex-shrink-0">
                      <CreditCard size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-white/90 mb-1">Pago Seguro</p>
                      <p className="text-[11px] text-white/40 leading-tight">Procesado de forma segura por Mercado Pago.</p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-500 hover:bg-white/[0.04]">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 flex-shrink-0">
                      <Truck size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-white/90 mb-1">Envío a todo el país</p>
                      <p className="text-[11px] text-white/40 leading-tight">Despachos diarios por Correo Argentino / Andreani.</p>
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
