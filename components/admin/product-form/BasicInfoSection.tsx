"use client";

import { Producto } from "@/types";

interface BasicInfoSectionProps {
  formData: Pick<Producto, "nombre" | "marca" | "slug" | "descripcion" | "mlTotalesBotella">;
  isEdit: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNumberChange: (name: string, value: number) => void;
}

export const BasicInfoSection = ({ formData, isEdit, onChange, onNumberChange }: BasicInfoSectionProps) => {
  return (
    <section className="nd-card space-y-6">
      <h2 className="text-display-sm font-display mb-4 border-b border-[var(--border)] pb-2 text-xl">Información Básica</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-nd-label mb-2 block">Nombre del Producto</label>
          <input 
            required 
            name="nombre" 
            value={formData.nombre} 
            onChange={onChange} 
            className="nd-input" 
            placeholder="Ej: Aventus"
          />
        </div>
        <div>
          <label className="text-nd-label mb-2 block">Marca</label>
          <input 
            required 
            name="marca" 
            value={formData.marca} 
            onChange={onChange} 
            className="nd-input" 
            placeholder="Ej: Creed"
          />
        </div>
        <div>
          <label className="text-nd-label mb-2 block">Slug (URL)</label>
          <input 
            required 
            name="slug" 
            value={formData.slug} 
            onChange={onChange} 
            className="nd-input" 
            placeholder="creed-aventus"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-nd-label mb-2 block">Descripción</label>
          <textarea 
            required 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={onChange} 
            className="nd-input" 
            rows={4} 
            placeholder="Describe las características del perfume..."
          />
        </div>
        <div>
          <label className="text-nd-label mb-2 block">Capacidad Botella Original (ml)</label>
          <input
            required
            type="text"
            inputMode="numeric"
            name="mlTotalesBotella"
            value={formData.mlTotalesBotella || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d*$/.test(val)) {
                onNumberChange("mlTotalesBotella", val === "" ? 0 : Number(val));
              }
            }}
            className="nd-input"
            placeholder="100"
          />
        </div>
      </div>
    </section>
  );
};
