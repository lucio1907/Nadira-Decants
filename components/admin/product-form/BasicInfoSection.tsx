"use client";

import { Producto } from "@/types";
import { Mars, Venus, Users } from "lucide-react";

interface BasicInfoSectionProps {
  formData: Pick<Producto, "nombre" | "marca" | "slug" | "descripcion" | "mlTotalesBotella" | "genero">;
  isEdit: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onNumberChange: (name: string, value: number) => void;
}

export const BasicInfoSection = ({ formData, isEdit, onChange, onNumberChange }: BasicInfoSectionProps) => {
  const genderOptions = [
    { id: "Hombre", label: "Hombre", icon: Mars },
    { id: "Mujer", label: "Mujer", icon: Venus },
    { id: "Unisex", label: "Unisex", icon: Users },
  ];

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
        
        <div className="md:col-span-2 pt-4">
          <label className="text-nd-label mb-4 block">Género</label>
          <div className="flex flex-wrap gap-4">
            {genderOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ target: { name: "genero", value: option.id } } as any)}
                className={`nd-segment group flex items-center gap-3 transition-all duration-500 rounded-none h-auto py-4 px-8 ${
                  formData.genero === option.id 
                    ? "nd-segment-active" 
                    : "hover:bg-white/[0.03] border-[var(--border-visible)]"
                }`}
              >
                <option.icon 
                  size={16} 
                  className={`transition-colors duration-500 ${
                    formData.genero === option.id ? "text-nd-black" : "text-nd-accent opacity-70 group-hover:opacity-100"
                  }`} 
                />
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
