"use client";

import { Producto } from "@/types";
import {
  Edit2,
  Plus,
  Trash2,
  Search,
  LayoutGrid,
  List,
  AlertTriangle,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { PremiumSelect } from "./PremiumSelect";
import { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/hooks/useAlert";
import Image from "next/image";
import { deleteProductAction } from "@/app/admin/(dashboard)/productos/actions";


export default function ProductsList({ initialProducts }: { initialProducts: Producto[] }) {
  const [products, setProducts] = useState<Producto[]>(initialProducts);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 12;

  // Sincronizar estado local cuando cambian los props (después de router.refresh())
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { showAlert, showConfirm } = useAlert();

  // Get unique brands for the filter
  const brands = useMemo(() => {
    const b = initialProducts.map(p => p.marca);
    return Array.from(new Set(b)).sort();
  }, [initialProducts]);

  // Quick stats
  const stats = useMemo(() => {
    const total = initialProducts.length;
    let outOfStock = 0;
    let lowStock = 0;

    initialProducts.forEach(p => {
      const minStock = Math.min(...p.variantes.map(v => v.stock));
      if (minStock === 0) outOfStock++;
      else if (minStock < 5) lowStock++;
    });

    return { total, lowStock, outOfStock };
  }, [initialProducts]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.marca.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === "all" || p.marca === selectedBrand;
      const matchesGender = selectedGender === "all" || p.genero === selectedGender;

      const minStock = Math.min(...p.variantes.map(v => v.stock));
      let matchesStock = true;
      if (stockFilter === "low") matchesStock = minStock > 0 && minStock < 5;
      else if (stockFilter === "out") matchesStock = minStock === 0;
      else if (stockFilter === "in") matchesStock = minStock >= 5;

      return matchesSearch && matchesBrand && matchesGender && matchesStock;
    });
  }, [initialProducts, searchTerm, selectedBrand, selectedGender, stockFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, selectedGender, stockFilter]);

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("¿Estás seguro de eliminar este producto?", { isDestructive: true });
    if (!confirmed) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        const result = await deleteProductAction(id);
        if (result.success) {
          setProducts(prev => prev.filter(p => p.id !== id));
          await showAlert("El producto ha sido eliminado correctamente.", { type: "success" });
        } else {
          await showAlert(result.error || "Error al eliminar el producto.", { type: "error" });
        }
      } catch (e) {
        await showAlert("Error inesperado al intentar eliminar el producto.", { type: "error" });
      } finally {
        setDeletingId(null);
      }
    });
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="nd-card !p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-display)]">
            <Package size={20} />
          </div>
          <div>
            <p className="text-nd-label text-[10px]">Total Productos</p>
            <p className="text-xl font-display font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="nd-card !p-4 flex items-center gap-4 border-l-4 border-l-[#d3b000]">
          <div className="w-10 h-10 rounded-full bg-[rgba(211,176,0,0.1)] flex items-center justify-center text-[#d3b000]">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-nd-label text-[10px]">Bajo Stock</p>
            <p className="text-xl font-display font-bold text-[#d3b000]">{stats.lowStock}</p>
          </div>
        </div>
        <div className="nd-card !p-4 flex items-center gap-4 border-l-4 border-l-[#D71921]">
          <div className="w-10 h-10 rounded-full bg-[rgba(215,25,33,0.1)] flex items-center justify-center text-[#D71921]">
            <X size={20} />
          </div>
          <div>
            <p className="text-nd-label text-[10px]">Agotados</p>
            <p className="text-xl font-display font-bold text-[#D71921]">{stats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-[var(--surface)] p-4 border border-[var(--border)] rounded-lg">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:flex-1">
          <div className="relative group flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-disabled)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar perfume o marca..."
              defaultValue={searchTerm}
              onChange={(e) => {
                const val = e.target.value;
                startTransition(() => {
                  setSearchTerm(val);
                });
              }}
              className="nd-input !pl-10 w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <PremiumSelect
              value={selectedBrand}
              onChange={(val) => startTransition(() => setSelectedBrand(val))}
              options={[
                { label: "Todas las marcas", value: "all" },
                ...brands.map(b => ({ label: b, value: b }))
              ]}
              placeholder="Marca"
              showSearch
              className="flex-1 sm:flex-initial sm:min-w-[180px]"
            />

            <PremiumSelect
              value={selectedGender}
              onChange={(val) => startTransition(() => setSelectedGender(val))}
              options={[
                { label: "Todos los géneros", value: "all" },
                { label: "Hombre", value: "Hombre" },
                { label: "Mujer", value: "Mujer" },
                { label: "Unisex", value: "Unisex" }
              ]}
              placeholder="Género"
              className="flex-1 sm:flex-initial sm:min-w-[160px]"
            />

            <PremiumSelect
              value={stockFilter}
              onChange={(val) => startTransition(() => setStockFilter(val))}
              options={[
                { label: "Todo el stock", value: "all" },
                { label: "En stock", value: "in" },
                { label: "Bajo stock (<5)", value: "low" },
                { label: "Agotados", value: "out" }
              ]}
              placeholder="Stock"
              className="flex-1 sm:flex-initial sm:min-w-[160px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 pt-4 xl:pt-0">
          <div className="flex bg-[var(--surface-raised)] p-1 rounded-md border border-[var(--border)] flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[var(--text-display)] text-[var(--black)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-display)]"}`}
              title="Vista Cuadrícula"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-[var(--text-display)] text-[var(--black)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-display)]"}`}
              title="Vista Lista"
            >
              <List size={18} />
            </button>
          </div>

          <Link
            href="/admin/productos/nuevo"
            className="nd-btn-primary !min-h-[40px] !py-0 !px-4 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Nuevo Producto</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className={`transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {currentProducts.map((p) => {
              const minStock = Math.min(...p.variantes.map(v => v.stock));
              const isOutOfStock = minStock === 0;
              const isLowStock = minStock > 0 && minStock < 5;

              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/admin/productos/${p.id}`)}
                  className={`nd-card flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${isOutOfStock ? "opacity-75" : ""}`}
                >
                  {/* Visual Indicators */}
                  {isOutOfStock && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-[#D71921] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">Agotado</span>
                    </div>
                  )}
                  {isLowStock && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-[#d3b000] text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">Bajo Stock</span>
                    </div>
                  )}

                  <div className="relative">
                    <div className="aspect-[4/5] bg-[var(--surface-raised)] rounded-sm overflow-hidden mb-4 relative">
                      {p.imagenes?.[0] ? (
                        <Image
                          src={p.imagenes[0]}
                          alt={p.nombre}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-disabled)]">
                          <Package size={40} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white text-xs font-medium tracking-wide">Ver detalles</span>
                      </div>
                    </div>

                    <div className="flex flex-col mb-4">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-disabled)] mb-1">{p.marca}</span>
                      <h3 className="text-lg font-display font-medium line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{p.nombre}</h3>
                    </div>

                    <div className="min-h-[80px]">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-disabled)] font-semibold mb-2">Variantes y Stock</p>
                      <div className="flex flex-wrap gap-1.5 max-h-[55px] overflow-y-auto scrollbar-hide py-0.5">
                        {p.variantes.map((v, idx) => (
                          <div key={`variant-grid-${v.ml}-${idx}`} className={`text-[11px] px-2 py-1 bg-[var(--surface-raised)] border border-[var(--border)] rounded flex items-center gap-1.5 transition-colors ${v.stock === 0 ? "border-[#D71921]/20 opacity-60" : v.stock < 5 ? "border-[#d3b000]/30" : ""}`}>
                            <span className="font-bold">{v.ml}ml</span>
                            <span className={`${v.stock === 0 ? "text-[#D71921]" : v.stock < 5 ? "text-[#d3b000]" : "text-[var(--success)]"}`}>
                              ({v.stock})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end mt-6 pt-4 border-t border-[var(--border)]">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="nd-btn-ghost !min-h-fit !p-2 rounded-full hover:bg-[var(--surface-raised)] transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      disabled={deletingId === p.id}
                      className="text-[#D71921] hover:bg-[rgba(215,25,33,0.05)] p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="nd-card !p-0 overflow-hidden border border-[var(--border)]">
            <div className="overflow-x-auto selection:bg-[var(--accent)]/30">
              <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
                <thead>
                  <tr className="bg-[var(--surface-raised)] border-bottom border-[var(--border)]">
                    <th className="px-6 py-4 text-nd-label text-[10px]">Producto</th>
                    <th className="px-6 py-4 text-nd-label text-[10px]">Marca</th>
                    <th className="px-6 py-4 text-nd-label text-[10px]">Variantes (ML | Stock | Costo)</th>
                    <th className="px-6 py-4 text-nd-label text-[10px] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {currentProducts.map((p) => {
                    const minStock = Math.min(...p.variantes.map(v => v.stock));
                    return (
                      <tr
                        key={p.id}
                        onClick={() => router.push(`/admin/productos/${p.id}`)}
                        className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-[var(--surface-raised)] overflow-hidden relative border border-[var(--border)]">
                              {p.imagenes?.[0] ? (
                                <Image src={p.imagenes[0]} alt={p.nombre} fill sizes="40px" className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--text-disabled)]"><Package size={16} /></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-[var(--text-display)]">{p.nombre}</p>
                              {minStock === 0 && <span className="text-[10px] text-[#D71921] font-bold uppercase">Agotado</span>}
                              {minStock > 0 && minStock < 5 && <span className="text-[10px] text-[#d3b000] font-bold uppercase">Bajo Stock</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="nd-tag !text-[10px] !px-2 !py-0.5">{p.marca}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {p.variantes.map((v, idx) => (
                              <div key={`variant-table-${v.ml}-${idx}`} className="flex items-center gap-3 text-xs">
                                <span className="w-10 font-bold">{v.ml}ml</span>
                                <span className={`w-16 ${v.stock === 0 ? "text-[#D71921] font-bold" : v.stock < 5 ? "text-[#d3b000] font-bold" : "text-[var(--text-secondary)]"}`}>
                                  Stock: {v.stock}
                                </span>
                                <span className="text-[var(--text-disabled)]">
                                  C: ${v.costo || "--"}
                                </span>
                                <span className="text-[var(--text-primary)] font-medium">
                                  P: ${v.precio}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/productos/${p.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 hover:bg-[var(--surface-raised)] rounded text-[var(--text-secondary)] hover:text-[var(--text-display)] transition-colors"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(p.id);
                              }}
                              disabled={deletingId === p.id}
                              className="p-2 hover:bg-[rgba(215,25,33,0.05)] rounded text-[var(--text-secondary)] hover:text-[#D71921] transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border)] pt-8 gap-4">
          <p className="text-nd-body-sm">
            Mostrando <span className="text-[var(--text-display)] font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="text-[var(--text-display)] font-medium">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> de <span className="text-[var(--text-display)] font-medium">{filteredProducts.length}</span> productos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-display)] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition-all ${currentPage === i + 1 ? "bg-[var(--text-display)] text-[var(--black)]" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-display)]"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-display)] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-disabled)] mb-4">
            <Search size={32} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-display font-medium text-[var(--text-display)]">No encontramos resultados</h3>
          <p className="text-nd-body-sm text-[var(--text-disabled)] max-w-xs text-center mt-2">
            Intenta ajustar los filtros de búsqueda o stock para encontrar lo que buscas.
          </p>
          {(searchTerm || selectedBrand !== "all" || selectedGender !== "all" || stockFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedBrand("all");
                setSelectedGender("all");
                setStockFilter("all");
              }}
              className="mt-6 nd-btn-ghost !min-h-fit !px-4 !py-2 border border-[var(--border)] rounded-full"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
