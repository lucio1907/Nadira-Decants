import { getOrders } from "@/lib/orders";
import { getUniqueCustomers } from "@/lib/customers";
import CustomersList from "@/components/admin/CustomersList";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const orders = await getOrders();
  const customers = getUniqueCustomers(orders);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-md">Clientes</h1>
      </div>
      <CustomersList customers={customers} />
    </div>
  );
}
