"use client";

import { ScrollReveal } from "@/hooks/useScrollAnimation";

interface Props {
  notas: {
    salida: string[];
    corazon: string[];
    fondo: string[];
  };
}

const notaGroups = [
  {
    key: "salida" as const,
    label: "NOTAS DE SALIDA",
    desc: "La primera impresión",
    textColor: "var(--text-primary)",
  },
  {
    key: "corazon" as const,
    label: "NOTAS DE CORAZÓN",
    desc: "El alma de la fragancia",
    textColor: "var(--text-secondary)",
  },
  {
    key: "fondo" as const,
    label: "NOTAS DE FONDO",
    desc: "La estela que perdura",
    textColor: "var(--text-disabled)",
  },
];

export const ProductNotasSection = ({ notas }: Props) => {
  return (
    <section
      className="transition-colors duration-500 ease-in-out py-16 md:py-24 lg:py-32"
      style={{
        background: "var(--surface)",
      }}
    >
      <div className="container-nd max-w-4xl mx-auto">
        {/* Title — Playfair for the surprise moment */}
        <ScrollReveal>
          <div className="text-center md:text-left">
            <h2
              className="text-display-md"
              style={{
                fontFamily: "var(--font-display)",
                marginBottom: "var(--space-2xl)",
                fontWeight: 400,
              }}
            >
              Pirámide Olfativa
            </h2>
          </div>
        </ScrollReveal>

        {/* Nota groups — stat-row layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {notaGroups.map((group, i) => (
            <ScrollReveal key={group.key} delay={i * 0.1}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-md)",
                  padding: "var(--space-xl) 0",
                  borderBottom:
                    i < notaGroups.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {/* Row top: label + desc */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: group.textColor,
                      fontWeight: 500,
                    }}
                  >
                    {group.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "var(--text-disabled)",
                      fontStyle: "italic",
                    }}
                  >
                    {group.desc}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mt-2">
                  {notas[group.key].map((nota) => (
                    <span key={nota} className="nd-tag text-[12px] px-4 py-2 border-[var(--border-visible)]">
                      {nota}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
