import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation';
import { createAdminClient } from './supabase/server';
import { mapOrder } from './orders';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a confirmation email to the customer when their order is approved.
 * This function handles idempotency using the 'email_sent' column.
 */
export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const supabase = await createAdminClient();

    // 1. Fetch order details directly from DB
    const { data: dbOrder, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !dbOrder) {
      console.error('Error fetching order for email:', error);
      return;
    }

    // 2. Check if email should be sent
    // We send it if it's approved and hasn't been sent yet
    if (dbOrder.status !== 'approved' || dbOrder.email_sent) {
      console.log(`Email skip for order ${orderId}: status=${dbOrder.status}, email_sent=${dbOrder.email_sent}`);
      return;
    }

    // 3. Map to Order interface
    const order = mapOrder(dbOrder);

    // 4. Render email to HTML
    // Note: React 18+ and Next.js might require rendering to string differently depending on environment,
    // but @react-email/render is designed for this.
    const emailHtml = await render(React.createElement(OrderConfirmationEmail, { order }));

    // 5. Send via Resend
    const { data, error: sendError } = await resend.emails.send({
      from: 'Nadira Decants <ventas@nadiradecants.com.ar>',
      to: [order.payerEmail || 'nadira.beauty.baradero@gmail.com'],
      subject: `¡Tu compra #${order.id?.slice(-8).toUpperCase()} ha sido aprobada! 💎`,
      html: emailHtml,
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return;
    }

    // 6. Update email_sent flag to true
    await supabase
      .from('ordenes')
      .update({ email_sent: true })
      .eq('id', orderId);

    console.log(`Order confirmation email sent successfully for order ${orderId}`);
  } catch (error) {
    console.error('Unexpected error sending email:', error);
  }
}
