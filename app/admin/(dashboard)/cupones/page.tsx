import { getCoupons } from "@/lib/coupons";
import { CouponsClient } from "./CouponsClient";

export default async function CuponesPage() {
  const coupons = await getCoupons();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-display text-[var(--text-display)]">Gestión de Cupones</h1>
          <p className="text-[var(--text-secondary)] font-body mt-2">
            Crea y administra códigos de productos y promociones especiales.
          </p>
        </div>

        <CouponsClient initialCoupons={coupons} />
      </div>
    </div>
  );
}
