"use client";

import { AlertTriangle } from "lucide-react";

export function UmamiDashboardClient() {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_SHARE_URL;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-[var(--text-display)]">Métricas Web</h1>
          <p className="text-[var(--text-secondary)] font-body text-sm uppercase tracking-widest mt-1">Tráfico y Comportamiento de Usuarios</p>
        </div>
      </div>

      <div className="animate-in fade-in duration-500 w-full h-[800px] md:h-[900px]">
        {umamiUrl ? (
          <div className="h-full w-full nd-card overflow-hidden">
            <iframe
              src={umamiUrl}
              frameBorder="0"
              width="100%"
              height="100%"
              title="Umami Analytics"
              className="w-full h-full bg-white/5"
            ></iframe>
          </div>
        ) : (
          <div className="nd-card w-full h-full flex flex-col items-center justify-center text-[var(--text-disabled)]">
            <AlertTriangle size={48} className="mb-4 opacity-20 text-[#D71921]" />
            <p className="font-display text-xl text-[var(--text-primary)] mb-2">Umami no configurado</p>
            <p className="text-sm mb-6 max-w-md text-center">Para ver las métricas de tráfico, por favor configurá la URL pública de Umami en el archivo de configuración (.env).</p>
            <code className="text-xs bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-2 rounded text-[var(--text-primary)]">
              NEXT_PUBLIC_UMAMI_SHARE_URL="https://analytics.umami.is/share/..."
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
