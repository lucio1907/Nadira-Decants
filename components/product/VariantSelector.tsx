"use client";

import { useState, useEffect } from "react";
import { Variante } from "@/types";
import { useCartStore } from "@/store/cart";
import { Toast } from "@/components/ui/Toast";
import { Check, ShoppingBag } from "lucide-react";

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
  
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const cartItems = useCartStore((s) => s.items);

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
    setShowToast(true);
    // openCart(); // Removed auto-open for better flow with toast
    setTimeout(() => {
      setAdded(false);
    }, 2000);
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
        className="flex flex-wrap gap-4"
        style={{ marginBottom: "var(--space-2xl)" }}
      >
        {variantes.map((v) => (
          <button
            key={v.ml}
            onClick={() => setSelected(v)}
            disabled={v.stock === 0}
            className={`relative flex flex-col items-center justify-center transition-all duration-500 py-3 px-8 rounded-full border ${
              selected.ml === v.ml 
                ? "border-[var(--accent)] bg-[var(--accent-subtle)]" 
                : "border-white/10 hover:border-white/30 bg-white/5"
            } ${v.stock === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
            id={`variant-${v.ml}ml`}
          >
            <span 
              style={{ 
                fontSize: "14px", 
                fontWeight: 600, 
                fontFamily: "var(--font-body)",
                letterSpacing: "0.05em",
                color: selected.ml === v.ml ? "var(--text-display)" : "var(--text-secondary)"
              }}
            >
              {v.ml}ML
            </span>
            
            {/* Active Glow */}
            {selected.ml === v.ml && (
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(211,176,0,0.15)] pointer-events-none" />
            )}

            {/* Out of stock line */}
            {v.stock === 0 && (
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -rotate-12 pointer-events-none" />
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
      <div style={{ marginBottom: "var(--space-xl)" }} className="nd-animate-fade-in" key={selected.ml}>
        <span
          className="text-[40px] sm:text-[48px] md:text-[64px]"
          style={{
            fontFamily: "var(--font-display)",
            lineHeight: 1,
            color: "var(--text-display)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          ${displayPrice.toLocaleString("es-AR")}
        </span>
      </div>

      {/* Add to cart button */}
      <div className="relative">
        <button
          onClick={handleAddToCart}
          disabled={selected.stock === 0 || isMaxStockReached}
          className={`relative overflow-hidden group w-all ${added ? "bg-[var(--success)]" : (selected.stock === 0 || isMaxStockReached) ? "bg-[var(--border)] cursor-not-allowed" : "nd-btn-primary"}`}
          style={{
            width: "100%",
            minHeight: "64px",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 600,
            transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
            color: added ? "white" : (selected.stock === 0 || isMaxStockReached) ? "var(--text-disabled)" : "var(--black)",
            borderRadius: "4px",
          }}
          id="add-to-cart-btn"
        >
          <div className="flex items-center justify-center gap-3">
            {added ? (
              <>
                <Check size={18} strokeWidth={3} className="nd-animate-fade-in" />
                <span>Excelente</span>
              </>
            ) : selected.stock === 0 ? (
              <span>Agotado</span>
            ) : isMaxStockReached ? (
              <span>Límite alcanzado</span>
            ) : (
              <>
                <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
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

      <Toast 
        message="Añadido al bolso" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};
