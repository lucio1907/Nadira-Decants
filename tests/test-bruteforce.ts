import { CorreoArgentinoClient } from "./lib/correo-argentino";
import dotenv from "dotenv";
dotenv.config();

async function testField(fieldName: string) {
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
  
  // Intercept fetch
  const origFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (url.toString().includes("shipping/import")) {
      const body = JSON.parse(options?.body as string);
      
      // Inject the field
      body.recipient[fieldName] = "3329";
      options.body = JSON.stringify(body);
      
      return origFetch(url, options);
    }
    return origFetch(url, options);
  };

  try {
    await client.generateLabel(order as any, "correoArgentino", "Domicilio Correo Argentino Clasico");
    console.log(`[SUCCESS] Field '${fieldName}' was ACCEPTED by the API!`);
  } catch (err: any) {
    if (err.message.includes("Unrecognized field")) {
      console.log(`[REJECTED] Field '${fieldName}' is unrecognized.`);
    } else {
      console.log(`[ERROR] Field '${fieldName}' gave another error: ${err.message}`);
    }
  }
  
  // Restore fetch
  global.fetch = origFetch;
}

async function run() {
  const fieldsToTest = [
    "areaCode",
    "phoneAreaCode",
    "cellPhoneAreaCode",
    "phonePrefix",
    "cellPhonePrefix",
    "prefix",
    "area",
    "phoneCode"
  ];
  
  for (const field of fieldsToTest) {
    await testField(field);
  }
}

run();
