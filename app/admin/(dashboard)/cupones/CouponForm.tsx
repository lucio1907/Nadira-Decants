"use client";

import { useState } from "react";
import { Coupon } from "@/types";
import { X, Save, AlertCircle } from "lucide-react";
import { upsertCouponAction } from "./actions";
import { CustomDatePicker } from "@/components/admin/CustomDatePicker";

interface Props {
  coupon: Coupon | null;
  onClose: () => void;
}


export function CouponForm({ coupon, onClose }: Props) {
  const [formData, setFormData] = useState<Partial<Coupon>>(
    coupon || {
      codigo: "",
      tipo: "porcentaje",
      valor: 0,
      minimo_compra: 0,
      activo: true,
      usos_actuales: 0,
    }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Validaciones básicas
    if (!formData.codigo) {
      setError("El código es obligatorio");
      setIsSaving(false);
      return;
    }
    if (formData.valor === undefined || formData.valor <= 0) {
      setError("El valor del descuento debe ser mayor a 0");
      setIsSaving(false);
      return;
    }

    const res = await upsertCouponAction({
      ...formData,
      codigo: formData.codigo?.toUpperCase(),
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Ocurrió un error al guardar");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm nd-animate-fade-in">
      <div className="nd-card w-full max-w-lg shadow-2xl border-[var(--accent)]/30">

        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-display text-[var(--text-display)] tracking-widest uppercase">
            {coupon ? "Editar Cupón" : "Nuevo Cupón"}
          </h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh] p-8 flex flex-col gap-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-5 flex items-center gap-4 text-red-500 text-sm nd-animate-fade-in">
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Sección: Configuración del Descuento */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)]">Configuración del Descuento</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-nd-label">Código del Cupón</label>
                <input
                  type="text"
                  placeholder="EJ: VERANO2026"
                  className="nd-input uppercase font-bold tracking-widest"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-nd-label">Estado Inicial</label>
                <div className="relative">
                  <select
                    className="nd-input appearance-none bg-transparent !pr-10"
                    value={formData.activo ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })}
                  >
                    <option value="true" className="bg-[var(--surface-raised)]">Activo (Visible y usable)</option>
                    <option value="false" className="bg-[var(--surface-raised)]">Inactivo (Pausado)</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-disabled)]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4.5L6 7.5L9 4.5" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-nd-label">Tipo de Beneficio</label>
                <div className="relative">
                  <select
                    className="nd-input appearance-none bg-transparent !pr-10"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any, valor: 0 })}
                  >
                    <option value="porcentaje" className="bg-[var(--surface-raised)]">Porcentaje (%)</option>
                    <option value="fijo" className="bg-[var(--surface-raised)]">Monto Fijo ($)</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-disabled)]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4.5L6 7.5L9 4.5" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-nd-label">Valor del Descuento</label>
                <input
                  type="text"
                  inputMode={formData.tipo === "porcentaje" ? "numeric" : "decimal"}
                  placeholder={formData.tipo === "porcentaje" ? "15" : "1500"}
                  className="nd-input font-medium"
                  value={formData.valor || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const regex = formData.tipo === "porcentaje" ? /^\d*$/ : /^\d*\.?\d*$/;
                    if (val === "" || regex.test(val)) {
                      setFormData({ ...formData, valor: val === "" ? 0 : Number(val) });
                    }
                  }}
                />
              </div>
            </div>
          </section>

          {/* Sección: Restricciones y Límites */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)]">Restricciones y Límites</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-nd-label">Compra Mínima</label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Opcional"
                  className="nd-input"
                  value={formData.minimo_compra || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                      setFormData({ ...formData, minimo_compra: val === "" ? 0 : Number(val) });
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-nd-label">Límite de Usos</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ilimitado"
                  className="nd-input"
                  value={formData.usos_maximos || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*$/.test(val)) {
                      setFormData({ ...formData, usos_maximos: val === "" ? undefined : parseInt(val) });
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <CustomDatePicker
                  label="Fecha de Expiración"
                  placeholder="Sin límite de tiempo"
                  selected={formData.expiracion ? new Date(formData.expiracion) : undefined}
                  onChange={(date) => setFormData({ ...formData, expiracion: date })}
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-6 pt-6 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-widest text-[var(--text-disabled)] hover:text-[var(--text-primary)] transition-colors font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="nd-btn-primary flex items-center gap-3 px-10"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-[var(--black)] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} />
                  <span>GUARDAR CAMBIOS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
