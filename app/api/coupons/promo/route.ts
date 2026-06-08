import { NextResponse } from "next/server";
import { getPromoPopupCoupon } from "@/lib/coupons";

export async function GET() {
  const coupon = await getPromoPopupCoupon();

  if (!coupon) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    id: coupon.id,
    codigo: coupon.codigo,
    tipo: coupon.tipo,
    valor: coupon.valor,
    minimo_compra: coupon.minimo_compra ?? null,
  });
}
