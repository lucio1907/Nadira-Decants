"use client";

import { useState, useEffect } from "react";
import { Variante } from "@/types";
import { useCartStore } from "@/store/cart";
import { Toast } from "@/components/ui/Toast";
import { Check, ShoppingBag, Minus, Plus } from "lucide-react";

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
  const [showToast, setShowToast] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(variantes[0].precio);
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selected.ml]);

  // Price transition effect
  useEffect(() => {
    if (selected.precio !== displayPrice) {
      const duration = 300;
      const start = displayPrice;
      const end = selected.precio;
      const startTime = performance.now();

      const updatePrice = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        setDisplayPrice(current);

        if (progress < 1) {
          requestAnimationFrame(updatePrice);
        }
      };

      requestAnimationFrame(updatePrice);
    }
  }, [selected.precio, displayPrice]);

  const cartQuantity = cartItems.find(
    (item) => item.id === productId && item.variante.ml === selected.ml
  )?.quantity || 0;

  const maxCanAdd = selected.stock - cartQuantity;
  const isMaxStockReached = maxCanAdd <= 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: productId,
        slug: productSlug,
        nombre: productName,
        marca: productMarca,
        imagen: productImage,
        variante: selected,
      });
    }
    setAdded(true);
    setShowToast(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div>
      {/* Size label + stock indicator */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-nd-label tracking-[0.1em]"
          style={{ color: "var(--text-secondary)" }}
        >
          Tamaño
        </p>
        <div
          className="nd-animate-fade-in flex flex-col items-end gap-1.5"
          key={`stock-${selected.ml}-${selected.stock}`}
        >
          <div className="flex items-center gap-2.5">
            {selected.stock > 0 && selected.stock <= 5 && (
              <span 
                className={`w-2 h-2 rounded-full ${selected.stock === 1 ? "animate-pulse" : ""}`}
                style={{ 
                  background: "var(--accent)",
                  boxShadow: "0 0 10px var(--accent)",
                }}
              />
            )}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: selected.stock === 0 
                  ? "var(--error)" 
                  : selected.stock <= 5 
                    ? "var(--accent)" 
                    : "var(--text-disabled)",
                letterSpacing: "0.08em",
                fontWeight: selected.stock <= 5 ? 800 : 400,
                textTransform: "uppercase"
              }}
            >
              {selected.stock === 0
                ? "Agotado temporalmente"
                : selected.stock === 1 
                  ? "¡Última unidad disponible!" 
                  : selected.stock <= 5
                    ? `Solo ${selected.stock} unidades disponibles`
                    : `${selected.stock} unidades en stock`}
            </p>
          </div>
          
          {/* Subtle availability micro-bar for urgency */}
          {selected.stock > 0 && selected.stock <= 10 && (
            <div className="w-28 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${selected.stock <= 3 ? "animate-pulse" : ""}`}
                style={{ 
                  width: `${Math.min((selected.stock / 10) * 100, 100)}%`,
                  background: selected.stock <= 5 ? "var(--accent)" : "var(--text-disabled)",
                  opacity: selected.stock <= 5 ? 1 : 0.3
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Variant Segments — cleaner, wider pills */}
      <div
        className="flex flex-wrap gap-3"
        style={{ marginBottom: "var(--space-lg)" }}
      >
        {variantes.map((v, idx) => (
          <button
            key={`${v.ml}-${idx}`}
            onClick={() => setSelected(v)}
            disabled={v.stock === 0}
            className={`relative flex items-center justify-center transition-all duration-400 py-3.5 px-6 border ${
              selected.ml === v.ml 
                ? "border-[var(--accent)] bg-[var(--accent-subtle)]" 
                : "border-[var(--border-visible)] hover:border-[var(--text-disabled)] bg-transparent"
            } ${v.stock === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
            id={`variant-${v.ml}ml`}
          >
            <span 
              className="flex items-baseline gap-1.5"
              style={{ 
                fontFamily: "var(--font-body)",
                color: selected.ml === v.ml ? "var(--text-display)" : "var(--text-secondary)",
                transition: "color 300ms ease",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                {v.ml}
              </span>
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>
                ml
              </span>
            </span>

            {/* Price under size */}
            <span
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
              style={{
                fontSize: "10px",
                color: selected.ml === v.ml ? "var(--accent)" : "var(--text-disabled)",
                fontFamily: "var(--font-body)",
                transition: "color 300ms ease",
              }}
            >
              ${v.precio.toLocaleString("es-AR")}
            </span>
            
            {/* Active indicator dot */}
            {selected.ml === v.ml && (
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            )}

            {/* Out of stock line */}
            {v.stock === 0 && (
              <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-white/20 -rotate-12 pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* Spacer for price labels */}
      <div style={{ height: "12px" }} />

      {/* Price display — larger, editorial */}
      <div className="flex items-end gap-3 mb-6" key={selected.ml}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
            lineHeight: 1,
            color: "var(--text-display)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          ${displayPrice.toLocaleString("es-AR")}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "var(--text-disabled)",
            letterSpacing: "0.05em",
            paddingBottom: "6px",
          }}
        >
          ARS
        </span>
      </div>

      {/* Quantity + Add to Cart — combined row */}
      <div className="flex gap-3 items-stretch">
        {/* Quantity selector */}
        {!isMaxStockReached && selected.stock > 0 && (
          <div
            className="flex items-center gap-0 flex-shrink-0"
            style={{ border: "1px solid var(--border-visible)" }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-12 h-full flex items-center justify-center transition-all duration-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Disminuir cantidad"
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <div
              className="w-12 h-full flex items-center justify-center select-none"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-display)",
                borderLeft: "1px solid var(--border)",
                borderRight: "1px solid var(--border)",
              }}
            >
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(Math.min(maxCanAdd, quantity + 1))}
              disabled={quantity >= maxCanAdd}
              className="w-12 h-full flex items-center justify-center transition-all duration-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={selected.stock === 0 || isMaxStockReached}
          className={`relative overflow-hidden group flex-1 ${
            added 
              ? "bg-[var(--success)] text-white" 
              : selected.stock === 0 
                ? "bg-transparent border border-[var(--error-subtle)]" 
                : isMaxStockReached 
                  ? "bg-[var(--border)] cursor-not-allowed" 
                  : "nd-btn-primary"
          }`}
          style={{
            minHeight: "56px",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
            color: added 
              ? "white" 
              : selected.stock === 0 
                ? "var(--error)" 
                : isMaxStockReached 
                  ? "var(--text-disabled)" 
                  : "var(--black)",
          }}
          id="add-to-cart-btn"
        >
          <div className="flex items-center justify-center gap-3">
            {added ? (
              <>
                <Check size={17} strokeWidth={3} className="nd-animate-fade-in" />
                <span>Agregado</span>
              </>
            ) : selected.stock === 0 ? (
              <span>Agotado</span>
            ) : isMaxStockReached ? (
              <span>Stock máximo en bolso</span>
            ) : (
              <>
                <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                <span>Agregar al bolso</span>
              </>
            )}
          </div>
          
          {/* Subtle glow on hover */}
          {!added && selected.stock > 0 && !isMaxStockReached && (
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>

      {/* Cart quantity hint */}
      {cartQuantity > 0 && !added && (
        <p
          className="mt-3 nd-animate-fade-in"
          style={{
            fontSize: "11px",
            color: "var(--text-disabled)",
            fontFamily: "var(--font-body)",
          }}
        >
          Ya tenés {cartQuantity} {cartQuantity === 1 ? "unidad" : "unidades"} de {selected.ml}ml en tu bolso
        </p>
      )}

      <Toast 
        message={`${quantity > 1 ? quantity + " unidades agregadas" : "Añadido al bolso"}`}
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};
