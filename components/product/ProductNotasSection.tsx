import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { Wind, Flower2, Gem } from "lucide-react";

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
    label: "Notas de Salida",
    desc: "La primera impresión (0 - 15 min)",
    icon: Wind,
    color: "#ffde59", // Brighter gold
    glowColor: "rgba(255, 222, 89, 0.15)",
  },
  {
    key: "corazon" as const,
    label: "Notas de Corazón",
    desc: "El alma de la fragancia (15 min - 4h)",
    icon: Flower2,
    color: "#d3b000", // Standard accent
    glowColor: "rgba(211, 176, 0, 0.12)",
  },
  {
    key: "fondo" as const,
    label: "Notas de Fondo",
    desc: "La estela que perdura (4h - 12h+)",
    icon: Gem,
    color: "#b39600", // Deeper bronze
    glowColor: "rgba(179, 150, 0, 0.1)",
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
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent)] opacity-[0.02] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container-nd max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20 md:mb-28">
            <p className="text-nd-label mb-4" style={{ color: "var(--accent)" }}>Explora la esencia</p>
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
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto opacity-60" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {notaGroups.map((group, i) => (
            <ScrollReveal key={group.key} delay={i * 0.15} className="h-full">
              <div
                className="group relative h-full"
                style={{ zIndex: 10 - i }}
              >
                {/* Stage Glow Background */}
                <div 
                  className="absolute inset-0 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: group.glowColor, borderRadius: "24px" }}
                />

                {/* Main Card */}
                <div className="nd-glass-raised p-8 md:p-10 rounded-[24px] border border-white/5 group-hover:border-white/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-full">
                  
                  {/* Subtle index number */}
                  <span className="absolute top-6 right-8 text-[64px] font-bold opacity-[0.03] select-none" style={{ fontFamily: "var(--font-display)" }}>
                    0{i + 1}
                  </span>

                  {/* Header: Icon + Label */}
                  <div className="flex flex-col gap-6 mb-8 relative">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{ 
                        background: `linear-gradient(135deg, ${group.color}22 0%, ${group.color}11 100%)`,
                        border: `1px solid ${group.color}33`,
                        color: group.color
                      }}
                    >
                      <group.icon size={28} strokeWidth={1.5} />
                    </div>
                    
                    <div>
                      <h3 
                        className="text-[18px] font-semibold mb-1 tracking-tight"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-display)" }}
                      >
                        {group.label}
                      </h3>
                      <p className="text-[12px] opacity-50 font-medium uppercase tracking-widest">{group.desc}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {notas[group.key].map((nota) => (
                      <span 
                        key={nota} 
                        className="nd-tag text-[11px] px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-[var(--accent-subtle)] hover:border-[var(--accent)] hover:text-[var(--text-display)] transition-all duration-300 backdrop-blur-sm"
                      >
                        {nota}
                      </span>
                    ))}
                  </div>

                  {/* Decorative corner accent */}
                  <div 
                    className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.05] translate-x-12 translate-y-12 rounded-full"
                    style={{ background: group.color }}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
