"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] nd-animate-fade-in-up">
      <div className="nd-glass-raised px-6 py-3 rounded-full flex items-center gap-3 border border-[var(--accent)] shadow-lg shadow-[var(--accent-subtle)]">
        <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <Check size={12} className="text-[var(--black)]" strokeWidth={3} />
        </div>
        <span className="text-display-xs font-medium tracking-wide text-[var(--text-display)]">
          {message}
        </span>
      </div>
    </div>
  );
};
