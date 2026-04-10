"use client";

import { ScrollReveal } from "@/hooks/useScrollAnimation";

interface FeatureGridProps {
  features: { title: string; desc: string; icon: string }[];
}

export const FeatureGrid = ({ features }: FeatureGridProps) => {
  return (
    <div className="relative">
      {/* Vertical connecting line — desktop only */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 z-0">
        <div
          className="w-full h-full"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--accent), transparent)",
            opacity: 0.12,
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
        {features.map((feature, i) => (
          <ScrollReveal key={i} delay={i * 0.15}>
            <div
              className="flex flex-col items-center text-center group"
              style={{
                padding: "var(--space-md)",
                // Staggered vertical offset for asymmetric composition
                transform: i === 1 ? "translateY(40px)" : i === 2 ? "translateY(16px)" : "translateY(0)",
              }}
            >
              {/* Elegant numeral with serif */}
              <div
                className="flex items-center justify-center mb-6 transition-all duration-500 ease-in-out group-hover:-translate-y-1 relative"
                style={{
                  width: "64px",
                  height: "64px",
                }}
              >
                {/* Subtle ring */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-700"
                  style={{
                    border: "1px solid var(--accent)",
                    opacity: 0.3,
                    transform: "scale(1)",
                  }}
                />
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    boxShadow: "0 0 30px rgba(211, 176, 0, 0.15)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    color: "var(--accent)",
                    lineHeight: 1,
                    fontWeight: 400,
                    fontStyle: "italic",
                  }}
                >
                  {feature.icon}
                </span>
              </div>

              {/* Small golden accent line */}
              <div
                className="w-8 h-[1px] mb-6 transition-all duration-500 group-hover:w-12"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  opacity: 0.4,
                }}
              />

              {/* Title — now serif via CSS */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--text-display)",
                  marginBottom: "12px",
                  fontStyle: "normal",
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--body-sm)",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  maxWidth: "280px",
                  opacity: 0.8,
                }}
              >
                {feature.desc}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};
