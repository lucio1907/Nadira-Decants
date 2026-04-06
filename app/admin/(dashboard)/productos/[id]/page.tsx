import { ProductForm } from "@/components/admin/ProductForm";
import { getProductBySlug } from "@/lib/products"; // wait, we only have getProductBySlug or getProducts. 
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Producto } from "@/types";

const getProductById = async (id: string): Promise<Producto | undefined> => {
  // En este punto importaría desde db, pero actualmente getProducts no soporta buscar por id
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/productos`, { cache: 'no-store' });
  const products: Producto[] = await res.json();
  return products.find(p => p.id === id);
};

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/productos" className="nd-btn-ghost !p-2 !min-h-fit border border-[var(--border)] rounded-full text-[var(--text-secondary)]">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-display-md">Editar Producto</h1>
      </div>
      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
