"use client";

import { useState, useRef, useEffect } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface Props {
  selected?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  label?: string;
}

export function CustomDatePicker({ selected, onChange, placeholder = "Seleccionar fecha", label }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleSelect = (day: Date) => {
    onChange(day);
    setIsOpen(false);
  };

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i);

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={containerRef}>
      {label && <label className="text-nd-label mb-1">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="nd-input flex items-center justify-between text-left group"
      >
        <span className={selected ? "text-[var(--text-primary)]" : "text-[var(--text-disabled)]"}>
          {selected ? format(selected, "dd 'de' MMMM, yyyy", { locale: es }) : placeholder}
        </span>
        <CalendarIcon size={16} className="text-[var(--text-disabled)] group-hover:text-[var(--accent)] transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-[60] mt-2 p-5 bg-[var(--surface-raised)] border border-[var(--border-visible)] shadow-2xl nd-animate-fade-in min-w-[320px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--accent)] uppercase font-bold tracking-[0.2em] mb-1">
                {format(currentMonth, "MMMM", { locale: es })}
              </span>
              <div className="flex items-center gap-2">
                <select 
                  value={currentMonth.getFullYear()}
                  onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))}
                  className="bg-transparent text-lg font-display font-medium text-[var(--text-display)] outline-none cursor-pointer hover:text-[var(--accent)] transition-colors appearance-none"
                >
                  {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 1 + i).map(y => (
                    <option key={y} value={y} className="bg-[var(--surface-raised)] text-sm">{y}</option>
                  ))}
                </select>
                <div className="text-[var(--text-disabled)] pointer-events-none">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4.5L6 7.5L9 4.5"/></svg>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={prevMonth}
                className="p-2 hover:bg-[var(--surface)] hover:text-[var(--accent)] transition-all rounded-full border border-transparent hover:border-[var(--border-visible)]"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button"
                onClick={nextMonth}
                className="p-2 hover:bg-[var(--surface)] hover:text-[var(--accent)] transition-all rounded-full border border-transparent hover:border-[var(--border-visible)]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>


          {/* Week Days */}
          <div className="grid grid-cols-7 mb-2">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
              <div key={i} className="text-center text-[10px] text-[var(--text-disabled)] font-bold py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isSelected = selected && isSameDay(day, selected);
              const isCurrMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={`
                    h-9 w-9 flex items-center justify-center text-xs transition-all rounded-sm
                    ${isSelected 
                      ? "bg-[var(--accent)] text-[var(--black)] font-bold" 
                      : !isCurrMonth 
                        ? "text-[var(--text-disabled)] opacity-30 cursor-default" 
                        : "text-[var(--text-primary)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                    }
                    ${today && !isSelected ? "border border-[var(--accent)]/30" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Footer / Today button */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-end">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                handleSelect(today);
              }}
              className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
