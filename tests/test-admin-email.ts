import "dotenv/config";
import { getOrders } from "../lib/orders";
import { render } from "@react-email/render";
import { AdminNewOrderEmail } from "../components/emails/AdminNewOrder";
import { Resend } from "resend";
import React from "react";

async function run() {
  const orders = await getOrders();
  const order = orders[0];

  if (!order) {
    console.error("No orders found.");
    return;
  }

  console.log(`Sending admin test email for order ${order.id} (status: ${order.status})`);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailHtml = await render(React.createElement(AdminNewOrderEmail, { order }));
  const orderNumber = order.id?.slice(-8).toUpperCase() || "ORDEN";

  const { data, error } = await resend.emails.send({
    from: "Nadira Decants <ventas@nadiradecants.com.ar>",
    to: [process.env.OWNER_NOTIFICATION_EMAIL || "daniarrieta22@hotmail.com"],
    subject: `[TEST] ¡Nueva Orden! #${orderNumber}`,
    html: emailHtml,
  });

  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent successfully! Resend ID:", data?.id);
  }
}

run().catch(console.error);
