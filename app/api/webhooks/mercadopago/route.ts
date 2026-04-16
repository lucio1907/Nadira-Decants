import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { getMercadoPagoToken } from "@/lib/mercadopago-server";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { reduceStockForOrder } from "@/lib/orders";

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

          // 1. Reduce stock using shared helper (idempotent)
          await reduceStockForOrder(supabase, orderId);

          // 3. Send confirmation email
          sendOrderConfirmationEmail(orderId).catch(err => console.error("Async email error (webhook):", err));
        }

        // Trigger ISR to update product stock on the frontend
        revalidateTag("productos", { expire: 0 });
        revalidateTag("ordenes", { expire: 0 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always return 200 to MP so it doesn't retry indefinitely
    return NextResponse.json({ received: true });
  }
};
