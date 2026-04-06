import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getMercadoPagoToken } from "@/lib/mercadopago-server";

export const POST = async (request: NextRequest) => {
  try {
    const { formData, orderId, totalAmount, payerEmail } = await request.json();

    if (!formData || !orderId || !totalAmount) {
      return NextResponse.json(
        { error: "Datos de pago incompletos" },
        { status: 400 }
      );
    }

    const accessToken = await getMercadoPagoToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago no está configurado (Token no encontrado)" },
        { status: 500 }
      );
    }

    const mpClient = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(mpClient);

    // Defensive check for payer email
    const finalPayerEmail = payerEmail || formData.payer?.email;
    
    if (!finalPayerEmail) {
      return NextResponse.json(
        { error: "Email del pagador no proporcionado" },
        { status: 400 }
      );
    }

    const paymentResponse = await payment.create({
      body: {
        transaction_amount: totalAmount,
        token: formData.token,
        description: "Compra de Decants — Nadira",
        installments: formData.installments,
        payment_method_id: formData.payment_method_id,
        issuer_id: formData.issuer_id,
        payer: {
          email: finalPayerEmail,
          identification: formData.payer?.identification,
        },
      },
    });

    // Update order in Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createAdminClient();
      
      console.log(`Updating order ${orderId} with payment ${paymentResponse.id} and email ${finalPayerEmail}`);

      const { data, error } = await supabase
        .from("ordenes")
        .update({
          mp_payment_id: String(paymentResponse.id),
          status: paymentResponse.status,
          payer_email: finalPayerEmail,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select();
        
      if (error) {
        console.error("Supabase Update Error details:", error);
      } else {
        console.log("Supabase Update Success. Affected rows:", data?.length);
      }
    }

    return NextResponse.json({
      id: paymentResponse.id,
      status: paymentResponse.status,
    });
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar el pago" },
      { status: 500 }
    );
  }
};
