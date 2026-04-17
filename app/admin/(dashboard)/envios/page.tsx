import { Metadata } from "next";
import { getShippingConfig, getShippingBoxes } from "@/lib/shipping-config";
import { ShippingConfigForm } from "@/components/admin/shipping/ShippingConfigForm";
import { Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Administración de Envíos | Nadira Admin",
  description: "Configuración global de pesos y logística para envia.com",
};

export default async function EnviosPage() {
  const [config, boxes] = await Promise.all([
    getShippingConfig(),
    getShippingBoxes()
  ]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Truck className="text-[var(--accent)]" size={32} />
          <h1 className="text-3xl md:text-4xl font-display text-[var(--text-display)] tracking-tight">
            Gestión de Envíos
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] font-body max-w-2xl">
          Configura los parámetros globales de peso que se envían a la API de envia.com para el cálculo de costos y generación de etiquetas de Correo Argentino.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10">
        <section>
          <ShippingConfigForm initialConfig={config} initialBoxes={boxes} />
        </section>
        
        {/* Aquí se podrían agregar otras secciones en el futuro, como historial de guías generadas o saldo de envia.com */}
      </div>
    </div>
  );
}
