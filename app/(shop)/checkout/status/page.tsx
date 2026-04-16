import Link from "next/link";
import { CartStatusHandler } from "@/components/checkout/CartStatusHandler";
import { createAdminClient } from "@/lib/supabase/server";
import { getMercadoPagoToken } from "@/lib/mercadopago-server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { reduceStockForOrder } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { revalidateTag } from "next/cache";

const StatusPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const status = params.status;
  const paymentId = params.payment_id;

  // Fallback sync process: If user is redirected here and the webhook hasn't arrived,
  // we manually fetch the payment and update the database. Essential for local testing.
  if (paymentId && status === "approved") {
    try {
      const accessToken = await getMercadoPagoToken();
      if (accessToken) {
        const mpClient = new MercadoPagoConfig({ accessToken });
        const paymentApi = new Payment(mpClient);
        const paymentData = await paymentApi.get({ id: paymentId });
        
        if (paymentData.status === "approved") {
          const orderId = paymentData.external_reference;
          
          if (orderId) {
            const supabase = await createAdminClient();
            
            const { data: order } = await supabase
              .from("ordenes")
              .select("status")
              .eq("id", orderId)
              .single();
              
            if (order && order.status !== "approved") {
              console.log(`[Status Sync] Fallback aprobando orden ${orderId}`);
              const { error: updateError } = await supabase
                .from("ordenes")
                .update({
                  status: paymentData.status,
                  mp_payment_id: String(paymentData.id),
                  payer_email: paymentData.payer?.email,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", orderId);

              if (!updateError) {
                await reduceStockForOrder(supabase, orderId);
                sendOrderConfirmationEmail(orderId).catch(err => console.error("Async email error:", err));
                revalidateTag("productos", { expire: 0 } as any);
                revalidateTag("ordenes", { expire: 0 } as any);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Status page sync error:", error);
    }
  }

  const statusConfig: Record<
    string,
    {
      title: string;
      message: string;
      bracket: string;
      bracketClass: string;
    }
  > = {
    approved: {
      title: "Pago aprobado",
      message:
        "Tu pedido fue procesado exitosamente. Te enviaremos un email con los detalles del envío.",
      bracket: "APROBADO",
      bracketClass: "nd-bracket-success",
    },
    pending: {
      title: "Pago pendiente",
      message:
        "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
      bracket: "PENDIENTE",
      bracketClass: "nd-bracket-warning",
    },
    in_process: {
      title: "Pago en proceso",
      message:
        "Tu pago está siendo revisado. Puede demorar unos minutos en confirmarse.",
      bracket: "EN PROCESO",
      bracketClass: "nd-bracket-warning",
    },
    rejected: {
      title: "Pago rechazado",
      message:
        "No pudimos procesar tu pago. Por favor, intentá con otro medio de pago.",
      bracket: "RECHAZADO",
      bracketClass: "nd-bracket-error",
    },
  };

  const config = statusConfig[status || ""] || {
    title: "Estado del pago",
    message: "No pudimos determinar el estado de tu pago.",
    bracket: "DESCONOCIDO",
    bracketClass: "nd-bracket-info",
  };

  return (
    <div
      className="flex items-center justify-center px-5"
      style={{
        paddingTop: "80px",
        minHeight: "100svh",
        background: "var(--black)",
      }}
    >
      <CartStatusHandler status={status} />
      <div
        className="text-center nd-animate-fade-in-up"
        style={{ maxWidth: "420px", margin: "0 auto" }}
      >
        {/* Status bracket */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <span className={`nd-bracket ${config.bracketClass}`}>
            {config.bracket}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-heading"
          style={{ marginBottom: "var(--space-sm)" }}
        >
          {config.title}
        </h1>

        {/* Message */}
        <p
          className="text-nd-body"
          style={{
            color: "var(--text-secondary)",
            marginBottom: "var(--space-md)",
          }}
        >
          {config.message}
        </p>

        {/* Payment ID */}
        {paymentId && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--caption)",
              color: "var(--text-disabled)",
              marginBottom: "var(--space-xl)",
              letterSpacing: "0.04em",
            }}
          >
            ID: {paymentId}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="nd-btn-primary" style={{ width: "100%" }}>
            Volver al inicio
          </Link>
          {status === "rejected" && (
            <Link
              href="/carrito"
              className="nd-btn-secondary"
              style={{ width: "100%" }}
            >
              Reintentar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
