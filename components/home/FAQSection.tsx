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

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      role="region"
      aria-label="Preguntas frecuentes sobre decants de perfumes"
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
          subtitle="Respuestas claras para que elijas con seguridad."
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
                  <div className="flex items-center gap-4">
                    {/* Editorial numbering */}
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "13px",
                        fontStyle: "italic",
                        color: openIndex === index ? "var(--accent)" : "var(--text-disabled)",
                        transition: "color var(--duration-normal) ease",
                        minWidth: "28px",
                        fontWeight: 400,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
                  </div>

                  {/* Elegant rotating line icon */}
                  <div
                    className="relative flex-shrink-0"
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    {/* Horizontal line */}
                    <span
                      className="absolute top-1/2 left-1/2 block"
                      style={{
                        width: "14px",
                        height: "1px",
                        background: openIndex === index ? "var(--accent)" : "var(--text-secondary)",
                        transform: "translate(-50%, -50%)",
                        transition: "background var(--duration-normal) ease",
                      }}
                    />
                    {/* Vertical line — rotates to 0 when open */}
                    <span
                      className="absolute top-1/2 left-1/2 block"
                      style={{
                        width: "14px",
                        height: "1px",
                        background: openIndex === index ? "var(--accent)" : "var(--text-secondary)",
                        transform: openIndex === index
                          ? "translate(-50%, -50%) rotate(0deg)"
                          : "translate(-50%, -50%) rotate(90deg)",
                        transition: "all var(--duration-normal) cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>
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
                      paddingLeft: "calc(var(--space-lg) + 44px)", // Align with question text
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
