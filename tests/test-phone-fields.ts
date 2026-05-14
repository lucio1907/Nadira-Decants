import { CorreoArgentinoClient } from "../lib/correo-argentino";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const client = new CorreoArgentinoClient();
  const order = {
    id: "fbcff98e-ed6a-4934-bc2c-5645db7af99e",
    cliente_nombre: "Lucio",
    cliente_apellido: "Arrieta",
    cliente_telefono: "3329402087",
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
      "provincia": "Buenos Aires"
    }
  };
  
  const origFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (url.toString().includes("shipping/import")) {
      const body = JSON.parse(options?.body as string);
      
      // Test hypothesis: phone is area code, cellPhone is number
      body.recipient.phone = "3329";
      body.recipient.cellPhone = "402087";
      
      options.body = JSON.stringify(body);
      return origFetch(url, options);
    }
    return origFetch(url, options);
  };

  try {
    const response = await client.generateLabel(order as any, "correoArgentino", "Domicilio Correo Argentino Clasico");
    console.log("[SUCCESS] Label generated successfully with phone='3329' and cellPhone='402087'!");
  } catch (err: any) {
    console.log("[ERROR]", err.message);
  }
}
test();
