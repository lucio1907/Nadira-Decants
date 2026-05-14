import { CorreoArgentinoClient } from "./lib/correo-argentino";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const client = new CorreoArgentinoClient();
  const order = {
    id: "fbcff98e-ed6a-4934-bc2c-5645db7af99e",
    cliente_nombre: "Lucio",
    cliente_apellido: "Arrieta",
    cliente_telefono: "11111111",
    payer_email: "test@test.com",
    total_amount: 5000,
    items: [{ id: "1", quantity: 1, name: "Perfume", price: 5000 }],
    direccion_envio: {
      "cp": "2942",
      "piso": "",
      "calle": "Thames",
      "depto": "",
      "notas": "",
      "numero": "1045",
      "localidad": "Estacion Baradero",
      "provincia": "Buenos Aires",
      "locationId": "B0408",
      "sucursalCiudad": "BARADERO",
      "sucursalNombre": "BARADERO",
      "sucursalPostalCode": "B2942DNS"
    }
  };
  
  // Override fetch to intercept the payload
  const origFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (url.toString().includes("shipping/import")) {
      console.log("PAYLOAD SENT TO CORREO ARGENTINO:");
      console.log(JSON.stringify(JSON.parse(options?.body as string), null, 2));
      return { ok: true, json: () => Promise.resolve({ ok: true }) } as any;
    }
    return origFetch(url, options);
  };

  await client.generateLabel(order, "correoArgentino", "Domicilio Correo Argentino Clasico");
}
test();
