import { Order } from "@/types";

export interface CustomerSummary {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  provincia: string;
  cp: string;
  cantidadOrdenes: number;
  totalGastado: number;
  primeraCompra: Date;
  ultimaCompra: Date;
}

const REVENUE_STATUSES = ["approved", "shipped", "delivered"];

export function getUniqueCustomers(orders: Order[]): CustomerSummary[] {
  const map = new Map<string, { orders: Order[] }>();

  for (const order of orders) {
    const key = (order.payerEmail?.toLowerCase().trim() || order.clienteTelefono?.trim() || "").replace(/\s+/g, "");
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, { orders: [] });
    }
    map.get(key)!.orders.push(order);
  }

  const customers: CustomerSummary[] = [];

  for (const { orders: customerOrders } of map.values()) {
    const sorted = [...customerOrders].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const latest = sorted[0];
    const earliest = sorted[sorted.length - 1];

    const latestWithAddress = sorted.find(o => o.direccionEnvio?.calle);
    const addr = latestWithAddress?.direccionEnvio;

    const totalGastado = customerOrders
      .filter(o => REVENUE_STATUSES.includes(o.status))
      .reduce((sum, o) => sum + o.total, 0);

    customers.push({
      nombre: latest.clienteNombre || "",
      apellido: latest.clienteApellido || "",
      email: latest.payerEmail || "",
      telefono: latest.clienteTelefono || "",
      direccion: addr ? `${addr.calle || ""} ${addr.numero || ""}`.trim() : "",
      localidad: addr?.ciudad || "",
      provincia: addr?.provincia || "",
      cp: addr?.codigoPostal || "",
      cantidadOrdenes: customerOrders.length,
      totalGastado,
      primeraCompra: earliest.createdAt,
      ultimaCompra: latest.createdAt,
    });
  }

  return customers.sort((a, b) => b.ultimaCompra.getTime() - a.ultimaCompra.getTime());
}
