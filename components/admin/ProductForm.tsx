"use client";

import { Producto, Variante } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Upload, X } from "lucide-react";

type ProductFormData = Omit<Producto, "id">;

const emptyForm: ProductFormData = {
  slug: "",
  nombre: "",
  marca: "",
  descripcion: "",
  notas: { salida: [], corazon: [], fondo: [] },
  imagenes: [],
  variantes: [{ ml: 10, precio: 0, stock: 0 }],
};

export function ProductForm({ initialData, isEdit = false }: { initialData?: Producto, isEdit?: boolean }) {
  const [formData, setFormData] = useState<ProductFormData>(initialData || emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  // Basic Fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === "nombre" && !isEdit ? { slug: value.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {})
    }));
  };

  // Variantes
  const addVariante = () => {
    setFormData(prev => ({
      ...prev,
      variantes: [...prev.variantes, { ml: 0, precio: 0, stock: 0 }]
    }));
  };
  const removeVariante = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variantes: prev.variantes.filter((_, i) => i !== index)
    }));
  };
  const updateVariante = (index: number, field: keyof Variante, value: number) => {
    const newVariantes = [...formData.variantes];
    newVariantes[index] = { ...newVariantes[index], [field]: value };
    setFormData(prev => ({ ...prev, variantes: newVariantes }));
  };

  // Notas
  const handleNotaChange = (tipo: keyof Producto['notas'], index: number, value: string) => {
    const newNotas = [...formData.notas[tipo]];
    newNotas[index] = value;
    setFormData(prev => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: newNotas }
    }));
  };
  const addNota = (tipo: keyof Producto['notas']) => {
    setFormData(prev => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: [...prev.notas[tipo], ""] }
    }));
  };
  const removeNota = (tipo: keyof Producto['notas'], index: number) => {
    setFormData(prev => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: prev.notas[tipo].filter((_, i) => i !== index) }
    }));
  };

  // Images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    
    try {
      for(const file of Array.from(e.target.files)) {
        const data = new FormData();
        data.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: data,
        });
        const json = await res.json();
        if (json.url) {
          setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, json.url] }));
        }
      }
    } catch (err) {
      alert("Error al subir imagen");
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = "";
    }
  };
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/productos/${initialData?.id}` : `/api/productos`;
      const method = isEdit ? "PUT" : "POST";
      
      const payload = isEdit ? { ...formData, id: initialData?.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/productos");
        router.refresh();
      } else {
        alert("Error al guardar el producto");
      }
    } catch (err) {
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-12">
      {/* Información Básica */}
      <section className="nd-card space-y-6">
        <h2 className="text-display-sm font-display mb-4 border-b border-[var(--border)] pb-2 text-xl">Información Básica</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-nd-label mb-2 block">Nombre del Producto</label>
            <input required name="nombre" value={formData.nombre} onChange={handleChange} className="nd-input" />
          </div>
          <div>
            <label className="text-nd-label mb-2 block">Marca</label>
            <input required name="marca" value={formData.marca} onChange={handleChange} className="nd-input" />
          </div>
          <div>
            <label className="text-nd-label mb-2 block">Slug (URL)</label>
            <input required name="slug" value={formData.slug} onChange={handleChange} className="nd-input" />
          </div>
          <div className="md:col-span-2">
            <label className="text-nd-label mb-2 block">Descripción</label>
            <textarea required name="descripcion" value={formData.descripcion} onChange={handleChange} className="nd-input" rows={4} />
          </div>
        </div>
      </section>

      {/* Variantes */}
      <section className="nd-card space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-4">
          <h2 className="text-display-sm font-display text-xl">Variantes (Tamaños)</h2>
          <button type="button" onClick={addVariante} className="nd-btn-ghost flex items-center gap-2 !p-2">
            <Plus size={16} /> Agregar
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.variantes.map((v, i) => (
            <div key={i} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-[var(--surface-raised)] p-4 rounded border border-[var(--border)]">
              <div className="flex-1 min-w-[100px]">
                <label className="text-nd-label block mb-1">Volumen (ml)</label>
                <input required type="number" min="0" value={v.ml} onChange={(e) => updateVariante(i, "ml", Number(e.target.value))} className="nd-input !pt-2 !pb-2" />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-nd-label block mb-1">Precio ($)</label>
                <input required type="number" min="0" value={v.precio} onChange={(e) => updateVariante(i, "precio", Number(e.target.value))} className="nd-input !pt-2 !pb-2" />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-nd-label block mb-1">Stock</label>
                <input required type="number" min="0" value={v.stock} onChange={(e) => updateVariante(i, "stock", Number(e.target.value))} className="nd-input !pt-2 !pb-2" />
              </div>
              <button type="button" onClick={() => removeVariante(i)} className="p-2 mb-2 text-[#D71921] hover:bg-[rgba(215,25,33,0.05)] rounded">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {formData.variantes.length === 0 && <p className="text-[var(--text-secondary)] text-sm">Debes agregar al menos una variante.</p>}
        </div>
      </section>

      {/* Notas Olfativas */}
      <section className="nd-card space-y-6">
        <h2 className="text-display-sm font-display text-xl mb-4 border-b border-[var(--border)] pb-2">Notas Olfativas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['salida', 'corazon', 'fondo'] as const).map(tipo => (
            <div key={tipo}>
              <h3 className="text-nd-label block mb-4 capitalize">{tipo}</h3>
              <div className="space-y-2">
                {formData.notas[tipo].map((nota, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input 
                      value={nota} 
                      onChange={(e) => handleNotaChange(tipo, i, e.target.value)}
                      className="nd-input !py-1 flex-1"
                      placeholder={`Nota de ${tipo}`}
                    />
                    <button type="button" onClick={() => removeNota(tipo, i)} className="text-[var(--text-secondary)] hover:text-[#D71921]">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addNota(tipo)} className="text-[var(--accent)] text-sm font-body font-medium flex items-center mt-2">
                  <Plus size={14} className="mr-1" /> Agregar nota
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Imágenes */}
      <section className="nd-card space-y-4">
        <h2 className="text-display-sm font-display text-xl mb-4 border-b border-[var(--border)] pb-2">Imágenes</h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          {formData.imagenes.map((img, i) => (
            <div key={i} className="relative w-32 h-32 border border-[var(--border)] rounded overflow-hidden group">
              <Image 
                src={img} 
                alt="" 
                fill 
                sizes="128px"
                className="object-cover" 
              />
              <button 
                type="button" 
                onClick={() => removeImage(i)}
                className="absolute z-10 top-1 right-1 bg-black/60 p-1 rounded hover:bg-[#D71921] transition-colors"
              >
                <X size={16} color="white" />
              </button>
            </div>
          ))}
          <label className="w-32 h-32 border border-dashed border-[var(--border-visible)] hover:border-[var(--accent)] rounded flex flex-col items-center justify-center cursor-pointer transition-colors">
            {uploadingImage ? (
              <span className="text-xs text-[var(--accent)] nd-loading-blink">Subiendo...</span>
            ) : (
              <>
                <Upload size={24} className="text-[var(--text-secondary)] mb-2" />
                <span className="text-xs text-[var(--text-secondary)]">Subir</span>
              </>
            )}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={() => router.back()} className="nd-btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="nd-btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
