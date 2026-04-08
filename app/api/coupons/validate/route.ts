import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export const POST = async (request: NextRequest) => {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Se requiere un código de cupón" },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, subtotal);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: result.coupon,
      discount: result.discount
    });
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Error al validar el cupón" },
      { status: 500 }
    );
  }
};
