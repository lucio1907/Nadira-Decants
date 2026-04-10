"use client";

import { ScrollReveal } from "@/hooks/useScrollAnimation";

interface FeatureGridProps {
  features: { title: string; desc: string; icon: string }[];
}

export const FeatureGrid = ({ features }: FeatureGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      {features.map((feature, i) => (
        <ScrollReveal key={i} delay={i * 0.15}>
          <div
            className="flex flex-col items-center text-center group"
            style={{
              padding: "var(--space-md)",
            }}
          >
            {/* Elegant Icon circle */}
            <div
              className="flex items-center justify-center rounded-full mb-6 transition-all duration-500 ease-in-out group-hover:-translate-y-1"
              style={{
                width: "56px",
                height: "56px",
                border: "1px solid var(--accent)",
                background: "transparent",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {feature.icon}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 500,
                color: "var(--text-display)",
                marginBottom: "12px",
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
  );
};
