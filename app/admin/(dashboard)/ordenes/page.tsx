import { getOrders } from "@/lib/orders";
import OrdersList from "@/components/admin/OrdersList";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-md">Órdenes de Venta</h1>
      </div>
      <OrdersList initialOrders={orders} />
    </div>
  );
}
