import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { EnviaClient } from "@/lib/envia";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. Fetch order details
    const { data: order, error: fetchError } = await supabase
      .from("ordenes")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.metodo_entrega !== "envio") {
      return NextResponse.json({ error: "This order is not for shipping" }, { status: 400 });
    }

    if (order.label_url) {
      return NextResponse.json({ 
        success: true, 
        labelUrl: order.label_url, 
        trackingNumber: order.nro_seguimiento,
        message: "Label already exists" 
      });
    }

    const carrier = order.envia_carrier || "correoArgentino";
    const service = order.envia_service;

    console.log(`[GenerateLabel] Order ID: ${orderId}, Carrier: ${carrier}, Service: ${service}`);

    if (!service) {
      return NextResponse.json({ error: "No shipping service selected for this order" }, { status: 400 });
    }

    // 2. Generate Label using Envia client
    const envia = new EnviaClient();
    const result = await envia.generateLabel(order, carrier, service);

    console.log(`[GenerateLabel] Envia Raw Result:`, JSON.stringify(result, null, 2));

    // Envia response usually contains data[0] with the details
    if (!result.data || result.data.length === 0) {
      const msg = result.message || result.error?.message || "Envia returned no label data";
      throw new Error(`Failed to generate label via Envia API: ${msg}`);
    }

    const labelData = result.data[0];
    const shipmentId = labelData.shipmentId;
    const trackingNumber = labelData.trackingNumber;
    const labelUrl = labelData.label; // PDF URL

    // 3. Update Order in DB
    const { error: updateError } = await supabase
      .from("ordenes")
      .update({
        envia_shipment_id: shipmentId.toString(),
        label_url: labelUrl,
        nro_seguimiento: trackingNumber
      })
      .eq("id", orderId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      shipmentId,
      trackingNumber,
      labelUrl
    });

  } catch (error: any) {
    console.error("Generate Label Error:", error);
    return NextResponse.json({ 
      error: error.message || "Error generating shipping label" 
    }, { status: 500 });
  }
}
