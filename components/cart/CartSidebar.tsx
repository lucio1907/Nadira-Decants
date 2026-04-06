"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export const CartSidebar = () => {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
        }}
        onClick={closeCart}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[var(--black)] z-[70] shadow-2xl transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) border-l border-[var(--border)] flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-nd-label text-[var(--accent)]">Bolso</span>
            <span className="w-1 h-1 rounded-full bg-[var(--border-visible)]" />
            <h2 className="text-nd-body font-medium text-[var(--text-display)] uppercase tracking-widest text-[13px]">
              {items.length} {items.length === 1 ? 'Producto' : 'Productos'}
            </h2>
          </div>
          <button 
            onClick={closeCart}
            className="group flex items-center gap-2 p-1 text-[var(--text-disabled)] hover:text-[var(--text-display)] transition-colors"
            aria-label="Cerrar carrito"
          >
            <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Cerrar</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center mb-6 opacity-40">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <h3 className="text-display-md mb-4" style={{ fontSize: "20px" }}>Tu bolso está vacío</h3>
              <p className="text-nd-body-sm mb-8 max-w-[240px]">Parece que aún no has añadido ninguna fragancia a tu colección.</p>
              <button 
                onClick={() => {
                  closeCart();
                  const el = document.getElementById("productos");
                  if (el) {
                    setTimeout(() => {
                      el.scrollIntoView({ behavior: "smooth" });
                    }, 500); // Wait for sidebar to close partially
                  } else {
                    window.location.href = "/#productos";
                  }
                }}
                className="nd-btn-secondary px-8"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {items.map((item) => (
                <div 
                  key={`${item.id}-${item.variante.ml}`}
                  className="flex gap-6 items-start group"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-[var(--surface-raised)] border border-[var(--border)] rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    <Image 
                      src={item.imagen} 
                      alt={item.nombre}
                      fill
                      sizes="96px"
                      className="p-2 object-contain opacity-90 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] mb-1 font-medium">{item.marca}</p>
                        <h3 className="text-nd-body font-medium text-[var(--text-display)] text-[15px]">{item.nombre}</h3>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.variante.ml)}
                        className="text-[var(--text-disabled)] hover:text-red-400 transition-colors p-1"
                        aria-label="Eliminar item"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-[11px] text-[var(--text-secondary)] mb-4 font-mono tracking-wider">{item.variante.ml}ML</p>
                    
                    {/* Qty & Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[var(--border-visible)] rounded-sm bg-[var(--surface)]">
                        <button 
                          onClick={() => updateQuantity(item.id, item.variante.ml, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-xs hover:bg-white/5 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-[11px] font-mono border-x border-[var(--border-visible)]">
                          {item.quantity}
                        </span>
                        <button 
                           onClick={() => updateQuantity(item.id, item.variante.ml, item.quantity + 1)}
                           disabled={item.quantity >= item.variante.stock}
                           className={`w-8 h-8 flex items-center justify-center text-xs hover:bg-white/5 transition-colors ${item.quantity >= item.variante.stock ? 'opacity-20 cursor-not-allowed' : ''}`}
                           title={item.quantity >= item.variante.stock ? "Stock máximo alcanzado" : ""}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[14px] font-mono text-[var(--text-display)]">
                         ${(item.variante.precio * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 border-t border-[var(--border)] bg-[var(--surface-raised)] bg-opacity-50">
            <div className="flex justify-between items-baseline mb-8">
              <span className="text-nd-label text-[var(--text-disabled)] tracking-[0.2em]">Total</span>
              <span className="text-display-md" style={{ fontSize: "32px", color: "var(--text-display)" }}>
                ${total.toLocaleString("es-AR")}
              </span>
            </div>
            
            <Link 
              href="/checkout" 
              onClick={closeCart}
              className="nd-btn-primary w-full text-center py-5 block relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Confirmar Pedido</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
            </Link>
            
            <button 
              onClick={() => {
                closeCart();
                const el = document.getElementById("productos");
                if (el) {
                  setTimeout(() => {
                    el.scrollIntoView({ behavior: "smooth" });
                  }, 500);
                } else {
                  window.location.href = "/#productos";
                }
              }}
              className="w-full text-center mt-6 text-[10px] uppercase tracking-[0.3em] text-[var(--text-disabled)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};
