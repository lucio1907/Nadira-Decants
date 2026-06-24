import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation';
import { ShipmentConfirmationEmail } from '@/components/emails/ShipmentConfirmation';
import { AdminNewOrderEmail } from '@/components/emails/AdminNewOrder';
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

    // Notify the store owner
    sendNewOrderNotificationEmail(orderId).catch(err =>
      console.error('Async admin email error:', err));
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

    console.log("DEBUG: inside sendShipmentConfirmationEmail, dbOrder tracking:", dbOrder.nro_seguimiento, "email_sent:", (dbOrder as any).shipment_email_sent);
    // Only send if it has a tracking number and hasn't been sent yet
    if (!dbOrder.nro_seguimiento || (dbOrder as any).shipment_email_sent) {
      console.log("DEBUG: Returning early because no tracking number or already sent");
      return;
    }

    console.log("DEBUG: Rendering email and sending...");
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
      .update({ shipment_email_sent: true } as any)
      .eq('id', orderId);

    console.log(`Shipment confirmation email sent successfully for order ${orderId}`);
  } catch (error) {
    console.error('Unexpected error sending shipment email:', error);
  }
}

/**
 * Sends a "¡Nueva Orden!" notification email to the store owner when an order is approved.
 */
export async function sendNewOrderNotificationEmail(orderId: string) {
  try {
    const supabase = await createAdminClient();

    const { data: dbOrder, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !dbOrder) {
      console.error('Error fetching order for admin email:', error);
      return;
    }

    if (dbOrder.status !== 'approved' || (dbOrder as any).admin_email_sent) {
      return;
    }

    const order = mapOrder(dbOrder);
    const emailHtml = await render(React.createElement(AdminNewOrderEmail, { order }));
    const orderNumber = order.id?.slice(-8).toUpperCase() || 'ORDEN';

    const { error: sendError } = await resend.emails.send({
      from: 'Nadira Decants <ventas@nadiradecants.com.ar>',
      to: [process.env.OWNER_NOTIFICATION_EMAIL || 'daniarrieta22@hotmail.com'],
      subject: `¡Nueva Orden! #${orderNumber}`,
      html: emailHtml,
    });

    if (sendError) {
      console.error('Resend error (admin notification):', sendError);
      return;
    }

    await supabase
      .from('ordenes')
      .update({ admin_email_sent: true } as any)
      .eq('id', orderId);

    console.log(`Admin notification email sent successfully for order ${orderId}`);
  } catch (error) {
    console.error('Unexpected error sending admin notification email:', error);
  }
}
