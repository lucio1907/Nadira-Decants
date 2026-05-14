import "dotenv/config";
import { sendShipmentConfirmationEmail } from "./lib/resend";
import { updateOrderStatus } from "./lib/orders";
import { getOrders } from "./lib/orders";

async function run() {
  const orders = await getOrders();
  const testOrder = orders.find(o => o.metodoEntrega === 'envio' && o.status === 'shipped') || orders[0];
  
  if (!testOrder) {
    console.error("No orders found to test.");
    return;
  }

  console.log("Testing email for order:", testOrder.id);
  
  // Fake update tracking number to trigger email
  const newTracking = "TEST" + Math.random().toString().slice(2, 8);
  console.log("Updating tracking number to", newTracking);
  await updateOrderStatus(testOrder.id, testOrder.status, newTracking);
  
  console.log("Waiting for async email to send...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log("Done.");
}

run().catch(console.error);
