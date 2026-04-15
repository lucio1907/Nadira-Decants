"use client";

import { useState, useEffect, useTransition } from "react";
import { Order } from "@/types";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  XCircle,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { updateOrderAction } from "@/app/admin/(dashboard)/ordenes/actions";

interface OrdersListProps {
  initialOrders: Order[];
}

export default function OrdersList({ initialOrders }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const { showAlert } = useAlert();


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setTrackingInput(selectedOrder.trackingNumber || "");
    } else {
      setTrackingInput("");
    }
  }, [selectedOrder]);

  // Statistics
  const totalSales = orders
    .filter(o => ["approved", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => ["pending", "in_process"].includes(o.status)).length;
  const approvedCount = orders.filter(o => o.status === "approved").length;
  const shippedTotal = orders
    .filter(o => o.metodoEntrega === "envio" && ["shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const customerName = `${order.clienteNombre} ${order.clienteApellido}`.toLowerCase();
    const matchesSearch =
      customerName.includes(searchLower) ||
      order.id?.toLowerCase().includes(searchLower) ||
      order.payerEmail?.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const result = await updateOrderAction(orderId, newStatus, trackingInput);

        if (result.success) {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, trackingNumber: trackingInput } : o));
          if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus, trackingNumber: trackingInput });
          }
          showAlert("Estado actualizado correctamente", { type: "success" });
        } else {
          showAlert(result.error || "Error al actualizar el estado", { type: "error" });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        showAlert("Error inesperado al intentar actualizar el estado.", { type: "error" });
      } finally {
        setIsLoading(false);
      }
    });
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "approved": return "Aprobado";
      case "pending": return "Pendiente";
      case "shipped": return "Enviado";
      case "delivered": return "Entregado";
      case "rejected": return "Rechazado";
      case "in_process": return "En proceso";
      case "whatsapp": return "WhatsApp (Transf.)";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "delivered": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "in_process": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "whatsapp": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 size={14} />;
      case "pending": return <Clock size={14} />;
      case "shipped": return <Truck size={14} />;
      case "delivered": return <Package size={14} />;
      case "rejected": return <XCircle size={14} />;
      case "whatsapp": return <MessageCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const copyShippingInfo = (order: Order) => {
    if (!order.direccionEnvio) return;
    const info = `
Destinatario: ${order.clienteNombre} ${order.clienteApellido}
Dirección: ${order.direccionEnvio.calle} ${order.direccionEnvio.numero}
${order.direccionEnvio.piso ? `Piso/Depto: ${order.direccionEnvio.piso} ${order.direccionEnvio.depto}` : ""}
Localidad: ${order.direccionEnvio.ciudad}
Provincia: ${order.direccionEnvio.provincia}
Código Postal: ${order.direccionEnvio.codigoPostal}
Teléfono: ${order.clienteTelefono || "N/A"}
Email: ${order.payerEmail}
`.trim();

    navigator.clipboard.writeText(info);
    showAlert("Datos de envío copiados al portapapeles ✅", { type: "success" });
  };


  return (
    <div className="space-y-8 pb-20">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-body uppercase tracking-[0.2em]">Ventas Totales</span>
            <TrendingUp size={18} className="text-[var(--accent)]" />
          </div>
          <div className="text-2xl font-display text-[var(--text-display)]">
            {formatCurrency(totalSales)}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">Ventas aprobadas/enviadas</div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-body uppercase tracking-[0.2em]">Pendientes</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-display text-[var(--text-display)]">
            {pendingCount}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">Esperando aprobación/proceso</div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-body uppercase tracking-[0.2em]">Aprobados</span>
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
          <div className="text-2xl font-display text-[var(--text-display)]">
            {approvedCount}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">Listos para despachar</div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-body uppercase tracking-[0.2em]">Enviados / Total</span>
            <Truck size={18} className="text-blue-500" />
          </div>
          <div className="text-2xl font-display text-[var(--text-display)]">
            {formatCurrency(shippedTotal)}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">Suma total de órdenes enviadas</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente, ID o email..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            defaultValue={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              startTransition(() => {
                setSearchTerm(val);
              });
            }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scrollbar-hide">
          {["all", "whatsapp", "pending", "approved", "shipped", "delivered", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => {
                startTransition(() => {
                  setFilter(s);
                });
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-body uppercase tracking-widest border transition-all whitespace-nowrap ${filter === s
                ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
            >
              {s === "all" ? "Todos" : s === "whatsapp" ? "WhatsApp" : s === "pending" ? "Pendientes" : s === "approved" ? "Aprobados" : s === "shipped" ? "Enviados" : s === "delivered" ? "Entregados" : "Rechazados"}
            </button>
          ))}
        </div>
      </div >

      {/* Orders Table */}
      <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}>
  <div className="overflow-x-auto selection:bg-[var(--accent)]/30">
    <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-full">
      <thead>
        <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
          <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">ID Orden</th>
          <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Fecha</th>
          <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Cliente</th>
          <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Estado</th>
          <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)]">Método</th>
          <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)] text-right">Total</th>
          <th className="px-6 py-4 text-[10px] font-body uppercase tracking-widest text-[var(--text-secondary)] text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--border)]">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <tr
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="hover:bg-[rgba(255,255,255,0.01)] transition-colors group cursor-pointer"
            >
              <td className="px-6 py-4">
                <span className="text-[11px] font-mono text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                  #{order.id?.slice(-8).toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-[var(--text-primary)]">
                  {isMounted ? order.createdAt.toLocaleDateString('es-AR') : '...'}
                </div>
                <div className="text-[10px] text-[var(--text-secondary)]">
                  {isMounted ? order.createdAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '...'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-[var(--text-display)]">
                  {order.clienteNombre} {order.clienteApellido}
                </div>
                <div className="text-[10px] text-[var(--text-secondary)]">
                  {order.payerEmail}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="uppercase tracking-wider">{translateStatus(order.status)}</span>
                </span>
                {order.trackingNumber && (
                  <div className="mt-1 flex items-center gap-1 text-[9px] text-[var(--accent)] font-mono">
                    <Package size={10} />
                    {order.trackingNumber}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  {order.metodoEntrega === "envio" ? <Truck size={14} /> : <MapPin size={14} />}
                  <span className="text-[11px] uppercase tracking-tighter">{order.metodoEntrega}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-display text-[var(--text-display)]">
                  {formatCurrency(order.total)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-all"
                    title="Ver detalles"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="px-6 py-20 text-center text-[var(--text-secondary)] italic">
              No se encontraron órdenes matcheando el filtro.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
      </div >

  {/* Detail Modal */ }
{
  selectedOrder && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[var(--surface-raised)] border border-[var(--border)] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-display text-[var(--text-display)]">Detalle de Orden</h2>
            <p className="text-xs text-[var(--text-secondary)] font-body uppercase tracking-widest mt-1">ID: #{selectedOrder.id}</p>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-full transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Column 1: Client Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-body tracking-[0.2em] uppercase text-[var(--text-secondary)] border-b border-[var(--border)] pb-2">Información del Cliente</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Nombre</p>
                      <p className="text-sm font-medium">{selectedOrder.clienteNombre} {selectedOrder.clienteApellido}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Email</p>
                      <p className="text-sm font-medium break-all">{selectedOrder.payerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Teléfono</p>
                      <p className="text-sm font-medium">{selectedOrder.clienteTelefono || "No proporcionado"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-[10px] font-body tracking-[0.2em] uppercase text-[var(--text-secondary)] border-b border-[var(--border)] pb-2">Pago</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Mercado Pago ID</p>
                      <p className="text-[11px] font-mono">{selectedOrder.mpPaymentId || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Total Abonado</p>
                      <p className="text-sm font-display text-[var(--accent)]">{formatCurrency(selectedOrder.total)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Order Summary & Shipment */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-body tracking-[0.2em] uppercase text-[var(--text-secondary)] border-b border-[var(--border)] pb-2">Items del Pedido</h3>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[rgba(255,255,255,0.02)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Producto</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] text-center">Variante</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] text-center">Cant.</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] text-right">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={`${item.id}-${idx}`}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium">{item.nombre}</div>
                            <div className="text-[10px] text-[var(--text-secondary)]">{item.marca}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-[11px] bg-[var(--surface-raised)] px-2 py-0.5 border border-[var(--border)] rounded">
                              {item.variante.ml}ml
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-body">x{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-sm font-body">{formatCurrency(item.variante.precio)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[rgba(255,255,255,0.02)] border-t border-[var(--border)]">
                      {selectedOrder.shippingCost && selectedOrder.shippingCost > 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Costo de Envío</td>
                          <td className="px-4 py-2 text-right text-sm font-body">{formatCurrency(selectedOrder.shippingCost)}</td>
                        </tr>
                      ) : null}
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right text-[10px] uppercase tracking-widest font-bold text-[var(--text-display)]">Total Final</td>
                        <td className="px-4 py-3 text-right text-base font-display text-[var(--accent)]">{formatCurrency(selectedOrder.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-body tracking-[0.2em] uppercase text-[var(--text-secondary)] border-b border-[var(--border)] pb-2">Entrega</h3>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                      {selectedOrder.metodoEntrega === "envio" ? <Truck size={16} /> : <MapPin size={16} />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Método</p>
                      <p className="text-sm font-medium uppercase">{selectedOrder.metodoEntrega}</p>
                      {selectedOrder.metodoEntrega === "envio" && selectedOrder.direccionEnvio && (
                        <div className="mt-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-[var(--text-display)] font-medium mb-1">
                            <MapPin size={14} className="text-[var(--accent)]" />
                            <span>Dirección de Envío</span>
                          </div>
                          <p>{selectedOrder.direccionEnvio.calle} {selectedOrder.direccionEnvio.numero}</p>
                          {selectedOrder.direccionEnvio.piso && <p>Piso {selectedOrder.direccionEnvio.piso} {selectedOrder.direccionEnvio.depto}</p>}
                          <p>{selectedOrder.direccionEnvio.ciudad}, {selectedOrder.direccionEnvio.provincia}</p>
                          <p className="text-[var(--text-secondary)]">CP: {selectedOrder.direccionEnvio.codigoPostal}</p>
                          <button
                            onClick={() => copyShippingInfo(selectedOrder)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl text-[10px] font-body uppercase tracking-widest text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all"
                          >
                            <Package size={14} />
                            Copiar Datos para Correo
                          </button>
                          {selectedOrder.direccionEnvio.notas && (
                            <div className="mt-2 pt-2 border-t border-[var(--border)] text-xs italic text-[var(--text-secondary)]">
                              &quot; {selectedOrder.direccionEnvio.notas} &quot;
                            </div>
                          )}
                        </div>
                      )}
                      {selectedOrder.metodoEntrega === "retiro" && (
                        <div className="mt-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center gap-3 text-amber-500 bg-amber-500/5 border-amber-500/20">
                          <AlertCircle size={18} />
                          <p className="text-xs font-medium">El cliente retirará el pedido en el local.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                    <h3 className="text-[10px] font-body tracking-[0.2em] uppercase text-[var(--text-secondary)]">Gestionar Estado</h3>
                  </div>

                  {selectedOrder.metodoEntrega === "envio" && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Nro. Seguimiento</label>
                      <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Ej: CP123456789AR"
                        className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id!, "approved")}
                      disabled={isLoading || selectedOrder.status === "approved"}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[11px] uppercase tracking-widest font-body transition-all ${selectedOrder.status === "approved"
                          ? "bg-green-500/20 border-green-500/30 text-green-500"
                          : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-green-500/50 hover:text-green-500"
                        }`}
                    >
                      APROBADO
                      {selectedOrder.status === "approved" && <CheckCircle2 size={14} />}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id!, "shipped")}
                      disabled={isLoading || selectedOrder.status === "shipped"}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[11px] uppercase tracking-widest font-body transition-all ${selectedOrder.status === "shipped"
                          ? "bg-blue-500/20 border-blue-500/30 text-blue-500"
                          : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-blue-500/50 hover:text-blue-500"
                        }`}
                    >
                      ENVIADO
                      {selectedOrder.status === "shipped" && <Truck size={14} />}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id!, "delivered")}
                      disabled={isLoading || selectedOrder.status === "delivered"}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[11px] uppercase tracking-widest font-body transition-all ${selectedOrder.status === "delivered"
                          ? "bg-purple-500/20 border-purple-500/30 text-purple-500"
                          : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-purple-500/50 hover:text-purple-500"
                        }`}
                    >
                      ENTREGADO
                      {selectedOrder.status === "delivered" && <Package size={14} />}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id!, "rejected")}
                      disabled={isLoading || selectedOrder.status === "rejected"}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[11px] uppercase tracking-widest font-body transition-all ${selectedOrder.status === "rejected"
                          ? "bg-red-500/20 border-red-500/30 text-red-500"
                          : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-red-500/50 hover:text-red-500"
                        }`}
                    >
                      RECHAZADO
                      {selectedOrder.status === "rejected" && <XCircle size={14} />}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id!, "whatsapp")}
                      disabled={isLoading || selectedOrder.status === "whatsapp"}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[11px] uppercase tracking-widest font-body transition-all ${selectedOrder.status === "whatsapp"
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500"
                          : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-emerald-500/50 hover:text-emerald-500"
                        }`}
                    >
                      WHATSAPP (PENDIENTE)
                      {selectedOrder.status === "whatsapp" && <MessageCircle size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[var(--border)] bg-[rgba(255,255,255,0.02)] flex justify-end">
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-6 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs font-body tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
    </div >
  );
}

