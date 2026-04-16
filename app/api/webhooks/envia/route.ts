import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Envia Webhook Received:", body);

    // Envia webhook typically provides tracking_number and status
    // The exact payload structure should be verified in Envia dashboard, 
    // but usually includes trackings[0].status or similar.
    
    const trackingNumber = body.tracking_number || body.trackingNumber;
    let enviaStatus = (body.status || "").toLowerCase();

    if (!trackingNumber) {
      return NextResponse.json({ error: "Missing tracking number" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Find the order with this tracking number
    const { data: order, error: findError } = await supabase
      .from("ordenes")
      .select("id, status")
      .eq("nro_seguimiento", trackingNumber)
      .single();

    if (findError || !order) {
      console.warn(`Order not found for tracking number: ${trackingNumber}`);
      return NextResponse.json({ message: "Order not found" }, { status: 200 }); // Return 200 to Envia so they stop retrying
    }

    // Map Envia status to internal status
    // Common Envia statuses: pending, in_transit, picked_up, delivered, returned, cancelled
    let internalStatus = order.status;

    if (enviaStatus === "delivered") {
      internalStatus = "delivered";
    } else if (["in_transit", "picked_up", "on_route"].includes(enviaStatus)) {
      internalStatus = "shipped";
    } else if (["returned", "cancelled", "rejected"].includes(enviaStatus)) {
      internalStatus = "rejected";
    }

    if (internalStatus !== order.status) {
      const { error: updateError } = await supabase
        .from("ordenes")
        .update({ status: internalStatus })
        .eq("id", order.id);

      if (updateError) throw updateError;
      console.log(`Updated Order ${order.id} status to ${internalStatus} via Webhook`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Envia Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
