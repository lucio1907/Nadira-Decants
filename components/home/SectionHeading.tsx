"use client";

import { ScrollReveal } from "@/hooks/useScrollAnimation";

interface SectionHeadingProps {
  tag?: string;
  title: string;
  subtitle?: React.ReactNode;
  dark?: boolean;
  center?: boolean;
}

export const SectionHeading = ({
  tag,
  title,
  subtitle,
  center = true,
}: SectionHeadingProps) => {
  return (
    <div
      className={center ? "text-center flex flex-col items-center" : "text-left flex flex-col items-start"}
      style={{ marginBottom: "var(--space-2xl)" }}
    >
      {tag && (
        <ScrollReveal delay={0}>
          <p className="text-nd-label tracking-widest" style={{ marginBottom: "20px", color: "var(--accent)" }}>
            {tag}
          </p>
        </ScrollReveal>
      )}

      {/* Decorative golden line above title */}
      <ScrollReveal delay={0.05}>
        <div
          className="mb-6"
          style={{
            width: center ? "48px" : "40px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
            opacity: 0.5,
          }}
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2
          className="text-heading"
          style={{
            marginBottom: subtitle ? "24px" : 0,
            fontWeight: 400,
            fontStyle: "normal",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal delay={0.2}>
          <p
            className="text-nd-body"
            style={{
              color: "var(--text-secondary)",
              maxWidth: center ? "500px" : "480px",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
};
