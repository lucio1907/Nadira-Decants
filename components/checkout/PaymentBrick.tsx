"use client";

import { useEffect, useState, useRef } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { CartItem, ShippingInfo } from "@/types";
import { useCartStore } from "@/store/cart";

interface Props {
  cart: CartItem[];
  total: number;
  shippingInfo: ShippingInfo;
  shippingCost: number;
  couponData?: { code: string; discount: number; couponId: string } | null;
  existingOrderId?: string | null;
  onOrderCreated?: (orderId: string) => void;
}

export const PaymentBrick = ({ cart, total, shippingInfo, shippingCost, couponData, existingOrderId, onOrderCreated }: Props) => {

  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loadingPreference, setLoadingPreference] = useState(false);

  // Usar refs para evitar ciclos de re-renderizado innecesarios
  const lastPayloadRef = useRef<string>("");
  const isFetchingRef = useRef(false);
  const currentOrderIdRef = useRef<string | null>(null);

  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!publicKey) {
      setError(
        "Mercado Pago no está configurado. Configura NEXT_PUBLIC_MP_PUBLIC_KEY."
      );
      return;
    }

    initMercadoPago(publicKey, { locale: "es-AR" });

    const fetchPreference = async () => {
      const currentPayload = JSON.stringify({ cart, shippingInfo, shippingCost, couponCode: couponData?.code });
      // Evitar re-fetch si los datos no cambiaron o si ya hay una petición en vuelo
      if (currentPayload === lastPayloadRef.current || isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setLoadingPreference(true);
        setError(null);

        const res = await fetch("/api/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            shippingInfo,
            shippingCost,
            orderId: existingOrderId || currentOrderIdRef.current,
            couponCode: couponData?.code
          }),
        });


        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al crear la preferencia de pago");
        }

        lastPayloadRef.current = currentPayload;
        currentOrderIdRef.current = data.orderId;
        setPreferenceId(data.preferenceId);
        setOrderId(data.orderId);

        if (onOrderCreated && data.orderId) {
          onOrderCreated(data.orderId);
        }
      } catch (err: any) {
        console.error("Fetch Preference Error:", err);
        setError(err.message || "Error al conectar con Mercado Pago");
      } finally {
        isFetchingRef.current = false;
        setLoadingPreference(false);
      }
    };

    fetchPreference();
  }, [cart, shippingInfo, shippingCost, couponData]); // Solo re-ejecutar si cambian los inputs del usuario

  const handleSubmit = async (brickResponse: any) => {
    const { formData, selectedPaymentMethod } = brickResponse;

    // Caso especial: Mercado Pago Wallet
    // No genera formData porque se resuelve mediante redirección interna del Brick
    if (selectedPaymentMethod === 'wallet_purchase') {
      console.log("Wallet purchase selected, letting the Brick handle the redirect...");
      return;
    }

    setProcessing(true);
    setError(null);

    if (!formData || !formData.payment_method_id) {
      console.error("Incomplete data from Payment Brick:", brickResponse);
      setError("Error interno: Datos de pago incompletos");
      setProcessing(false);
      return;
    }

    try {
      const res = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          orderId: existingOrderId || currentOrderIdRef.current,
          totalAmount: total,
          payerEmail: shippingInfo.email
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Error al procesar el pago");
      }

      if (result.id) {
        clearCart();
        window.location.href = `/checkout/status?payment_id=${result.id}&status=${result.status}`;
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
      setProcessing(false);
    }
  };

  const handleError = (error: any) => {
    console.error("Payment Brick error:", error);
  };

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 border border-[var(--border)] rounded-md text-center bg-[var(--surface-raised)]"
      >
        <p
          className="text-red-400 mb-6 font-body text-sm"
          style={{ letterSpacing: "0.05em" }}
        >
          Se produjo un error: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="nd-btn-primary px-8"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!preferenceId) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-t-2 border-[var(--accent)] animate-spin"></div>
        <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-body">
          Iniciando pago seguro...
        </span>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-t-2 border-[var(--accent)] animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-[var(--text-display)] font-body">
          Procesando pago...
        </p>
        <p
          className="text-[10px] text-[var(--text-disabled)] font-body"
        >
          Por favor, aguardá unos instantes
        </p>
      </div>
    );
  }

  return (
    <div id="payment-brick-container" className="pt-4">
      <Payment
        initialization={{ amount: total, preferenceId }}
        onSubmit={handleSubmit}
        onError={handleError}
        customization={{
          visual: {
            style: {
              theme: "dark",
              customVariables: {
                formBackgroundColor: "#182633",
                baseColor: "#d3b000",
                textPrimaryColor: "#FFFFFF",
                buttonTextColor: "#182633",
                inputBackgroundColor: "#1e2f3f",
                outlinePrimaryColor: "#d3b000",
                secondaryColor: "#d3b000",
              },
            },
          },
          paymentMethods: {
            bankTransfer: "all",
            ticket: "all",
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
          },
        }}
      />
    </div>
  );
};
