"use client";

import { useState, useTransition } from "react";
import { ShippingConfig, ShippingBox } from "@/lib/shipping-config";
import { updateShippingConfigAction, upsertShippingBoxAction, deleteShippingBoxAction } from "@/app/admin/(dashboard)/envios/actions";
import { useAlert } from "@/hooks/useAlert";
import { Truck, Scale, Box, Save, Info, Plus, Trash2, Layout } from "lucide-react";

interface ShippingConfigFormProps {
  initialConfig: ShippingConfig;
  initialBoxes: ShippingBox[];
}

export const ShippingConfigForm = ({ initialConfig, initialBoxes }: ShippingConfigFormProps) => {
  const { showAlert } = useAlert();
  const [isPending, startTransition] = useTransition();
  const [config, setConfig] = useState(initialConfig);
  const [boxes, setBoxes] = useState<ShippingBox[]>(initialBoxes);

  const handleSubmitConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateShippingConfigAction(config);
      if (result.success) {
        showAlert("Pesos globales actualizados", { type: "success" });
      } else {
        showAlert(result.error || "Error al actualizar la configuración", { type: "error" });
      }
    });
  };

  const handleUpdateBox = async (box: Partial<ShippingBox>) => {
    startTransition(async () => {
      const result = await upsertShippingBoxAction(box);
      if (result.success) {
        showAlert("Caja guardada", { type: "success" });
      } else {
        showAlert(result.error || "Error al guardar caja", { type: "error" });
      }
    });
  };

  const handleDeleteBox = async (id: string) => {
    if (!confirm("¿Eliminar esta caja?")) return;
    startTransition(async () => {
      const result = await deleteShippingBoxAction(id);
      if (result.success) {
        setBoxes(prev => prev.filter(b => b.id !== id));
        showAlert("Caja eliminada", { type: "success" });
      } else {
        showAlert(result.error || "Error al eliminar caja", { type: "error" });
      }
    });
  };

  const handleAddBox = () => {
    const newBox: ShippingBox = {
      nombre: "Nueva Caja",
      largo_cm: 15,
      ancho_cm: 10,
      alto_cm: 5,
      max_items: 5,
      peso_base_g: 75
    };
    setBoxes(prev => [...prev, newBox]);
  };

  const updateLocalBox = (index: number, field: keyof ShippingBox, value: string | number) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], [field]: value };
    setBoxes(newBoxes);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Sección 1: Pesos Globales */}
      <form onSubmit={handleSubmitConfig} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--surface-raised)] flex items-center gap-3">
          <Scale className="text-[var(--accent)]" size={24} />
          <h2 className="text-xl font-display text-[var(--text-display)]">Pesos Globales</h2>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-body uppercase tracking-widest text-[var(--text-secondary)]">Peso por Decant (g)</label>
              <div className="relative">
                <input
                  type="number"
                  value={config.decant_weight_g}
                  onChange={(e) => setConfig({ ...config, decant_weight_g: Number(e.target.value) })}
                  className="nd-input w-full bg-[var(--black)]"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs">GR</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-body uppercase tracking-widest text-[var(--text-secondary)]">Empaque Base Fallback (g)</label>
              <div className="relative">
                <input
                  type="number"
                  value={config.packaging_base_weight_g}
                  onChange={(e) => setConfig({ ...config, packaging_base_weight_g: Number(e.target.value) })}
                  className="nd-input w-full bg-[var(--black)]"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs">GR</span>
              </div>
            </div>
          </div>

          <div className="bg-[rgba(180,140,70,0.05)] border-l-4 border-[var(--accent)] p-6 rounded-r-xl flex gap-4">
            <Info className="text-[var(--accent)] shrink-0" size={24} />
            <div className="text-sm">
              <p className="text-[var(--text-display)] font-semibold mb-2">Simulación de Peso</p>
              <p className="text-[var(--text-secondary)]">
                El peso total reportado será el peso de los decants más el <strong>Peso Base específico</strong> de la caja elegida.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[rgba(0,0,0,0.1)] flex justify-end">
          <button type="submit" disabled={isPending} className="nd-btn-primary flex items-center gap-2">
            <Save size={18} /> Guardar Configuración
          </button>
        </div>
      </form>

      {/* Sección 2: Gestión de Cajas */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Box className="text-[var(--accent)]" size={24} />
            <h2 className="text-xl font-display text-[var(--text-display)]">Medidas y Pesos de Cajas</h2>
          </div>
          <button 
            type="button" 
            onClick={handleAddBox}
            className="nd-btn-ghost flex items-center gap-2 !p-2 text-sm"
          >
            <Plus size={16} /> Agregar Caja
          </button>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {boxes.map((box, i) => (
              <div key={box.id || `new-${i}`} className="p-6 bg-[var(--surface-raised)] rounded-xl border border-[var(--border)] group animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-tighter text-[var(--text-muted)] mb-1 block">Nombre</label>
                    <input 
                      type="text" 
                      value={box.nombre}
                      onChange={(e) => updateLocalBox(i, "nombre", e.target.value)}
                      className="nd-input !py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-muted)] mb-1 block">Largo (cm)</label>
                    <input 
                      type="number" 
                      value={box.largo_cm}
                      onChange={(e) => updateLocalBox(i, "largo_cm", Number(e.target.value))}
                      className="nd-input !py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-muted)] mb-1 block">Ancho</label>
                    <input 
                      type="number" 
                      value={box.ancho_cm}
                      onChange={(e) => updateLocalBox(i, "ancho_cm", Number(e.target.value))}
                      className="nd-input !py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-muted)] mb-1 block">Alto</label>
                    <input 
                      type="number" 
                      value={box.alto_cm}
                      onChange={(e) => updateLocalBox(i, "alto_cm", Number(e.target.value))}
                      className="nd-input !py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--accent)] font-bold mb-1 block">Peso Base (g)</label>
                    <input 
                      type="number" 
                      value={box.peso_base_g}
                      onChange={(e) => updateLocalBox(i, "peso_base_g", Number(e.target.value))}
                      className="nd-input !py-1.5 text-sm border-[var(--accent)]/30 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--accent)] font-bold mb-1 block">Máx Items</label>
                    <input 
                      type="number" 
                      value={box.max_items}
                      onChange={(e) => updateLocalBox(i, "max_items", Number(e.target.value))}
                      className="nd-input !py-1.5 text-sm border-[var(--accent)]/30"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-[var(--border)] opacity-60 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDeleteBox(box.id!)}
                    disabled={!box.id || isPending}
                    className="p-2 text-[#D71921] hover:bg-[rgba(215,25,33,0.05)] rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleUpdateBox(box)}
                    disabled={isPending}
                    className="nd-btn-ghost !min-h-fit !py-1.5 !px-3 text-xs bg-[var(--surface)]"
                  >
                    {isPending ? "Guardando..." : "Guardar Esta Caja"}
                  </button>
                </div>
              </div>
            ))}

            {boxes.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-2xl">
                <Box className="mx-auto text-[var(--text-disabled)] mb-3" size={48} strokeWidth={1} />
                <p className="text-[var(--text-secondary)]">No hay cajas configuradas.</p>
                <button onClick={handleAddBox} className="mt-4 text-[var(--accent)] text-sm font-bold underline">Agregar la primera caja</button>
              </div>
            )}
          </div>

          <div className="mt-10 p-4 bg-[var(--surface-raised)] border border-dashed border-[var(--border)] rounded-xl flex gap-3">
            <Layout className="text-[var(--text-muted)] shrink-0" size={20} />
            <p className="text-xs text-[var(--text-secondary)] bg-transparent">
              <strong>Cómo funciona:</strong> Al calcular el envío, el sistema sumará todos los decants en el carrito. Elegirá la caja con la <strong>menor capacidad (Máx Items)</strong> que pueda contenerlos todos. Si un pedido supera la caja más grande, se usará esa caja y se escalará automáticamente su altura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
