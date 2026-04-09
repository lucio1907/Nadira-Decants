"use client";

import { useEffect, useState, useMemo } from "react";
import { useCartStore } from "@/store/cart";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ShippingInfo } from "@/types";
import { calculateShipping } from "@/lib/shipping";
import { X } from "lucide-react";
import { validateCouponAction } from "@/app/admin/(dashboard)/cupones/actions";

const PaymentBrick = dynamic(
  () =>
    import("@/components/checkout/PaymentBrick").then(
      (mod) => mod.PaymentBrick
    ),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: "var(--space-2xl)", textAlign: "center" }}>
        <span className="nd-loading nd-loading-blink">
          [ CARGANDO PASARELA DE PAGO... ]
        </span>
      </div>
    ),
  }
);

const CheckoutPage = () => {
  const { items, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [shippingMethod, setShippingMethod] = useState<"retiro" | "envio">("retiro");
  const [paymentMethodMode, setPaymentMethodMode] = useState<"mp" | "transferencia">("transferencia");
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);



  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    metodo: "retiro",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    calle: "",
    numero: "",
    piso: "",
    depto: "",
    provincia: "",
    ciudad: "",
    codigoPostal: "",
    notas: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [validadingCoupon, setValidatingCoupon] = useState(false);
  const [couponData, setCouponData] = useState<{ code: string; discount: number; couponId: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);


  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = useMemo(() => getTotal(), [items, getTotal]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const data = await validateCouponAction(couponCode, subtotal);

      if (!data.valid) {
        throw new Error(data.message || "Cupón inválido");
      }
      setCouponData({
        code: data.coupon!.codigo,
        discount: data.discount!,
        couponId: data.coupon!.id,
      });
    } catch (err: any) {
      setCouponError(err.message);
      setCouponData(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponCode("");
  };

  const discount = couponData?.discount || 0;

  const shippingCost = useMemo(() => {
    if (shippingMethod === "retiro") return 0;
    return calculateShipping(
      shippingInfo.codigoPostal || "",
      shippingInfo.provincia || "",
      subtotal - discount // Aplicar descuento al subtotal para el cálculo de envío si afecta el umbral
    );
  }, [shippingMethod, shippingInfo.codigoPostal, shippingInfo.provincia, subtotal, discount]);

  const baseTotal = Math.max(0, subtotal - discount);
  const transferDiscount = paymentMethodMode === 'transferencia' ? baseTotal * 0.10 : 0;



  const total = Math.max(0, baseTotal - transferDiscount + shippingCost);

  const handleTransferCheckout = async () => {
    try {
      setIsProcessingTransfer(true);
      const res = await fetch('/api/create-transfer-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingInfo,
          shippingCost,


          couponCode: couponData?.code,
          orderId: createdOrderId
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Limpiar carrito (se importó al inicio const clearCart = useCartStore(s => s.clearCart))
      useCartStore.getState().clearCart();

      // Armar mensaje para WhatsApp
      const msg = `¡Hola! Vengo a finalizar mi compra abonando por Transferencia Bancaria.
Orden Nro: #${data.orderId.slice(-8).toUpperCase()}
Total a transferir: $${data.totalAmount.toLocaleString('es-AR')}

Adjunto el comprobante de pago a continuación.`;

      const waParams = new URLSearchParams({ text: msg });
      const waLogLink = `https://wa.me/5493329516307?${waParams.toString()}`;

      window.location.href = waLogLink;
    } catch (err) {
      console.error(err);
      alert('Hubo un error al generar la orden por transferencia. Por favor intentá nuevamente.');
      setIsProcessingTransfer(false);
    }
  };


  const isFormValid = useMemo(() => {
    if (shippingMethod === "retiro") {
      return (
        shippingInfo.nombre &&
        shippingInfo.apellido &&
        shippingInfo.telefono &&
        shippingInfo.email
      );
    }
    return (
      shippingInfo.nombre &&
      shippingInfo.apellido &&
      shippingInfo.telefono &&
      shippingInfo.email &&
      shippingInfo.calle &&
      shippingInfo.numero &&
      shippingInfo.provincia &&
      shippingInfo.ciudad &&
      shippingInfo.codigoPostal
    );
  }, [shippingMethod, shippingInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          paddingTop: "80px",
          minHeight: "100vh",
          background: "var(--black)",
        }}
      >
        <span className="nd-loading nd-loading-blink">[ CARGANDO... ]</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center px-5"
        style={{
          paddingTop: "80px",
          minHeight: "100svh",
          background: "var(--black)",
        }}
      >
        <div className="text-center nd-animate-fade-in" style={{ maxWidth: "400px" }}>
          <h1
            className="text-heading"
            style={{ marginBottom: "var(--space-md)" }}
          >
            No hay items en tu carrito
          </h1>
          <Link href="/#productos" className="nd-btn-primary">
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--black)" }}>
      <div className="container-nd" style={{ padding: "var(--space-2xl) var(--space-md)" }}>
        <div className="flex items-center gap-4" style={{ marginBottom: "var(--space-xl)" }}>
          <h1 className="text-heading">Checkout</h1>
          <div className="flex gap-2 items-center">
            <span style={{ color: step === 'shipping' ? 'var(--accent)' : 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Entrega</span>
            <span style={{ color: 'var(--text-disabled)', fontSize: '10px' }}>/</span>
            <span style={{ color: step === 'payment' ? 'var(--accent)' : 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pago</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            {step === "shipping" ? (
              <div className="nd-animate-fade-in">
                <div className="nd-card" style={{ padding: "var(--space-lg)", marginBottom: "var(--space-md)" }}>
                  <h2 className="text-nd-label" style={{ marginBottom: "var(--space-lg)" }}>
                    Método de entrega
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setShippingMethod("retiro");
                        setShippingInfo(s => ({ ...s, metodo: 'retiro' }));
                      }}
                      className={`nd-segment ${shippingMethod === "retiro" ? "nd-segment-active" : ""}`}
                    >
                      Retiro en Local
                    </button>
                    <button
                      onClick={() => {
                        setShippingMethod("envio");
                        setShippingInfo(s => ({ ...s, metodo: 'envio' }));
                      }}
                      className={`nd-segment ${shippingMethod === "envio" ? "nd-segment-active" : ""}`}
                    >
                      Envío a domicilio
                    </button>
                  </div>
                </div>

                <div className="nd-card" style={{ padding: "var(--space-lg)" }}>
                  <h2 className="text-nd-label" style={{ marginBottom: "var(--space-lg)" }}>
                    {shippingMethod === "retiro" ? "Tus Datos" : "Datos de Envío"}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex flex-col">
                      <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Juan"
                        className="nd-input"
                        value={shippingInfo.nombre}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        placeholder="Pérez"
                        className="nd-input"
                        value={shippingInfo.apellido}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Celular / WhatsApp</label>
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="11 1234 5678"
                        className="nd-input"
                        value={shippingInfo.telefono}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="juan@email.com"
                        className="nd-input"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    {shippingMethod === "envio" && (
                      <>
                        <div className="md:col-span-2 grid grid-cols-4 gap-4">
                          <div className="col-span-3 flex flex-col">
                            <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Calle</label>
                            <input
                              type="text"
                              name="calle"
                              placeholder="Av. Santa Fe"
                              className="nd-input"
                              value={shippingInfo.calle}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-span-1 flex flex-col">
                            <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Número</label>
                            <input
                              type="text"
                              name="numero"
                              placeholder="1234"
                              className="nd-input"
                              value={shippingInfo.numero}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Piso / Depto (Opcional)</label>
                          <input
                            type="text"
                            name="piso"
                            placeholder="2° B"
                            className="nd-input"
                            value={shippingInfo.piso}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Código Postal</label>
                          <input
                            type="text"
                            name="codigoPostal"
                            placeholder="2942"
                            className="nd-input"
                            value={shippingInfo.codigoPostal}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Ciudad / Localidad</label>
                          <input
                            type="text"
                            name="ciudad"
                            placeholder="Baradero"
                            className="nd-input"
                            value={shippingInfo.ciudad}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Provincia</label>
                          <select
                            name="provincia"
                            className="nd-input"
                            style={{ background: 'transparent', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '16px 0', borderBottom: '1px solid var(--border-visible)' }}
                            value={shippingInfo.provincia}
                            onChange={handleInputChange as any}
                          >
                            <option value="" disabled style={{ background: 'var(--surface)' }}>Seleccionar provincia</option>
                            <option value="Buenos Aires" style={{ background: 'var(--surface)' }}>Buenos Aires</option>
                            <option value="CABA" style={{ background: 'var(--surface)' }}>CABA</option>
                            <option value="Catamarca" style={{ background: 'var(--surface)' }}>Catamarca</option>
                            <option value="Chaco" style={{ background: 'var(--surface)' }}>Chaco</option>
                            <option value="Chubut" style={{ background: 'var(--surface)' }}>Chubut</option>
                            <option value="Córdoba" style={{ background: 'var(--surface)' }}>Córdoba</option>
                            <option value="Corrientes" style={{ background: 'var(--surface)' }}>Corrientes</option>
                            <option value="Entre Ríos" style={{ background: 'var(--surface)' }}>Entre Ríos</option>
                            <option value="Formosa" style={{ background: 'var(--surface)' }}>Formosa</option>
                            <option value="Jujuy" style={{ background: 'var(--surface)' }}>Jujuy</option>
                            <option value="La Pampa" style={{ background: 'var(--surface)' }}>La Pampa</option>
                            <option value="La Rioja" style={{ background: 'var(--surface)' }}>La Rioja</option>
                            <option value="Mendoza" style={{ background: 'var(--surface)' }}>Mendoza</option>
                            <option value="Misiones" style={{ background: 'var(--surface)' }}>Misiones</option>
                            <option value="Neuquén" style={{ background: 'var(--surface)' }}>Neuquén</option>
                            <option value="Río Negro" style={{ background: 'var(--surface)' }}>Río Negro</option>
                            <option value="Salta" style={{ background: 'var(--surface)' }}>Salta</option>
                            <option value="San Juan" style={{ background: 'var(--surface)' }}>San Juan</option>
                            <option value="San Luis" style={{ background: 'var(--surface)' }}>San Luis</option>
                            <option value="Santa Cruz" style={{ background: 'var(--surface)' }}>Santa Cruz</option>
                            <option value="Santa Fe" style={{ background: 'var(--surface)' }}>Santa Fe</option>
                            <option value="Santiago del Estero" style={{ background: 'var(--surface)' }}>Santiago del Estero</option>
                            <option value="Tierra del Fuego" style={{ background: 'var(--surface)' }}>Tierra del Fuego</option>
                            <option value="Tucumán" style={{ background: 'var(--surface)' }}>Tucumán</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 flex flex-col">
                          <label className="text-nd-label" style={{ fontSize: '9px', marginBottom: '-8px', marginTop: '12px' }}>Notas adicionales (Opcional)</label>
                          <input
                            type="text"
                            name="notas"
                            placeholder="Tocar timbre abajo, dejar en recepción, etc."
                            className="nd-input"
                            value={shippingInfo.notas}
                            onChange={handleInputChange}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {shippingMethod === "retiro" && (
                    <div style={{ marginTop: "var(--space-lg)", padding: 'var(--space-md)', background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                      <p className="text-nd-label" style={{ marginBottom: '8px', color: 'var(--accent)' }}>Punto de retiro</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>San Martin 1485, Baradero, Pcia de Buenos Aires.</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-disabled)', marginTop: '4px' }}>CP 2942. Lunes a Viernes 10hs a 18hs.</p>
                    </div>
                  )}

                  <button
                    disabled={!isFormValid}
                    onClick={() => setStep("payment")}
                    className="nd-btn-primary w-full"
                    style={{ marginTop: "var(--space-xl)", opacity: isFormValid ? 1 : 0.5 }}
                  >
                    Continuar al Pago
                  </button>
                </div>
              </div>
            ) : (
              <div className="nd-animate-fade-in">
                <button
                  onClick={() => setStep("shipping")}
                  style={{
                    marginBottom: 'var(--space-md)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none'
                  }}
                >
                  ← Editar datos de entrega
                </button>
                <div className="nd-card" style={{ padding: "var(--space-lg)" }}>
                  <h2
                    className="text-nd-label"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-lg)",
                    }}
                  >
                    Método de pago
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => setPaymentMethodMode("mp")}
                      className={`nd-segment ${paymentMethodMode === "mp" ? "nd-segment-active" : ""}`}
                    >
                      Mercado Pago (Tarjetas / Dinero)
                    </button>
                    <button
                      onClick={() => setPaymentMethodMode("transferencia")}
                      className={`nd-segment ${paymentMethodMode === "transferencia" ? "nd-segment-active" : ""}`}
                    >
                      Transferencia (-10% OFF)
                    </button>
                  </div>

                  {paymentMethodMode === "mp" ? (
                    <PaymentBrick
                      cart={items}
                      total={total}
                      shippingInfo={shippingInfo}
                      shippingCost={shippingCost}


                      couponData={couponData}
                      existingOrderId={createdOrderId}
                      onOrderCreated={setCreatedOrderId}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="p-6 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl space-y-4">
                        <h3 className="text-sm font-display text-[var(--accent)] mb-2">Pasos para finalizar por transferencia:</h3>
                        <ol className="list-decimal pl-4 space-y-2 text-sm text-[var(--text-secondary)] font-body">
                          <li>Copia nuestros datos bancarios (debajo).</li>
                          <li>Haz clic en &quot;Confirmar compra por WhatsApp&quot;. Se te redirigirá a nuestro WhatsApp con un mensaje pre-armado y tu número de orden.</li>
                          <li>Realiza la transferencia por un total de <strong>${total.toLocaleString('es-AR')}</strong>.</li>
                          <li><strong className="text-[var(--text-primary)]">Envíanos el comprobante</strong> por WhatsApp, debajo del mensaje que se ha enviado.</li>
                        </ol>

                        <div className="my-6 p-4 bg-black/40 border border-[var(--border-visible)] rounded-lg">
                          <p className="text-[10px] text-[var(--text-disabled)] tracking-wider uppercase mb-1">Datos Bancarios</p>
                          <p className="text-sm text-[var(--text-primary)]">Alias: <strong>Nadira.decants</strong></p>
                          <p className="text-sm text-[var(--text-primary)]">CBU: <strong>0000003100057973739017</strong></p>
                          <p className="text-sm text-[var(--text-primary)]">Titular: <strong>Daniela Fernanda Arrieta</strong></p>


                        </div>
                      </div>

                      <button
                        onClick={handleTransferCheckout}
                        disabled={isProcessingTransfer}
                        className="nd-btn-primary w-full"
                      >
                        {isProcessingTransfer ? "Procesando..." : "Confirmar compra por WhatsApp"}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div
              className="nd-card sticky"
              style={{
                top: "72px",
                padding: "var(--space-lg)",
              }}
            >
              <h2
                className="text-nd-label"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-lg)",
                }}
              >
                Tu pedido
              </h2>

              <div style={{ marginBottom: "var(--space-lg)", maxHeight: '300px', overflowY: 'auto' }}>
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variante.ml}`}
                    className="flex items-center gap-3"
                    style={{ padding: "var(--space-sm) 0" }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.nombre}
                      </p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-disabled)" }}>
                        {item.variante.ml}ml × {item.quantity}
                      </p>
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-primary)" }}>
                      ${(item.variante.precio * item.quantity).toLocaleString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "var(--space-md)" }}>
                {!couponData ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="CÓDIGO DE CUPÓN"
                        className="nd-input flex-1 uppercase"
                        style={{ fontSize: '11px', padding: '8px 12px' }}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validadingCoupon || !couponCode}
                        className="nd-btn-primary"
                        style={{ padding: '8px 16px', fontSize: '10px' }}
                      >
                        {validadingCoupon ? "..." : "Aplicar"}
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-red-500 font-body">{couponError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-green-500 font-bold">Cupón Aplicado</span>
                      <span className="text-xs text-[var(--text-primary)]">{couponData.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[var(--text-disabled)] hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="nd-divider" style={{ marginBottom: "var(--space-md)" }} />

              <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                <span className="text-nd-label" style={{ fontSize: '9px' }}>Subtotal</span>
                <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                  ${subtotal.toLocaleString("es-AR")}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                  <span className="text-nd-label" style={{ fontSize: '9px', color: 'var(--success)' }}>Descuento Cupón</span>
                  <span style={{ fontSize: "13px", color: "var(--success)" }}>
                    -${discount.toLocaleString("es-AR")}
                  </span>
                </div>
              )}

              {paymentMethodMode === 'transferencia' && transferDiscount > 0 && (
                <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                  <span className="text-nd-label" style={{ fontSize: '9px', color: 'var(--success)' }}>Descuento Transferencia (10%)</span>
                  <span style={{ fontSize: "13px", color: "var(--success)" }}>
                    -${transferDiscount.toLocaleString("es-AR")}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                <span className="text-nd-label" style={{ fontSize: '9px' }}>Envío</span>
                <span style={{ fontSize: "13px", color: shippingCost === 0 && shippingMethod === 'envio' ? 'var(--success)' : 'var(--text-primary)' }}>
                  {shippingMethod === 'retiro' ? 'Gratis (Retiro)' : shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString("es-AR")}`}
                </span>
              </div>


              <div className="nd-divider-visible" style={{ height: '1px', marginBottom: "var(--space-md)" }} />

              <div className="flex justify-between items-baseline">
                <span className="text-nd-label" style={{ color: "var(--text-secondary)" }}>
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--heading)",
                    color: "var(--text-display)",
                  }}
                >
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            <Link
              href="/carrito"
              className="block text-center"
              style={{
                marginTop: "var(--space-md)",
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 250ms",
              }}
            >
              ← Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
