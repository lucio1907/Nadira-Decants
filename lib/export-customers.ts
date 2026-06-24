import { format } from "date-fns";
import { CustomerSummary } from "./customers";

function toRows(customers: CustomerSummary[]) {
  return customers.map(c => ({
    "Nombre": c.nombre,
    "Apellido": c.apellido,
    "Email": c.email,
    "Teléfono": c.telefono,
    "Dirección": c.direccion,
    "Localidad": c.localidad,
    "Provincia": c.provincia,
    "CP": c.cp,
    "Cantidad de Órdenes": c.cantidadOrdenes,
    "Total Gastado (ARS)": c.totalGastado,
    "Primera Compra": format(c.primeraCompra, "dd/MM/yyyy"),
    "Última Compra": format(c.ultimaCompra, "dd/MM/yyyy"),
  }));
}

export async function exportCustomers(
  customers: CustomerSummary[],
  fileFormat: "csv" | "xlsx"
) {
  const XLSX = await import("xlsx");
  const rows = toRows(customers);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Clientes");

  const dateStr = format(new Date(), "yyyy-MM-dd");
  const filename = `clientes-nadira-${dateStr}.${fileFormat}`;

  XLSX.writeFile(wb, filename, { bookType: fileFormat });
}
