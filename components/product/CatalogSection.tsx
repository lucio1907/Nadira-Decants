"use client";

import { useState, useMemo, useTransition, useCallback, useRef, useEffect } from "react";
import { Producto } from "@/types";
import { ProductCard } from "./ProductCard";
import { Search, X, ChevronDown, SlidersHorizontal, Mars, Venus, Users, Sparkles } from "lucide-react";

interface CatalogSectionProps {
  productos: Producto[];
}

type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "nombre-az" | "nombre-za";
type GenderFilter = "todos" | "Hombre" | "Mujer" | "Unisex";

const SORT_LABELS: Record<SortOption, string> = {
  "relevancia": "Relevancia",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
  "nombre-az": "A → Z",
  "nombre-za": "Z → A",
};

const GENDER_CONFIG: { value: GenderFilter; label: string; icon: typeof Users }[] = [
  { value: "todos", label: "Todos", icon: Sparkles },
  { value: "Hombre", label: "Hombre", icon: Mars },
  { value: "Mujer", label: "Mujer", icon: Venus },
  { value: "Unisex", label: "Unisex", icon: Users },
];

// Refined responsive search & filter experience — Nadira Decants
export const CatalogSection = ({ productos }: CatalogSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderFilter>("todos");
  const [sortBy, setSortBy] = useState<SortOption>("relevancia");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [, startTransition] = useTransition();

  const sortRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract unique brands from products
  const brands = useMemo(() => {
    const brandSet = new Set(productos.map((p) => p.marca));
    return Array.from(brandSet).sort();
  }, [productos]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animate filters in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsFilterVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  }, []);

  const handleBrandSelect = useCallback((brand: string | null) => {
    startTransition(() => {
      setSelectedBrand(brand);
    });
  }, []);

  const handleGenderSelect = useCallback((gender: GenderFilter) => {
    startTransition(() => {
      setSelectedGender(gender);
    });
  }, []);

  const handleSortSelect = useCallback((sort: SortOption) => {
    startTransition(() => {
      setSortBy(sort);
      setIsSortOpen(false);
    });
  }, []);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...productos];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrand) {
      result = result.filter((p) => p.marca === selectedBrand);
    }

    // Gender filter
    if (selectedGender !== "todos") {
      result = result.filter((p) => p.genero === selectedGender);
    }

    // Sort
    switch (sortBy) {
      case "precio-asc":
        result.sort((a, b) => {
          const aMin = Math.min(...a.variantes.map((v) => v.precio));
          const bMin = Math.min(...b.variantes.map((v) => v.precio));
          return aMin - bMin;
        });
        break;
      case "precio-desc":
        result.sort((a, b) => {
          const aMin = Math.min(...a.variantes.map((v) => v.precio));
          const bMin = Math.min(...b.variantes.map((v) => v.precio));
          return bMin - aMin;
        });
        break;
      case "nombre-az":
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "nombre-za":
        result.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }

    return result;
  }, [productos, searchQuery, selectedBrand, selectedGender, sortBy]);

  const hasActiveFilters = searchQuery.trim() || selectedBrand || selectedGender !== "todos";

  const clearAllFilters = () => {
    startTransition(() => {
      setSearchQuery("");
      setSelectedBrand(null);
      setSelectedGender("todos");
      setSortBy("relevancia");
    });
  };

  return (
    <div
      style={{
        opacity: isFilterVisible ? 1 : 0,
        transform: isFilterVisible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 600ms ease, transform 600ms ease",
      }}
    >
      {/* ─── FILTER BAR ─── */}
      <div
        className="relative mb-12 px-5 sm:px-8 py-7"
        suppressHydrationWarning
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          borderRadius: "2px",
        }}
      >
        {/* Subtle corner accents */}
        <div
          className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
          style={{
            borderTop: "1px solid var(--accent)",
            borderLeft: "1px solid var(--accent)",
            opacity: 0.3,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
          style={{
            borderBottom: "1px solid var(--accent)",
            borderRight: "1px solid var(--accent)",
            opacity: 0.3,
          }}
        />

        {/* Row 1: Search + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          {/* Search Input */}
          <div
            className="relative flex-1 group"
            style={{ maxWidth: "480px" }}
          >
            <Search
              size={14}
              className="absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ color: "var(--text-disabled)" }}
            />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por nombre, marca..."
              className="w-full bg-transparent border-none outline-none transition-all duration-300"
              style={{
                paddingLeft: "28px",
                paddingRight: searchQuery ? "32px" : "0",
                paddingBottom: "12px",
                paddingTop: "4px",
                borderBottom: "1px solid var(--border-visible)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                letterSpacing: "0.02em",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = "var(--accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)";
              }}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 transition-all duration-200 hover:scale-110 opacity-70 hover:opacity-100"
                style={{ color: "var(--text-disabled)" }}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
            {/* Focus underline accent */}
            <div
              className="absolute bottom-0 left-0 h-[1px] transition-all duration-500"
              style={{
                width: searchQuery ? "100%" : "0%",
                background: "linear-gradient(90deg, var(--accent), transparent)",
                opacity: 0.6,
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative ml-auto" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 transition-all duration-300 hover:text-[var(--text-display)]"
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border)",
                background: "transparent",
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "var(--text-secondary)",
                minHeight: "36px",
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={12} />
              <span>{SORT_LABELS[sortBy]}</span>
              <ChevronDown
                size={12}
                className="transition-transform duration-300"
                style={{
                  transform: isSortOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown */}
            {isSortOpen && (
              <div
                className="absolute right-0 top-full mt-2 z-50 overflow-hidden"
                style={{
                  minWidth: "180px",
                  background: "var(--surface)",
                  border: "1px solid var(--border-visible)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                  animation: "nd-fade-in-up 200ms ease forwards",
                }}
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortSelect(option)}
                    className="w-full text-left transition-all duration-200"
                    style={{
                      padding: "12px 20px",
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: sortBy === option ? "var(--accent)" : "var(--text-secondary)",
                      background: sortBy === option ? "var(--accent-subtle)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "block",
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== option) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== option) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }
                    }}
                  >
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Brand Chips + Gender Toggle */}
        <div className="flex flex-col gap-5">
          {/* Brand filter rail */}
          <div className="flex flex-col gap-2">
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "var(--text-disabled)",
                marginBottom: "4px",
              }}
            >
              Marca
            </span>

            <div
              className="flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* "Todas" chip */}
              <button
                onClick={() => handleBrandSelect(null)}
                className="shrink-0 transition-all duration-300"
                style={{
                  padding: "6px 16px",
                  border: `1px solid ${!selectedBrand ? "var(--text-display)" : "var(--border)"}`,
                  background: !selectedBrand ? "var(--text-display)" : "transparent",
                  color: !selectedBrand ? "var(--black)" : "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  fontWeight: !selectedBrand ? 600 : 400,
                }}
              >
                Todas
              </button>

              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandSelect(selectedBrand === brand ? null : brand)}
                  className="shrink-0 transition-all duration-300"
                  style={{
                    padding: "6px 16px",
                    border: `1px solid ${selectedBrand === brand ? "var(--text-display)" : "var(--border)"}`,
                    background: selectedBrand === brand ? "var(--text-display)" : "transparent",
                    color: selectedBrand === brand ? "var(--black)" : "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    cursor: "pointer",
                    fontWeight: selectedBrand === brand ? 600 : 400,
                  }}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Gender segmented control */}
          <div className="flex flex-col gap-2">
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "var(--text-disabled)",
                marginBottom: "4px",
              }}
            >
              Género
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {GENDER_CONFIG.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleGenderSelect(value)}
                  className="flex items-center gap-1.5 transition-all duration-300"
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${selectedGender === value ? "var(--accent)" : "var(--border)"}`,
                    background: selectedGender === value ? "var(--accent-subtle)" : "transparent",
                    color: selectedGender === value ? "var(--accent)" : "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    cursor: "pointer",
                    fontWeight: selectedGender === value ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedGender !== value) {
                      e.currentTarget.style.borderColor = "rgba(211, 176, 0, 0.3)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedGender !== value) {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <Icon size={12} strokeWidth={2.5} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter summary + clear */}
        {hasActiveFilters && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 pt-5 gap-4"
            style={{
              borderTop: "1px solid var(--border)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "var(--text-disabled)",
                  whiteSpace: "nowrap",
                }}
              >
                {filteredProducts.length}
                {filteredProducts.length === 1 ? " resultado" : " resultados"}
              </span>

              {/* Active filter tags */}
              <div className="flex flex-wrap gap-1.5">
                {searchQuery.trim() && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5"
                    style={{
                      background: "rgba(211, 176, 0, 0.08)",
                      border: "1px solid rgba(211, 176, 0, 0.15)",
                      fontFamily: "var(--font-body)",
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    &ldquo;{searchQuery.trim()}&rdquo;
                    <button
                      onClick={() => handleSearchChange("")}
                      className="ml-0.5 hover:scale-110 transition-transform p-1"
                      aria-label="Quitar filtro de búsqueda"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5"
                    style={{
                      background: "rgba(211, 176, 0, 0.08)",
                      border: "1px solid rgba(211, 176, 0, 0.15)",
                      fontFamily: "var(--font-body)",
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {selectedBrand}
                    <button
                      onClick={() => handleBrandSelect(null)}
                      className="ml-0.5 hover:scale-110 transition-transform p-1"
                      aria-label="Quitar filtro de marca"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {selectedGender !== "todos" && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5"
                    style={{
                      background: "rgba(211, 176, 0, 0.08)",
                      border: "1px solid rgba(211, 176, 0, 0.15)",
                      fontFamily: "var(--font-body)",
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {selectedGender}
                    <button
                      onClick={() => handleGenderSelect("todos")}
                      className="ml-0.5 hover:scale-110 transition-transform p-1"
                      aria-label="Quitar filtro de género"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={clearAllFilters}
              className="transition-all duration-300 hover:text-[var(--accent)]"
              style={{
                background: "none",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--text-disabled)",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* ─── PRODUCT GRID ─── */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((producto, i) => (
            <ProductCard key={producto.id} producto={producto} index={i} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          style={{ minHeight: "300px" }}
        >
          {/* Decorative empty icon */}
          <div
            className="mb-6"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--accent-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={22} style={{ color: "var(--accent)", opacity: 0.6 }} />
          </div>

          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--heading)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--text-display)",
            }}
          >
            Sin resultados
          </p>

          <p
            className="mb-8"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--body-sm)",
              color: "var(--text-disabled)",
              maxWidth: "320px",
              lineHeight: 1.6,
            }}
          >
            No encontramos fragancias con esos filtros. Probá con otros criterios de búsqueda.
          </p>

          <button
            onClick={clearAllFilters}
            className="nd-btn-secondary px-8"
          >
            Ver todo el catálogo
          </button>
        </div>
      )}
    </div>
  );
};
