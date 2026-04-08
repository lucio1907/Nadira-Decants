import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { getMercadoPagoToken } from "@/lib/mercadopago-server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (body.type === "payment") {
      const accessToken = await getMercadoPagoToken();

      if (!accessToken) {
        console.error("MP_ACCESS_TOKEN not available for webhook handler");
        return NextResponse.json({ received: true });
      }

      const supabase = await createAdminClient();

      const mpClient = new MercadoPagoConfig({ accessToken });
      const paymentApi = new Payment(mpClient);
      const payment = await paymentApi.get({ id: body.data.id });

      if (payment.status === "approved") {
        const orderId = payment.external_reference;

        // Update Supabase order
        if (supabase && orderId) {
          const updateData: any = {
            status: payment.status,
            mp_payment_id: String(payment.id),
            payer_email: payment.payer?.email,
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from("ordenes")
            .update(updateData)
            .eq("id", orderId);

          if (updateError) {
             console.error("Order update error:", updateError);
          }

          // Fetch order to get items and coupon
          const { data: orderData } = await supabase
            .from("ordenes")
            .select("items, cupon_id")
            .eq("id", orderId)
            .single();
 
          if (orderData) {
            // 1. Update stock for each variant
            if (orderData.items) {
              for (const item of orderData.items) {
                 const { data: varianteData } = await supabase
                   .from("variantes")
                   .select("id, stock")
                   .eq("producto_id", item.id)
                   .eq("ml", item.variante.ml)
                   .single();
  
                 if (varianteData) {
                   const currentStock = varianteData.stock || 0;
                   await supabase
                     .from("variantes")
                     .update({ stock: Math.max(0, currentStock - item.quantity) })
                     .eq("id", varianteData.id);
                 }
              }
            }

            // 2. Increment coupon usage if exists
            if (orderData.cupon_id) {
              const { data: currentCoupon } = await supabase
                .from("cupones")
                .select("usos_actuales")
                .eq("id", orderData.cupon_id)
                .single();
              
              if (currentCoupon) {
                await supabase
                  .from("cupones")
                  .update({ usos_actuales: (currentCoupon.usos_actuales || 0) + 1 })
                  .eq("id", orderData.cupon_id);
              }
            }
          }
        }

        // Trigger ISR to update product stock on the frontend
        revalidateTag("productos", "max");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always return 200 to MP so it doesn't retry indefinitely
    return NextResponse.json({ received: true });
  }
};
