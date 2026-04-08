"use client";

import { useState } from "react";
import { Coupon } from "@/types";
import { Plus, Search, Edit2, Trash2, Copy, CheckCircle2, XCircle } from "lucide-react";
import { CouponForm } from "./CouponForm";
import { deleteCouponAction } from "./actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAlert } from "@/hooks/useAlert";

interface Props {
  initialCoupons: Coupon[];
}

export function CouponsClient({ initialCoupons }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showAlert, showConfirm } = useAlert();


  const filteredCoupons = initialCoupons.filter(c =>
    c.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("¿Estás seguro de que deseas eliminar este cupón?", { isDestructive: true });
    if (!confirmed) return;

    setIsDeleting(id);
    try {
      const res = await deleteCouponAction(id);
      if (res.success) {
        await showAlert("El cupón ha sido eliminado correctamente.", { type: "success" });
      } else {
        await showAlert("Error al eliminar: " + res.error, { type: "error" });
      }
    } catch (error) {
      await showAlert("Error inesperado al eliminar el cupón.", { type: "error" });
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 max-w-md">
          <label className="text-nd-label mb-3 block">Buscador</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-disabled)]" size={18} />
            <input
              type="text"
              placeholder="BUSCAR CÓDIGO..."
              className="nd-input !pl-12 w-full uppercase tracking-widest text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="nd-btn-primary flex items-center justify-center gap-3 w-full md:w-auto px-8"
        >
          <Plus size={18} />
          <span>NUEVO CUPÓN</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => {
            const isExpired = coupon.expiracion && new Date(coupon.expiracion) < new Date();
            const isAgotado = coupon.usos_maximos && coupon.usos_actuales >= coupon.usos_maximos;
            const status = !coupon.activo ? "Inactivo" : isExpired ? "Expirado" : isAgotado ? "Agotado" : "Activo";

            const usagePercent = coupon.usos_maximos ? (coupon.usos_actuales / coupon.usos_maximos) * 100 : 0;

            return (
              <div key={coupon.id} className="nd-card group relative transition-all duration-500 hover:border-[var(--accent)]/40 hover:shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 lg:p-10 gap-8">
                  <div className="flex flex-col sm:flex-row items-start gap-6 flex-1">
                    <div className={`p-5 rounded-full flex items-center justify-center transition-colors duration-500 ${status === "Activo" ? "bg-green-500/5 text-green-500 border border-green-500/10" : "bg-red-500/5 text-red-500 border border-red-500/10"
                      }`}>
                      <TicketIcon status={status} />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-display text-[var(--text-display)] tracking-[0.2em] uppercase font-bold">
                            {coupon.codigo}
                          </h3>
                          <button
                            onClick={() => copyToClipboard(coupon.codigo)}
                            className={`p-2 rounded-full transition-all duration-300 ${copiedCode === coupon.codigo ? "bg-green-500/10 text-green-500" : "text-[var(--text-disabled)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)]"}`}
                            title="Copiar código"
                          >
                            {copiedCode === coupon.codigo ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-body">
                          <span className="text-lg text-[var(--accent)] font-medium tracking-wide">
                            {coupon.tipo === "porcentaje" ? `${coupon.valor}% OFF` : `$${coupon.valor.toLocaleString("es-AR")} OFF`}
                          </span>
                          <span className="text-[var(--text-disabled)] opacity-30">|</span>
                          <span className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.1em]">
                            Min: ${coupon.minimo_compra?.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>

                      {/* Usage Progress Bar */}
                      {coupon.usos_maximos && (
                        <div className="max-w-xs space-y-2">
                          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-[var(--text-disabled)]">
                            <span>Progreso de Uso</span>
                            <span className={usagePercent >= 90 ? "text-red-500" : ""}>{coupon.usos_actuales} / {coupon.usos_maximos}</span>
                          </div>
                          <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--border)]">
                            <div
                              className={`h-full transition-all duration-1000 ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 70 ? "bg-orange-500" : "bg-[var(--accent)]"}`}
                              style={{ width: `${Math.min(100, usagePercent)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 border-[var(--border)] pt-6 lg:pt-0">
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <StatusBadge status={status} />
                      {coupon.expiracion && (
                        <span className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] font-medium">
                          Expira: {format(new Date(coupon.expiracion), "dd MMM, yyyy", { locale: es })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-display)] hover:bg-[var(--surface-raised)] rounded-lg transition-all border border-transparent hover:border-[var(--border)]"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        disabled={isDeleting === coupon.id}
                        className="p-3 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all border border-transparent hover:border-red-500/10"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="nd-card py-24 flex flex-col items-center justify-center text-center space-y-6 bg-transparent border-dashed">
            <div className="p-8 rounded-full bg-[var(--surface-raised)] text-[var(--text-disabled)] opacity-20">
              <Plus size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display text-[var(--text-primary)] uppercase tracking-widest">No hay cupones activos</h3>
              <p className="text-sm text-[var(--text-disabled)] max-w-xs mx-auto">
                Crea tu primer descuento para atraer más clientes a tu tienda.
              </p>
            </div>
            <button onClick={handleAddNew} className="nd-btn-secondary !py-3">
              EMPEZAR AHORA
            </button>
          </div>
        )}
      </div>


      {isFormOpen && (
        <CouponForm
          coupon={editingCoupon}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>

  );
}

function TicketIcon({ status }: { status: string }) {
  if (status === "Activo") return <CheckCircle2 size={24} />;
  return <XCircle size={24} />;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Activo": "text-green-500 border-green-500/20 bg-green-500/5",
    "Inactivo": "text-gray-500 border-gray-500/20 bg-gray-500/5",
    "Expirado": "text-orange-500 border-orange-500/20 bg-orange-500/5",
    "Agotado": "text-red-500 border-red-500/20 bg-red-500/5"
  };

  return (
    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 border rounded ${colors[status] || colors["Inactivo"]}`}>
      {status}
    </span>
  );
}
