import { getProducts } from "@/lib/products";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCard } from "@/components/product/ProductCard";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SectionHeading } from "@/components/home/SectionHeading";
import { AboutSection } from "@/components/home/AboutSection";

const features = [
  {
    title: "Originales",
    desc: "Cada decant proviene directamente del frasco original. Garantía de autenticidad absoluta.",
    icon: "I",
  },
  {
    title: "Accesibles",
    desc: "Desde 2ml. Descubrí tu perfume ideal sin el compromiso del frasco completo.",
    icon: "II",
  },
  {
    title: "Artesanales",
    desc: "Preparados con precisión, en atomizadores de vidrio de alta calidad.",
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
            subtitle="Cada decant es preparado con precisión artesanal, directo del frasco original."
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
            subtitle="Probá fragancias de lujo sin el compromiso del frasco completo."
          />
          <div className="mt-16">
            <FeatureGrid features={features} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

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
