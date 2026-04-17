import { NextRequest, NextResponse } from "next/server";
import { CartItem, ShippingInfo } from "@/types";
import { createAdminClient } from "@/lib/supabase/server";
import { validateCoupon } from "@/lib/coupons";

export const POST = async (request: NextRequest) => {
  try {
    const { 
      items, 
      shippingInfo, 
      shippingCost,
      couponCode,
      orderId: existingOrderId,
      selectedQuote
    }: { 
      items: CartItem[]; 
      shippingInfo: ShippingInfo; 
      shippingCost: number;
      couponCode?: string;
      orderId?: string | null;
      selectedQuote?: any;
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron items" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.variante.precio * item.quantity,
      0
    );

    // Validar cupón si existe
    let discount = 0;
    let cuponId = null;
    if (couponCode) {
      const validation = await validateCoupon(couponCode, subtotal);
      if (validation.valid) {
        discount = validation.discount || 0;
        cuponId = validation.coupon?.id;
      }
    }

    // Calcular montos
    const partialSubtotal = Math.max(0, subtotal - discount);
    const transferDiscount = partialSubtotal * 0.10; // Extra 10% OFF
    const totalAmount = Math.max(0, partialSubtotal - transferDiscount + (shippingCost || 0));

    let orderId = existingOrderId || `transfer-${Date.now()}`;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createAdminClient();
      
      const orderPayload: any = {
        items,
        total: totalAmount,
        status: "whatsapp",
        metodo_entrega: shippingInfo.metodo,
        cliente_nombre: shippingInfo.nombre,
        cliente_apellido: shippingInfo.apellido,
        cliente_telefono: shippingInfo.telefono,
        payer_email: shippingInfo.email,
        direccion_envio: shippingInfo.metodo === "envio" ? {
          calle: shippingInfo.calle,
          numero: shippingInfo.numero,
          piso: shippingInfo.piso,
          depto: shippingInfo.depto,
          localidad: shippingInfo.ciudad,
          provincia: shippingInfo.provincia,
          cp: shippingInfo.codigoPostal,
          notas: shippingInfo.notas,
          locationId: shippingInfo.locationId,
          sucursalNombre: shippingInfo.sucursalNombre,
          sucursalPostalCode: shippingInfo.sucursalPostalCode,
          sucursalCiudad: shippingInfo.sucursalCiudad
        } : null,
        shipping_cost: shippingCost || 0,
        cupon_id: cuponId,
        descuento: discount + transferDiscount,
        mp_payment_id: "TRANSFERENCIA_WA",
        envia_carrier: selectedQuote?.carrier || 'correo-argentino',
        envia_service: selectedQuote?.service || null
      };

      if (existingOrderId && !existingOrderId.startsWith('transfer-') && !existingOrderId.startsWith('mock-')) {
        const { error: updateError } = await supabase
          .from("ordenes")
          .update(orderPayload)
          .eq("id", existingOrderId);
        
        if (updateError) {
          console.error("Supabase Update Error:", updateError);
          const { data: newData, error: insertError } = await supabase.from("ordenes").insert(orderPayload).select("id").single();
          if (insertError) throw insertError;
          orderId = newData.id;
        } else {
          orderId = existingOrderId;
        }
      } else {
        const { data: orderData, error } = await supabase
          .from("ordenes")
          .insert(orderPayload)
          .select("id")
          .single();
          
        if (error) {
          console.error("Supabase Insert Error:", error);
          throw error;
        }
        orderId = orderData.id;
      }
    }

    return NextResponse.json({
      orderId,
      totalAmount,
      transferDiscount
    });
  } catch (error: any) {
    console.error("Error creating transfer order:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear la orden" },
      { status: 500 }
    );
  }
};
