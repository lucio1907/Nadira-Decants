"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Copy, CheckCheck, Sparkles } from "lucide-react";

const PROMO_SEEN_KEY = "nadira-promo-seen";

interface PromoCoupon {
  id: string;
  codigo: string;
  tipo: "porcentaje" | "fijo";
  valor: number;
  minimo_compra: number | null;
}

export function PromoModal() {
  const router = useRouter();
  const [coupon, setCoupon] = useState<PromoCoupon | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    async function fetchPromo() {
      try {
        const seenId = localStorage.getItem(PROMO_SEEN_KEY);
        const res = await fetch("/api/coupons/promo");
        if (!res.ok) return;

        const data: PromoCoupon | null = await res.json();
        if (!data || seenId === data.id) return;

        setCoupon(data);
        setIsRendered(true);
        timeout = setTimeout(() => setIsVisible(true), 900);
      } catch {
        // fail silently — never block the page
      }
    }

    fetchPromo();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isRendered) return;
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible, isRendered]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    if (coupon) localStorage.setItem(PROMO_SEEN_KEY, coupon.id);
    setTimeout(() => setIsRendered(false), 600);
  }, [coupon]);

  const copyCode = useCallback(() => {
    if (!coupon) return;
    navigator.clipboard.writeText(coupon.codigo).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [coupon]);

  const copyAndDismiss = useCallback(() => {
    copyCode();
    setTimeout(() => {
      dismiss();
      router.push("/#productos");
    }, 700);
  }, [copyCode, dismiss, router]);

  if (!isRendered || !coupon) return null;

  const discountText =
    coupon.tipo === "porcentaje"
      ? `${coupon.valor}% OFF`
      : `$${coupon.valor.toLocaleString("es-AR")} OFF`;

  return (
    <div
      className={`
        fixed inset-0 z-[9998]
        flex items-end sm:items-center justify-center
        sm:p-6
        transition-[opacity,backdrop-filter] duration-500
        ${isVisible
          ? "opacity-100 backdrop-blur-sm pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }
      `}
      style={{ backgroundColor: isVisible ? "rgba(0,0,0,0.70)" : "transparent" }}
      onClick={dismiss}
    >
      {/*
        Mobile  → slides up from off-screen (translate-y-full → translate-y-0)
        Desktop → subtle scale + drop  (sm:translate-y-5 sm:scale-95 → sm:translate-y-0 sm:scale-100)
        The sm: overrides the base translate-y-full at ≥640 px.
      */}
      <div
        className={`
          relative w-full sm:max-w-[440px]
          max-h-[92dvh] sm:max-h-none
          overflow-y-auto overscroll-contain
          rounded-t-[1.5rem] sm:rounded-[3px]
          transition-all duration-[480ms] ease-[cubic-bezier(0.34,1.45,0.64,1)]
          ${isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-full sm:translate-y-5 sm:scale-[0.94] opacity-0"
          }
        `}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-visible)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Mobile drag-handle ────────────────────────────── */}
        <div className="sm:hidden flex justify-center pt-3.5 pb-1">
          <div
            className="w-9 h-[3px] rounded-full"
            style={{ background: "var(--border-visible)" }}
          />
        </div>

        {/* ── Desktop gold accent line ───────────────────────── */}
        <div
          className="hidden sm:block absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--accent) 40%, var(--accent) 60%, transparent 100%)",
          }}
        />

        {/* ── Close button ──────────────────────────────────── */}
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:bg-white/5 z-10"
          style={{ color: "var(--text-disabled)" }}
        >
          <X size={18} />
        </button>

        {/* ── Content ───────────────────────────────────────── */}
        <div
          className="
            flex flex-col items-center text-center
            gap-5 sm:gap-6
            px-6 pt-5 pb-8
            sm:px-10 sm:pt-10 sm:pb-10
          "
          style={{
            paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))",
          }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--accent-subtle)" }}
          >
            <Sparkles
              className="w-5 h-5 sm:w-6 sm:h-6"
              style={{ color: "var(--accent)" }}
            />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <p
              className="text-[9px] uppercase tracking-[0.35em] font-bold"
              style={{ color: "var(--accent)" }}
            >
              Oferta exclusiva · Solo ahora
            </p>
            <h2
              className="font-display text-[1.75rem] sm:text-[2rem] leading-[1.1]"
              style={{ color: "var(--text-display)" }}
            >
              Tu descuento de bienvenida
            </h2>
            <p
              className="text-sm leading-relaxed max-w-[22rem] mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Esta pantalla no vuelve a aparecer. Copiá el código y usalo en tu compra.
            </p>
          </div>

          {/* Discount badge */}
          <div
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full"
            style={{ background: "var(--accent-subtle)" }}
          >
            <span
              className="font-display text-[2.1rem] sm:text-[2.5rem] font-bold leading-none tracking-wide"
              style={{ color: "var(--accent)" }}
            >
              {discountText}
            </span>
          </div>

          {/* Coupon code block */}
          <div
            className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4"
            style={{
              background: "var(--surface-raised)",
              border: "1.5px dashed rgba(211,176,0,0.35)",
              borderRadius: "3px",
            }}
          >
            <span
              className="
                font-mono font-bold uppercase select-all flex-1 text-left
                text-[0.9rem] tracking-[0.16em]
                sm:text-[1.05rem] sm:tracking-[0.22em]
                truncate
              "
              style={{ color: "var(--text-display)" }}
            >
              {coupon.codigo}
            </span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 font-bold uppercase tracking-widest transition-all duration-300 shrink-0 min-h-[2.5rem] sm:min-h-0"
              style={{
                fontSize: "10px",
                background: copied ? "rgba(74,158,92,0.12)" : "var(--accent-subtle)",
                color: copied ? "#4A9E5C" : "var(--accent)",
                border: `1px solid ${copied ? "rgba(74,158,92,0.3)" : "rgba(211,176,0,0.3)"}`,
                borderRadius: "2px",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
              <span>{copied ? "Copiado" : "Copiar"}</span>
            </button>
          </div>

          {/* Minimum purchase */}
          {coupon.minimo_compra && coupon.minimo_compra > 0 && (
            <p
              className="text-[11px] -mt-1.5"
              style={{ color: "var(--text-disabled)" }}
            >
              Válido en compras mayores a ${coupon.minimo_compra.toLocaleString("es-AR")}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
            <button
              onClick={copyAndDismiss}
              className="nd-btn-primary flex-1 flex items-center justify-center gap-2 min-h-[3rem] sm:min-h-0"
            >
              <Copy size={14} />
              <span>Copiar y explorar</span>
            </button>
            <button
              onClick={dismiss}
              className="nd-btn-secondary flex-1 min-h-[3rem] sm:min-h-0"
              style={{ fontSize: "11px", letterSpacing: "0.15em", color: "var(--text-disabled)" }}
            >
              No gracias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
