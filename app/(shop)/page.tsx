import { getProducts } from "@/lib/products";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCard } from "@/components/product/ProductCard";
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {productos.map((producto, i) => (
              <ProductCard key={producto.id} producto={producto} index={i} />
            ))}
          </div>
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

      {/* CTA Section — minimal */}
      <section
        className="transition-colors duration-500 ease-in-out"
        style={{
          background: "var(--surface)",
          padding: "120px 0",
        }}
      >
        <div className="container-nd text-center max-w-2xl mx-auto">
          <p
            className="text-nd-label"
            style={{
              marginBottom: "var(--space-md)",
              color: "var(--accent)",
            }}
          >
            ¿Listo para descubrir?
          </p>
          <h2
            className="text-display-md"
            style={{ marginBottom: "var(--space-xl)", fontWeight: 400 }}
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
