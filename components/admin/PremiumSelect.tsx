"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface PremiumSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showSearch?: boolean;
  className?: string;
}

export function PremiumSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  label,
  showSearch = false,
  className = "",
}: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-1.5 block">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-[var(--surface-raised)] border rounded-lg transition-all duration-300 text-sm group ${
          isOpen ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/20 shadow-lg" : "border-[var(--border)] hover:border-[var(--border-visible)]"
        }`}
      >
        <span className={`${!selectedOption ? "text-[var(--text-disabled)]" : "text-[var(--text-primary)]"} truncate`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--accent)]" : "group-hover:text-[var(--text-primary)]"}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full min-w-[200px] bg-[var(--surface-raised)] border border-[var(--border-visible)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-md">
          {showSearch && (
            <div className="p-2 border-b border-[var(--border)]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-disabled)]" size={14} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md py-1.5 pl-8 pr-8 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-disabled)] hover:text-[var(--text-primary)]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="max-h-[250px] overflow-y-auto scrollbar-hide py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors ${
                    value === opt.value 
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <Check size={14} />}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-[var(--text-disabled)] text-[10px] uppercase tracking-widest italic">
                No hay resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
