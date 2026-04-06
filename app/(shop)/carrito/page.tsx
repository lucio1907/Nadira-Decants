"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

const CarritoPage = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          paddingTop: "80px",
          minHeight: "100vh",
          background: "var(--black)",
        }}
      >
        <span className="nd-loading nd-loading-blink">[ CARGANDO... ]</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center px-5"
        style={{
          paddingTop: "80px",
          minHeight: "100svh",
          background: "var(--black)",
        }}
      >
        <div className="text-center nd-animate-fade-in-up" style={{ maxWidth: "400px" }}>
          {/* Empty icon */}
          <div
            className="mx-auto"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              border: "1px solid var(--border-visible)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "var(--space-lg)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-disabled)" }}
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>

          <h1
            className="text-heading"
            style={{ marginBottom: "var(--space-sm)" }}
          >
            Carrito vacío
          </h1>
          <p
            className="text-nd-body"
            style={{
              color: "var(--text-secondary)",
              marginBottom: "var(--space-xl)",
            }}
          >
            Explorá nuestro catálogo para encontrar tu fragancia ideal.
          </p>
          <Link href="/#productos" className="nd-btn-primary">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--black)" }}>
      <div className="container-nd" style={{ padding: "var(--space-2xl) var(--space-md)" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          <h1 className="text-heading">Tu carrito</h1>
          <button
            onClick={clearCart}
            className="nd-btn-ghost"
            style={{
              color: "var(--text-disabled)",
              fontSize: "var(--label)",
            }}
            id="clear-cart-btn"
          >
            Vaciar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2">
            {items.map((item, i) => (
              <div
                key={`${item.id}-${item.variante.ml}`}
                className="nd-row nd-animate-fade-in"
                style={{
                  alignItems: "center",
                  gap: "var(--space-md)",
                  padding: "var(--space-md) 0",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Product icon */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "24px",
                      borderRadius: "3px",
                      border: "1px solid var(--border-visible)",
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="text-nd-label"
                    style={{
                      color: "var(--text-disabled)",
                      marginBottom: "2px",
                    }}
                  >
                    {item.marca}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--body)",
                      fontWeight: 500,
                      color: "var(--text-display)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.nombre}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--caption)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.variante.ml}ml
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.variante.ml,
                        item.quantity - 1
                      )
                    }
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      border: "1px solid var(--border-visible)",
                      background: "transparent",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      transition: "border-color 250ms, color 250ms",
                    }}
                    id={`qty-minus-${item.id}-${item.variante.ml}`}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--body)",
                      color: "var(--text-display)",
                      width: "24px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.variante.ml,
                        item.quantity + 1
                      )
                    }
                    disabled={item.quantity >= item.variante.stock}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      border: "1px solid var(--border-visible)",
                      background: "transparent",
                      color: item.quantity >= item.variante.stock ? "var(--text-disabled)" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: item.quantity >= item.variante.stock ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      transition: "border-color 250ms, color 250ms",
                      opacity: item.quantity >= item.variante.stock ? 0.5 : 1,
                    }}
                    title={item.quantity >= item.variante.stock ? "Stock máximo alcanzado" : ""}
                    id={`qty-plus-${item.id}-${item.variante.ml}`}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="hidden sm:block text-right" style={{ minWidth: "80px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--body)",
                      color: "var(--text-display)",
                    }}
                  >
                    ${(item.variante.precio * item.quantity).toLocaleString("es-AR")}
                  </p>
                  {item.quantity > 1 && (
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--label)",
                        color: "var(--text-disabled)",
                      }}
                    >
                      ${item.variante.precio.toLocaleString("es-AR")} c/u
                    </p>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id, item.variante.ml)}
                  aria-label="Eliminar"
                  id={`remove-${item.id}-${item.variante.ml}`}
                  style={{
                    color: "var(--text-disabled)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    transition: "color 250ms",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--text-disabled)")
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div
              className="nd-card sticky"
              style={{
                top: "72px",
                padding: "var(--space-lg)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--label)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-lg)",
                }}
              >
                Resumen
              </h2>

              <div style={{ marginBottom: "var(--space-lg)" }}>
                {items.map((item) => (
                  <div
                    key={`summary-${item.id}-${item.variante.ml}`}
                    className="flex justify-between gap-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--caption)",
                      padding: "var(--space-xs) 0",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.nombre} ({item.variante.ml}ml) × {item.quantity}
                    </span>
                    <span
                      style={{
                        color: "var(--text-primary)",
                        flexShrink: 0,
                      }}
                    >
                      ${(item.variante.precio * item.quantity).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="nd-divider"
                style={{ marginBottom: "var(--space-md)" }}
              />

              <div
                className="flex justify-between items-baseline"
                style={{ marginBottom: "var(--space-lg)" }}
              >
                <span className="text-nd-label" style={{ color: "var(--text-secondary)" }}>
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--heading)",
                    color: "var(--text-display)",
                  }}
                >
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>

              <Link
                href="/checkout"
                className="nd-btn-primary"
                style={{ width: "100%", textAlign: "center" }}
                id="checkout-btn"
              >
                Ir al checkout
              </Link>

              <Link
                href="/#productos"
                className="block text-center"
                style={{
                  marginTop: "var(--space-md)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--caption)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 250ms",
                }}
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarritoPage;
