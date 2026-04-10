"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, isVisible, onClose, duration = 3500 }: ToastProps) => {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setExiting(false);
      // Small delay for mount animation
      requestAnimationFrame(() => setShow(true));

      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setShow(false);
          onClose();
        }, 400);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setShow(false);
      setExiting(false);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !show) return null;

  return (
    <div
      className="fixed top-20 right-4 sm:right-6 z-[100]"
      style={{
        transform: show && !exiting ? "translateY(0)" : "translateY(-20px)",
        opacity: show && !exiting ? 1 : 0,
        transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div
        className="flex items-center gap-3 pl-4 pr-3 py-3 shadow-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-visible)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          maxWidth: "340px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.3), 0 0 20px rgba(211, 176, 0, 0.08)",
        }}
      >
        {/* Check icon */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "var(--accent)",
          }}
        >
          <Check size={13} strokeWidth={3} style={{ color: "var(--black)" }} />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-display)",
              lineHeight: 1.3,
            }}
          >
            {message}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--text-disabled)",
              marginTop: "2px",
            }}
          >
            Seguí explorando o revisá tu bolso
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(() => {
              setShow(false);
              onClose();
            }, 300);
          }}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10"
          style={{ color: "var(--text-disabled)" }}
          aria-label="Cerrar notificación"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="h-[2px] mt-0"
        style={{
          background: "var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, var(--accent), var(--accent-hover))",
            animation: show && !exiting ? `toastProgress ${duration}ms linear forwards` : "none",
            transformOrigin: "left",
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastProgress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}} />
    </div>
  );
};
