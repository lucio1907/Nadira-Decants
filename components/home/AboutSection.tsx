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
              tag="Mi Esencia"
              title="El Arte de la Fragancia"
              subtitle={
                <>
                  En Nadira, elegir un perfume no es comprar a ciegas.
                  <br className="hidden sm:block" />{" "}
                  Podés probarlos en formato chico, ver cómo te quedan y decidir sin apuro cuál es para vos.
                </>
              }
              center={false}
            />

            <ScrollReveal delay={0.3}>
              <div className="space-y-6 text-nd-body max-w-xl">
                <p>
                  Nuestra selección no es azarosa: cada fragancia está aquí porque realmente vale la pena. No buscamos volumen, sino criterio y exclusividad en cada nota.
                </p>
                <p>
                  Garantizamos la autenticidad absoluta de nuestros decants, fraccionando perfumes originales con la máxima precisión en envases prácticos, diseñados para acompañarte y ser descubiertos en tu propia piel.
                </p>

                <div className="pt-8 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-nd-label mb-2" style={{ color: "var(--accent)" }}>Autenticidad</h4>
                    <p className="text-nd-body-sm">Todos los perfumes son originales. Probás exactamente lo que después comprarías en tamaño completo.</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-nd-label mb-2" style={{ color: "var(--accent)" }}>Pasión</h4>
                    <p className="text-nd-body-sm">Me gusta probar, comparar y recomendar. Por eso, si no sabés cuál elegir, te ayudo.</p>
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
                  quality={90}
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
