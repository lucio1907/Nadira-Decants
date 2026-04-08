"use client";

import { useState } from "react";
import { Variante } from "@/types";
import { useCartStore } from "@/store/cart";

interface Props {
  productId: string;
  productSlug: string;
  productName: string;
  productMarca: string;
  productImage: string;
  variantes: Variante[];
}

export const VariantSelector = ({
  productId,
  productSlug,
  productName,
  productMarca,
  productImage,
  variantes,
}: Props) => {
  const [selected, setSelected] = useState<Variante>(variantes[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const cartItems = useCartStore((s) => s.items);

  const cartQuantity = cartItems.find(
    (item) => item.id === productId && item.variante.ml === selected.ml
  )?.quantity || 0;

  const isMaxStockReached = cartQuantity >= selected.stock;

  const handleAddToCart = () => {
    addItem({
      id: productId,
      slug: productSlug,
      nombre: productName,
      marca: productMarca,
      imagen: productImage,
      variante: selected,
    });
    setAdded(true);
    openCart(); // Open sidebar automatically
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      {/* Label */}
      <p
        className="text-nd-label mb-4 tracking-[0.1em]"
        style={{
          color: "var(--text-secondary)",
        }}
      >
        Tamaño
      </p>

      {/* Variant Segments */}
      <div
        className="flex flex-wrap gap-3"
        style={{ marginBottom: "var(--space-xl)" }}
      >
        {variantes.map((v) => (
          <button
            key={v.ml}
            onClick={() => setSelected(v)}
            disabled={v.stock === 0}
            className={`nd-segment overflow-hidden transition-all duration-300 ease-in-out py-3 px-4 md:py-4 md:px-6 ${
              selected.ml === v.ml ? "nd-segment-active" : ""
            } ${v.stock === 0 ? "nd-segment-disabled opacity-50 grayscale" : ""}`}
            style={{
              flexDirection: "column",
              gap: "4px",
              position: "relative",
              borderRadius: "4px",
            }}
            id={`variant-${v.ml}ml`}
          >
            <span style={{ fontSize: "14px", fontWeight: 500, fontFamily: "var(--font-body)" }}>{v.ml}ML</span>
            <span
              style={{
                fontSize: "12px",
                opacity: 0.8,
                fontFamily: "var(--font-body)",
                fontWeight: 400,
              }}
            >
              ${v.precio.toLocaleString("es-AR")}
            </span>

            {/* Low stock — subtle text */}
            {v.stock <= 3 && v.stock > 0 && selected.ml === v.ml && (
             <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent)] rounded-full m-2" title={`Solo ${v.stock} disponibles`} />
            )}

            {/* Out of stock overlay */}
            {v.stock === 0 && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] bg-opacity-80"
              >
                  <span className="text-[10px] tracking-widest uppercase text-[var(--text-secondary)] font-medium">Agotado</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Stock info */}
      {selected.stock > 0 && (
        <p
          className="nd-animate-fade-in"
          key={`stock-${selected.ml}-${selected.stock}`} // Re-trigger animation on change
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--accent)",
            marginBottom: "var(--space-md)",
            letterSpacing: "0.05em",
            fontWeight: 400,
          }}
        >
          {selected.stock === 1 
            ? "Última unidad disponible" 
            : `Stock: ${selected.stock} unidades disponibles`}
        </p>
      )}

      {/* Price display */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <span
          className="text-[32px] sm:text-[40px] md:text-[56px]"
          style={{
            fontFamily: "var(--font-display)",
            lineHeight: 1,
            color: "var(--text-display)",
          }}
        >
          ${selected.precio.toLocaleString("es-AR")}
        </span>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={selected.stock === 0 || isMaxStockReached}
        className={added ? "" : (selected.stock === 0 || isMaxStockReached) ? "" : "nd-btn-primary"}
        style={{
          width: "100%",
          minHeight: "56px",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 500,
          border: added ? "1px solid var(--success)" : "none",
          cursor: (selected.stock === 0 || isMaxStockReached) ? "not-allowed" : "pointer",
          transition: "all 400ms ease",
          ...(added
            ? {
                background: "transparent",
                color: "var(--success)",
              }
            : (selected.stock === 0 || isMaxStockReached)
            ? {
                background: "var(--border)",
                color: "var(--text-disabled)",
              }
            : {}),
        }}
        id="add-to-cart-btn"
      >
        {added
          ? "Añadido exitosamente"
          : selected.stock === 0
          ? "No disponible"
          : isMaxStockReached
          ? "Stock máximo en carrito"
          : "Agregar al bolso"}
      </button>
    </div>
  );
};
