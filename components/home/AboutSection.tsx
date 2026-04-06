"use client";

import Image from "next/image";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "./SectionHeading";

export const AboutSection = () => {
  return (
    <section
      id="sobre-nosotros"
      className="transition-colors duration-500 ease-in-out overflow-hidden"
      style={{
        background: "var(--black)",
        padding: "var(--space-4xl) 0",
      }}
    >
      <div className="container-nd">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Column */}
          <div className="order-2 lg:order-1">
            <SectionHeading
              tag="Nuestra Esencia"
              title="El Arte de la Fragancia"
              subtitle="En Nadira, creemos que el lujo no debería ser inalcanzable. Nuestra misión es democratizar la alta perfumería a través del decantado artesanal."
              center={false}
            />

            <ScrollReveal delay={0.3}>
              <div className="space-y-8 text-nd-body max-w-xl">
                <p>
                  Cada fragancia en nuestra colección ha sido seleccionada por su carácter único y su historia. Entendemos que un perfume es una firma personal, y encontrar la ideal requiere tiempo y exploración.
                </p>
                <p>
                  Utilizamos solo atomizadores de vidrio de alta calidad y técnicas de decantado precisas que preservan la integridad de cada nota olfativa, directamente desde el frasco original hacia tu colección.
                </p>
                
                <div className="pt-8 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-nd-label mb-2" style={{ color: "var(--accent)" }}>Autenticidad</h4>
                    <p className="text-nd-body-sm">Garantizamos que cada gota es 100% original, sin alteraciones ni rellenos.</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-nd-label mb-2" style={{ color: "var(--accent)" }}>Pasión</h4>
                    <p className="text-nd-body-sm">Somos entusiastas que amamos compartir la magia de los aromas exclusivos.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Image Column */}
          <div className="order-1 lg:order-2 relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none">
            <ScrollReveal delay={0.4} className="h-full">
              <div className="relative h-full w-full overflow-hidden shadow-2xl">
                <Image
                  src="/images/about.jpg"
                  alt="Arte del decantado Nadira"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Subtle overlay for luxury feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/40 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating decorative element */}
              <div 
                className="absolute -bottom-6 -right-6 w-32 h-32 hidden lg:block border-[0.5px] border-[var(--accent)]/30 pointer-events-none" 
                style={{ zIndex: -1 }}
              />
               <div 
                className="absolute -top-6 -left-6 w-32 h-32 hidden lg:block border-[0.5px] border-[var(--accent)]/30 pointer-events-none" 
                style={{ zIndex: -1 }}
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
