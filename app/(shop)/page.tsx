import { getProducts } from "@/lib/products";
import { HeroSection } from "@/components/home/HeroSection";
import { CatalogSection } from "@/components/product/CatalogSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SectionHeading } from "@/components/home/SectionHeading";
import { AboutSection } from "@/components/home/AboutSection";
import { FAQSection } from "@/components/home/FAQSection";

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

const HomePage = async () => {
  const productos = await getProducts();

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Product Grid Section */}
      <section
        id="productos"
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
