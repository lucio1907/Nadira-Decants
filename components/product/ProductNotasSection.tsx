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
      className="nd-grain pt-24 pb-32 md:pt-32 md:pb-48"
      style={{
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background element */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-[var(--accent)] to-transparent opacity-20"
        style={{ zIndex: 0 }}
      />
      <div className="container-nd max-w-4xl mx-auto">
        {/* Title — Playfair for the surprise moment */}
        <ScrollReveal>
          <div className="text-center mb-24 md:mb-32">
            <h2
              className="text-display-md lg:text-display-lg"
              style={{
                fontFamily: "var(--font-display)",
                marginBottom: "var(--space-md)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Pirámide Olfativa
            </h2>
            <div className="w-12 h-1 bg-[var(--accent)] mx-auto opacity-60" />
          </div>
        </ScrollReveal>

        {/* Nota groups — stat-row layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {notaGroups.map((group, i) => (
            <ScrollReveal key={group.key} delay={i * 0.1}>
              <div
                className="group"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-lg)",
                  padding: "var(--space-2xl) 0",
                  borderBottom:
                    i < notaGroups.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {/* Row top: label + desc */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-[var(--accent)] opacity-40 group-hover:w-12 transition-all duration-500" />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: group.textColor,
                        fontWeight: 600,
                      }}
                    >
                      {group.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "var(--text-disabled)",
                      fontStyle: "italic",
                      opacity: 0.8,
                    }}
                  >
                    {group.desc}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {notas[group.key].map((nota) => (
                    <span 
                      key={nota} 
                      className="nd-tag text-[13px] px-6 py-2.5 border-[var(--border-visible)] hover:border-[var(--accent)] hover:text-[var(--text-display)] transition-all duration-300"
                      style={{ borderRadius: "2px" }}
                    >
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
