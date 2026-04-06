import { getProducts } from "@/lib/products";
import ProductsList from "../../../../components/admin/ProductsList";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-md">Productos</h1>
      </div>
      <ProductsList initialProducts={products} />
    </div>
  );
}
