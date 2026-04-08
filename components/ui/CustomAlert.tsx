"use client";

import React, { useEffect, useState } from "react";

export type AlertType = "info" | "success" | "warning" | "error" | "confirm";

interface CustomAlertProps {
  isOpen: boolean;
  type: AlertType;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}


const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  type,
  title,
  message,
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {

  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = "unset";
      }, 400); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-12 h-12 text-nd-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-12 h-12 text-[#D71921]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "warning":
      case "confirm":
        return (
          <svg className="w-12 h-12 text-nd-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-nd-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "success": return "Operación Exitosa";
      case "error": return "Error";
      case "warning": return "Atención";
      case "confirm": return "¿Estás seguro?";
      default: return "Aviso";
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 transition-all duration-500 ease-out ${
        isOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      <div 
        className={`nd-card w-full max-w-md transform transition-all duration-500 ease-out flex flex-col items-center text-center gap-6 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
        }`}
        style={{ 
          border: "1px solid var(--border-visible)",
          padding: "var(--space-xl) var(--space-lg)" 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-2">
          {getIcon()}
        </div>

        <div className="space-y-3">
          <h3 className="text-display-md" style={{ fontSize: "1.25rem", color: "var(--text-display)" }}>
            {title || getDefaultTitle()}
          </h3>
          <p className="text-nd-body-sm text-center leading-relaxed max-w-[280px] mx-auto">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          {type === "confirm" && (
            <button 
              onClick={onCancel}
              className="nd-btn-secondary flex-1"
              style={{ padding: "12px 24px", minHeight: "44px" }}
            >
              {cancelLabel}
            </button>
          )}
          <button 
            onClick={onConfirm}
            className={`nd-btn-primary flex-1 ${isDestructive ? "hover:!bg-[#D71921] hover:!border-[#D71921]" : ""}`}
            style={{ padding: "12px 24px", minHeight: "44px" }}
          >
            {confirmLabel}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
