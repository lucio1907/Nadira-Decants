import { CorreoArgentinoClient } from "../lib/correo-argentino";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const client = new CorreoArgentinoClient();
  const items = [{ id: "1", quantity: 1, name: "Perfume", price: 5000 }];
  
  // Directly access ensureToken and make fetch to see raw data
  await (client as any).ensureToken();
  const payload = {
    customerId: (client as any).customerId,
    postalCodeOrigin: "2942",
    postalCodeDestination: "1001",
    dimensions: { weight: 500, height: 10, width: 10, length: 10 }
  };
  const resp = await fetch(`${(client as any).baseUrl}/rates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${(client as any).token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await resp.json();
  console.log(JSON.stringify(result.rates, null, 2));
}
test();
