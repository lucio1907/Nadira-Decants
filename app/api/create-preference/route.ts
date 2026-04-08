import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { CartItem, ShippingInfo } from "@/types";
import { createAdminClient } from "@/lib/supabase/server";
import { getMercadoPagoToken } from "@/lib/mercadopago-server";
import { validateCoupon } from "@/lib/coupons";

export const POST = async (request: NextRequest) => {
  try {
    const { 
      items, 
      shippingInfo, 
      shippingCost,
      orderId: existingOrderId,
      couponCode
    }: { 
      items: CartItem[]; 
      shippingInfo: ShippingInfo; 
      shippingCost: number;
      orderId?: string;
      couponCode?: string;
    } = await request.json();


    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron items" },
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

    const totalAmount = Math.max(0, subtotal - discount + (shippingCost || 0));

    // Create or Update order in Supabase
    let orderId = existingOrderId || `mock-order-${Date.now()}`;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createAdminClient();
      
      const orderPayload: any = {
        items,
        total: totalAmount,
        status: "pending",
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
          notas: shippingInfo.notas
        } : null,
        shipping_cost: shippingCost || 0,
        cupon_id: cuponId,
        descuento: discount
      };
      
      // ... resto de la lógica de guardado de orden ...
      if (existingOrderId && !existingOrderId.startsWith('mock-')) {
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

    const preference = new Preference(mpClient);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const mpItems = items.map((item) => ({
      id: `${item.id}-${item.variante.ml}`,
      title: `${item.nombre} (${item.variante.ml}ml)`,
      unit_price: item.variante.precio,
      quantity: item.quantity,
      currency_id: "ARS",
    }));

    if (discount > 0) {
      mpItems.push({
        id: "discount",
        title: `Descuento Cupón (${couponCode})`,
        unit_price: -discount,
        quantity: 1,
        currency_id: "ARS",
      } as any);
    }

    if (shippingCost && shippingCost > 0) {
      mpItems.push({
        id: "shipping_cost",
        title: "Costo de Envío — Correo Argentino",
        unit_price: shippingCost,
        quantity: 1,
        currency_id: "ARS",
      } as any);
    }


    const result = await preference.create({
      body: {
        external_reference: orderId,
        items: mpItems,
        payer: {
          email: shippingInfo.email,
          name: shippingInfo.nombre,
          surname: shippingInfo.apellido,
          phone: {
            number: shippingInfo.telefono
          }
        },
        back_urls: {
          success: `${siteUrl}/checkout/status`,
          failure: `${siteUrl}/checkout/status`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({
      preferenceId: result.id,
      orderId,
    });
  } catch (error: any) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear preferencia" },
      { status: 500 }
    );
  }
};
