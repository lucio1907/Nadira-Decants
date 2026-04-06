import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NuevoProductoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/productos" className="nd-btn-ghost !p-2 !min-h-fit border border-[var(--border)] rounded-full text-[var(--text-secondary)]">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-display-md">Nuevo Producto</h1>
      </div>
      <ProductForm />
    </div>
  );
}
