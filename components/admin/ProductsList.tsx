"use client";

import { Producto } from "@/types";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/hooks/useAlert";


export default function ProductsList({ initialProducts }: { initialProducts: Producto[] }) {
  const [products, setProducts] = useState<Producto[]>(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { showAlert, showConfirm } = useAlert();

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("¿Estás seguro de eliminar este producto?", { isDestructive: true });
    if (!confirmed) return;

    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        router.refresh();
        await showAlert("El producto ha sido eliminado correctamente.", { type: "success" });
      } else {
        await showAlert("Error al eliminar el producto.", { type: "error" });
      }
    } catch (e) {
      await showAlert("Error de red al intentar eliminar el producto.", { type: "error" });
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div>
      <div className="flex justify-end mb-6">
        <Link 
          href="/admin/productos/nuevo"
          className="nd-btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Agregar Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="nd-card flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-heading font-display">{p.nombre}</h3>
                <span className="nd-tag">{p.marca}</span>
              </div>
              <p className="text-nd-body-sm line-clamp-2 mb-4">{p.descripcion}</p>
              
              <div className="mb-4">
                <span className="text-nd-label text-xs">Variantes:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {p.variantes.map(v => (
                    <span key={v.ml} className="text-xs px-2 py-1 bg-[var(--surface-raised)] border border-[var(--border)] rounded flex items-center gap-2">
                      <span className="font-medium text-[var(--text-display)]">{v.ml}ml</span>
                      <span className="text-[var(--text-disabled)] opacity-30">|</span>
                      <span>${v.precio}</span>
                      <span className="text-[var(--text-disabled)] opacity-30">|</span>
                      <span className={v.stock > 0 ? "text-[var(--success)]" : "text-[#D71921] font-medium"}>
                        Stock: {v.stock}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end mt-4 pt-4 border-t border-[var(--border)]">
              <Link 
                href={`/admin/productos/${p.id}`}
                className="nd-btn-ghost !min-h-fit !p-2"
                title="Editar"
              >
                <Edit2 size={18} />
              </Link>
              <button 
                onClick={() => handleDelete(p.id)}
                disabled={deletingId === p.id}
                className="text-[#D71921] hover:bg-[rgba(215,25,33,0.05)] p-2 rounded transition-colors disabled:opacity-50"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--text-secondary)]">
            No hay productos registrados.
          </div>
        )}
      </div>
    </div>
  );
}
