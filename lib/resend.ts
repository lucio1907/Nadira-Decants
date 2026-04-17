import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation';
import { ShipmentConfirmationEmail } from '@/components/emails/ShipmentConfirmation';
import { createAdminClient } from './supabase/server';
import { mapOrder } from './orders';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a confirmation email to the customer when their order is approved.
 */
export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const supabase = await createAdminClient();

    const { data: dbOrder, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !dbOrder) {
      console.error('Error fetching order for email:', error);
      return;
    }

    if (dbOrder.status !== 'approved' || dbOrder.email_sent) {
      return;
    }

    const order = mapOrder(dbOrder);
    const emailHtml = await render(React.createElement(OrderConfirmationEmail, { order }));

    const { error: sendError } = await resend.emails.send({
      from: 'Nadira Decants <ventas@nadiradecants.com.ar>',
      to: [order.payerEmail || 'nadira.beauty.baradero@gmail.com'],
      subject: `¡Tu compra #${order.id?.slice(-8).toUpperCase()} ha sido aprobada! 💎`,
      html: emailHtml,
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return;
    }

    await supabase
      .from('ordenes')
      .update({ email_sent: true })
      .eq('id', orderId);

    console.log(`Order confirmation email sent successfully for order ${orderId}`);
  } catch (error) {
    console.error('Unexpected error sending email:', error);
  }
}

/**
 * Sends a shipment confirmation email to the customer with tracking number.
 */
export async function sendShipmentConfirmationEmail(orderId: string) {
  try {
    const supabase = await createAdminClient();

    const { data: dbOrder, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !dbOrder) {
      console.error('Error fetching order for shipment email:', error);
      return;
    }

    // Only send if status is shipped, has tracking number, and hasn't been sent yet
    if (dbOrder.status !== 'shipped' || !dbOrder.nro_seguimiento || dbOrder.shipment_email_sent) {
      return;
    }

    const order = mapOrder(dbOrder);
    const emailHtml = await render(React.createElement(ShipmentConfirmationEmail, { order }));

    const { error: sendError } = await resend.emails.send({
      from: 'Nadira Decants <ventas@nadiradecants.com.ar>',
      to: [order.payerEmail || 'nadira.beauty.baradero@gmail.com'],
      subject: `¡Tu pedido #${order.id?.slice(-8).toUpperCase()} ha sido enviado! 🚚`,
      html: emailHtml,
    });

    if (sendError) {
      console.error('Resend error (shipment):', sendError);
      return;
    }

    await supabase
      .from('ordenes')
      .update({ shipment_email_sent: true })
      .eq('id', orderId);

    console.log(`Shipment confirmation email sent successfully for order ${orderId}`);
  } catch (error) {
    console.error('Unexpected error sending shipment email:', error);
  }
}
