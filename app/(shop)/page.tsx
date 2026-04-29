import { getProducts } from "@/lib/products";
import { HeroSection } from "@/components/home/HeroSection";
import { CatalogSection } from "@/components/product/CatalogSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SectionHeading } from "@/components/home/SectionHeading";
import { AboutSection } from "@/components/home/AboutSection";
import { FAQSection } from "@/components/home/FAQSection";
import { JsonLd } from "@/components/common/JsonLd";

const SITE_URL = "https://nadiradecants.com.ar";

const features = [
  {
    title: "Originales",
    desc: "Todos los decants son de frascos originales. Probás el perfume real, tal como es.",
    icon: "I",
  },
  {
    title: "Accesibles",
    desc: "Formato 5 ml, ideal para probar sin gastar de más. Elegí con seguridad antes de comprar el frasco completo.",
    icon: "II",
  },
  {
    title: "Cuidado en cada detalle",
    desc: "Fraccionados con cuidado, en atomizadores de vidrio de buena calidad.",
    icon: "III",
  },
];

// FAQ data — used for both rendering and JSON-LD
const faqItems = [
  {
    question: "¿Qué es un decant?",
    answer: "Es una porción de un perfume original, fraccionada en un envase más chico. Permite probar la fragancia antes de decidir si querés comprar el frasco completo.",
  },
  {
    question: "¿Los perfumes son originales?",
    answer: "Sí. Todos los decants provienen de frascos originales. No hay mezclas ni imitaciones: probás el perfume tal como es.",
  },
  {
    question: "¿Qué tamaños ofrecen?",
    answer: "Actualmente los decants son de 5 ml, un formato ideal para probar el perfume y conocerlo bien antes de invertir en el tamaño completo.",
  },
  {
    question: "¿Cómo se preparan los decants?",
    answer: "Se fraccionan con cuidado directamente desde el frasco original, utilizando atomizadores de vidrio prácticos y de buena calidad.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer: "Sí, realizo envíos a todo el país a través de correo Argentino. El costo y el tiempo de entrega se calculan al momento de la compra.",
  },
  {
    question: "¿Cuáles son los medios de pago?",
    answer: "Podés pagar de forma segura a través de plataformas online, como Mercado Pago, transferencia bancaria 10 % descuento.",
  },
];

const HomePage = async () => {
  const productos = await getProducts();

  // JSON-LD: FAQPage schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // JSON-LD: ItemList schema for product catalog
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de Decants de Perfumes de Lujo — Nadira",
    description: "Todos los decants son de frascos originales. Probás el perfume real, sin gastar de más.",
    numberOfItems: productos.length,
    itemListElement: productos.map((producto, index) => {
      const lowestPrice = producto.variantes.length > 0
        ? Math.min(...producto.variantes.map((v) => v.precio))
        : 0;
      const totalStock = producto.variantes.reduce((acc, v) => acc + (v.stock || 0), 0);

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: `${producto.nombre} — ${producto.marca}`,
          description: producto.descripcion,
          url: `${SITE_URL}/producto/${producto.slug}`,
          image: producto.imagenes?.[0] || "",
          brand: {
            "@type": "Brand",
            name: producto.marca,
          },
          offers: {
            "@type": "Offer",
            price: lowestPrice,
            priceCurrency: "ARS",
            availability: totalStock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/producto/${producto.slug}`,
            seller: {
              "@type": "Organization",
              name: "Nadira Decants",
            },
          },
        },
      };
    }),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <JsonLd data={faqJsonLd} />
      <JsonLd data={itemListJsonLd} />

      {/* Hero */}
      <HeroSection />

      {/* Product Grid Section */}
      <section
        id="productos"
        aria-label="Catálogo de perfumes"
        className="transition-colors duration-500 ease-in-out"
        style={{
          background: "var(--surface)",
          padding: "var(--space-4xl) 0",
        }}
      >
        <div className="container-nd">
          <SectionHeading
            tag="Nuestra colección"
            title="Catálogo"
            subtitle="Todos los decants son de frascos originales. Probás el perfume real, sin gastar de más."
          />

          <CatalogSection productos={productos} />
        </div>
      </section>

      {/* Feature Section */}
      <section
        aria-label="Beneficios de Nadira Decants"
        className="transition-colors duration-500 ease-in-out"
        style={{
          background: "var(--surface-raised)",
          padding: "var(--space-4xl) 0",
        }}
      >
        <div className="container-nd">
          <SectionHeading
            tag="La experiencia Nadira"
            title="El arte del decant"
            subtitle="Elegir un perfume no debería ser a ciegas. Acá podés probar, comparar y encontrar el tuyo."
          />
          <div className="mt-16">
            <FeatureGrid features={features} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section — dramatic editorial */}
      <section
        aria-label="Llamada a la acción"
        className="transition-colors duration-500 ease-in-out relative overflow-hidden"
        style={{
          background: "var(--surface)",
          padding: "160px 0",
        }}
      >
        {/* Golden ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(211, 176, 0, 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="container-nd text-center max-w-2xl mx-auto relative z-10">
          <p
            className="text-nd-label"
            style={{
              marginBottom: "var(--space-md)",
              color: "var(--accent)",
            }}
          >
            ¿Listo para descubrir?
          </p>

          {/* Decorative line */}
          <div
            className="mx-auto mb-8"
            style={{
              width: "48px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
              opacity: 0.5,
            }}
          />

          <h2
            className="text-display-md lg:text-display-lg"
            style={{
              marginBottom: "var(--space-xl)",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
            }}
          >
            Tu fragancia ideal te espera
          </h2>
          <a href="#productos" className="nd-btn-primary px-10">
            Explorar Colección
          </a>
        </div>
      </section>
    </>
  );
};

export default HomePage;
