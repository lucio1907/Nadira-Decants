"use client";

import { useState } from "react";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { SectionHeading } from "./SectionHeading";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "¿Qué es un decant?",
    answer: "Un decant es una porción de un perfume original que se trasvasa de su frasco original a un atomizador más pequeño (2ml, 5ml o 10ml). Es la forma ideal de probar una fragancia de lujo antes de comprar el frasco completo.",
  },
  {
    question: "¿Los perfumes son originales?",
    answer: "Sí, absolutamente. En Nadira garantizamos que cada decant proviene 100% de frascos originales y auténticos. No utilizamos réplicas ni imitaciones bajo ninguna circunstancia.",
  },
  {
    question: "¿Qué tamaños ofrecen?",
    answer: "Ofrecemos presentaciones de 2ml (aprox. 30 atomizaciones), 5ml (aprox. 75 atomizaciones) y 10ml (aprox. 150 atomizaciones), todos en envases de vidrio con atomizador de alta calidad.",
  },
  {
    question: "¿Cómo se preparan los decants?",
    answer: "Cada decant se prepara de forma artesanal y bajo pedido, utilizando herramientas de precisión para asegurar que la fragancia mantenga todas sus propiedades y notas originales sin contaminación externa.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer: "Sí, realizamos envíos a toda la Argentina a través de Correo Argentino. También ofrecemos opciones de retiro en puntos de entrega seleccionados en nuestra zona.",
  },
  {
    question: "¿Cuáles son los medios de pago?",
    answer: "Aceptamos todas las tarjetas de crédito y débito a través de Mercado Pago, transferencia bancaria con descuento y efectivo para retiros personales.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="transition-colors duration-500 ease-in-out"
      style={{
        background: "var(--surface-raised)",
        padding: "var(--space-4xl) 0",
      }}
    >
      <div className="container-nd max-w-3xl">
        <SectionHeading
          tag="Preguntas frecuentes"
          title="Resolvemos tus dudas"
          subtitle="Todo lo que necesitás saber sobre la experiencia Nadira y nuestros decants."
        />

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div
                className="nd-card overflow-hidden"
                style={{
                  padding: "0",
                  cursor: "pointer",
                  background: openIndex === index ? "var(--surface)" : "transparent",
                  borderColor: openIndex === index ? "var(--border-visible)" : "var(--border)",
                }}
                onClick={() => toggleFAQ(index)}
              >
                <div
                  className="flex items-center justify-between"
                  style={{ padding: "var(--space-md) var(--space-lg)" }}
                >
                  <h3
                    className="text-subheading"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: openIndex === index ? "var(--accent)" : "var(--text-display)",
                      transition: "color var(--duration-normal) ease",
                    }}
                  >
                    {faq.question}
                  </h3>
                  <span
                    style={{
                      transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform var(--duration-normal) ease",
                      fontSize: "24px",
                      lineHeight: 1,
                      color: "var(--text-secondary)",
                    }}
                  >
                    +
                  </span>
                </div>

                <div
                  style={{
                    maxHeight: openIndex === index ? "200px" : "0",
                    opacity: openIndex === index ? 1 : 0,
                    overflow: "hidden",
                    transition: "all var(--duration-normal) ease-in-out",
                  }}
                >
                  <div
                    className="text-nd-body"
                    style={{
                      padding: "0 var(--space-lg) var(--space-md) var(--space-lg)",
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                    }}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
