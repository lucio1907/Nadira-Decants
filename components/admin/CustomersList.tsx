"use client";

import { useState, useRef, useEffect } from "react";
import { CustomerSummary } from "@/lib/customers";
import { exportCustomers } from "@/lib/export-customers";
import {
  Search,
  Download,
  Users,
  ShoppingBag,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

interface CustomersListProps {
  customers: CustomerSummary[];
}

export default function CustomersList({ customers }: CustomersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 15;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.telefono.includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const totalRevenue = customers.reduce((s, c) => s + c.totalGastado, 0);
  const totalOrders = customers.reduce((s, c) => s + c.cantidadOrdenes, 0);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  const handleExport = async (fmt: "csv" | "xlsx") => {
    setDropdownOpen(false);
    setIsExporting(true);
    try {
      await exportCustomers(customers, fmt);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-body uppercase tracking-[0.2em]">Clientes Únicos</span>
            <Users size={18} className="text-[var(--accent)]" />
          </div>
          <div className="text-2xl font-display text-[var(--text-display)]">{customers.length}</div>
          <div className="text-[10px] text-[var(--text-secondary)]">Deduplicados por email/teléfono</div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-body uppercase tracking-[0.2em]">Órdenes Totales</span>
            <ShoppingBag size={18} className="text-blue-500" />
          </div>
          <div className="text-2xl font-display text-[var(--text-display)]">{totalOrders}</div>
          <div className="text-[10px] text-[var(--text-secondary)]">Promedio {(totalOrders / Math.max(customers.length, 1)).toFixed(1)} por cliente</div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-body uppercase tracking-[0.2em]">Facturación Total</span>
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <div className="text-2xl font-display text-[var(--text-display)]">{formatCurrency(totalRevenue)}</div>
          <div className="text-[10px] text-[var(--text-secondary)]">Órdenes aprobadas/enviadas/entregadas</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Export button + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-black rounded-lg text-xs font-body uppercase tracking-widest hover:bg-[var(--accent)]/90 transition-all disabled:opacity-50"
          >
            <Download size={16} />
            {isExporting ? "Exportando..." : "Exportar"}
            <span className="ml-1 opacity-60">▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl shadow-2xl z-20 overflow-hidden">
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
              >
                <FileText size={16} />
                CSV (.csv)
              </button>
              <button
                onClick={() => handleExport("xlsx")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors border-t border-[var(--border)]"
              >
                <FileSpreadsheet size={16} />
                Excel (.xlsx)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Contacto</th>
                <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Localidad</th>
                <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)] text-center">Órdenes</th>
                <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)] text-right">Total Gastado</th>
                <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Última Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginated.length > 0 ? (
                paginated.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[var(--text-display)]">
                        {c.nombre} {c.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[var(--text-primary)]">{c.email || "—"}</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">{c.telefono || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[var(--text-primary)]">{c.localidad || "—"}</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">{c.provincia || ""}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold">
                        {c.cantidadOrdenes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-display text-[var(--text-display)]">
                        {formatCurrency(c.totalGastado)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[var(--text-primary)]">
                        {c.ultimaCompra.toLocaleDateString("es-AR")}
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)]">
                        Primera: {c.primeraCompra.toLocaleDateString("es-AR")}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-[var(--text-secondary)] italic">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-8">
          <p className="text-[10px] font-body uppercase tracking-wider text-[var(--text-secondary)]">
            Mostrando <span className="text-[var(--text-display)] font-medium">{Math.min(filtered.length, itemsPerPage)}</span> de{" "}
            <span className="text-[var(--text-display)] font-medium">{filtered.length}</span> clientes
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              if (totalPages > 7 && n !== 1 && n !== totalPages && (n < currentPage - 1 || n > currentPage + 1)) {
                if (n === 2 || n === totalPages - 1) return <span key={n} className="px-1 text-[var(--text-secondary)]">...</span>;
                return null;
              }
              return (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-medium transition-all ${currentPage === n ? "bg-[var(--accent)] text-black shadow-lg" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"}`}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
