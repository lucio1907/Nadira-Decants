"use client";

import { NotasOlfativas } from "@/types";
import { Plus, X } from "lucide-react";

interface NotesSectionProps {
  notas: NotasOlfativas;
  onChange: (tipo: keyof NotasOlfativas, index: number, value: string) => void;
  onAdd: (tipo: keyof NotasOlfativas) => void;
  onRemove: (tipo: keyof NotasOlfativas, index: number) => void;
}

export const NotesSection = ({ notas, onChange, onAdd, onRemove }: NotesSectionProps) => {
  return (
    <section className="nd-card space-y-6">
      <h2 className="text-display-sm font-display text-xl mb-4 border-b border-[var(--border)] pb-2">Notas Olfativas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['salida', 'corazon', 'fondo'] as const).map(tipo => (
          <div key={tipo}>
            <h3 className="text-nd-label block mb-4 capitalize">{tipo}</h3>
            <div className="space-y-2">
              {notas[tipo].map((nota: string, i: number) => (
                <div key={i} className="flex items-center gap-2 group">
                  <input
                    value={nota}
                    onChange={(e) => onChange(tipo, i, e.target.value)}
                    className="nd-input !py-1 flex-1"
                    placeholder={`Nota de ${tipo}`}
                  />
                  <button 
                    type="button" 
                    onClick={() => onRemove(tipo, i)} 
                    className="text-[var(--text-secondary)] hover:text-[#D71921] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => onAdd(tipo)} 
                className="text-[var(--accent)] text-sm font-body font-medium flex items-center mt-2 hover:translate-x-1 transition-transform"
              >
                <Plus size={14} className="mr-1" /> Agregar nota
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
