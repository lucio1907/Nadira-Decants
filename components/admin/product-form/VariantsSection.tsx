"use client";

import { Variante } from "@/types";
import { Trash2, Plus } from "lucide-react";

interface VariantsSectionProps {
  variantes: Variante[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Variante, value: string | number) => void;
}

export const VariantsSection = ({ variantes, onAdd, onRemove, onUpdate }: VariantsSectionProps) => {
  return (
    <section className="nd-card space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-4">
        <h2 className="text-display-sm font-display text-xl">Variantes (Tamaños)</h2>
        <button type="button" onClick={onAdd} className="nd-btn-ghost flex items-center gap-2 !p-2">
          <Plus size={16} /> Agregar
        </button>
      </div>

      <div className="space-y-4">
        {variantes.map((v, i) => (
          <div 
            key={i} 
            className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-[var(--surface-raised)] p-4 rounded border border-[var(--border)] transition-all hover:border-[var(--border-visible)]"
          >
            <div className="flex-1 min-w-[100px]">
              <label className="text-nd-label block mb-1">Volumen (ml)</label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={v.ml}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*$/.test(val)) {
                    onUpdate(i, "ml", val);
                  }
                }}
                className="nd-input !pt-2 !pb-2"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="text-nd-label block mb-1">Precio ($)</label>
              <input
                required
                type="text"
                inputMode="decimal"
                value={v.precio}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                    onUpdate(i, "precio", val);
                  }
                }}
                className="nd-input !pt-2 !pb-2"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="text-nd-label block mb-1">Stock</label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={v.stock}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*$/.test(val)) {
                    onUpdate(i, "stock", val);
                  }
                }}
                className="nd-input !pt-2 !pb-2"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="text-nd-label block mb-1">Costo ($)</label>
              <input
                required
                type="text"
                inputMode="decimal"
                value={v.costo || 0}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                    onUpdate(i, "costo", val);
                  }
                }}
                className="nd-input !pt-2 !pb-2"
              />
            </div>
            <button 
              type="button" 
              onClick={() => onRemove(i)} 
              className="p-2 mb-2 text-[#D71921] hover:bg-[rgba(215,25,33,0.05)] rounded transition-colors"
              title="Eliminar variante"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {variantes.length === 0 && (
          <p className="text-[var(--text-secondary)] text-sm italic">Debes agregar al menos una variante para este producto.</p>
        )}
      </div>
    </section>
  );
};
