export interface EnviaAddress {
  name: string;
  company?: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  country: "AR";
  postalCode: string;
  locationId?: string; // For sucursal shipments
}

export interface EnviaBranch {
  id: string;
  name: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: string;
  longitude?: string;
}

export interface EnviaPackage {
  content: string;
  amount: number;
  type: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  insurance: number;
  declaredValue: number;
  weightUnit: "KG" | "kg";
  lengthUnit: "CM" | "cm";
}

export interface EnviaQuoteRequest {
  origin: EnviaAddress;
  destination: EnviaAddress;
  packages: EnviaPackage[];
  shipment: {
    type: number;
  };
}

export interface EnviaQuoteResponse {
  meta: string;
  data: Array<{
    carrier: string;
    carrier_id: number;
    service: string;
    service_id: number;
    totalPrice: number;
    deliveryEstimate: string;
    basePrice: number;
    fuelPrice: number;
    extraPrice: number;
    taxPrice: number;
  }>;
}

const ORIGIN_ADDRESS: EnviaAddress = {
  name: "Daniela Fernanda Arrieta",
  company: "Nadira Decants",
  email: "nadira.beauty.baradero@gmail.com",
  phone: "5493329516307",
  street: "San Martin",
  number: "1485",
  district: "Centro",
  city: "Baradero",
  state: "BA", // Fixed: Envia uses 'BA' for Buenos Aires province
  country: "AR",
  postalCode: "2942",
};

const PROVINCIA_MAPPING: Record<string, string> = {
  "Buenos Aires": "BA",
  "CABA": "DF",
  "Catamarca": "CT",
  "Chaco": "CC",
  "Chubut": "CH",
  "Córdoba": "CB",
  "Corrientes": "CN",
  "Entre Ríos": "ER",
  "Formosa": "FM",
  "Jujuy": "JY",
  "La Pampa": "LP",
  "La Rioja": "LR",
  "Mendoza": "MZ",
  "Misiones": "MN",
  "Neuquén": "NQ",
  "Río Negro": "RN",
  "Salta": "SA",
  "San Juan": "SJ",
  "San Luis": "SL",
  "Santa Cruz": "SC",
  "Santa Fe": "SF",
  "Santiago del Estero": "SE",
  "Tierra del Fuego": "TF",
  "Tucumán": "TM"
};

export class EnviaClient {
  private token: string;
  private baseUrl = process.env.ENVIA_API_URL || "https://api.envia.com";
  private queriesUrl = process.env.ENVIA_QUERIES_URL || "https://queries.envia.com";

  constructor() {
    this.token = process.env.ENVIA_API_TOKEN || "";
    if (!this.token) {
      console.warn("ENVIA_API_TOKEN is not defined in environment variables");
    }
  }

  async getQuotes(destinationZip: string, province: string, items: any[]): Promise<EnviaQuoteResponse["data"]> {
    const packages = this.mapItemsToPackages(items);
    
    // Map full province name to Envia/AR single letter code
    const stateCode = PROVINCIA_MAPPING[province] || province;

    const payload = {
      origin: ORIGIN_ADDRESS,
      destination: {
        ...ORIGIN_ADDRESS, // Template
        name: "Cliente",
        postalCode: destinationZip,
        state: stateCode,
        city: "", // Optional in query usually
      },
      packages,
      shipment: {
        type: 1, // Package
        carrier: "correoArgentino" // Correct slug for Correo Argentino
      },
    };

    try {
      // Use the standard Shipping API for rates
      const resp = await fetch(`${this.baseUrl}/ship/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
          "User-Agent": "NadiraDecants/1.0" // Some WAFs require this
        },
        body: JSON.stringify(payload),
      });

      const bodyText = await resp.text();

      if (!resp.ok) {
        throw new Error(`Envia API Error (Rates): ${bodyText}`);
      }

      let result: any;
      try {
        result = JSON.parse(bodyText);
      } catch (e) {
        throw new Error(`Envia API Response is not JSON: ${bodyText.substring(0, 200)}`);
      }
      
      if (!result.data || !Array.isArray(result.data)) {
        console.error("Envia API returned no data array:", result);
        return [];
      }
      
      // Filter result double-check (though we requested it in payload)
      return result.data.filter((q: any) => q.carrier && q.carrier.toLowerCase().includes("correoargentino"));
    } catch (error) {
      console.error("Error fetching Envia quotes:", error);
      throw error;
    }
  }

  async getBranches(zipCode: string, carrier: string = "correoArgentino"): Promise<EnviaBranch[]> {
    const domain = this.queriesUrl.replace('https://', '').replace('http://', '');
    
    // El slug para Correo Argentino en este endpoint específico suele ser 'correoargentino'
    const carriersToTry = ["correoargentino", "ca", "corargentino"];

    console.log(`[Envia] Fetching branches for ${carrier} at ${zipCode} using path-based API`);

    for (const slug of carriersToTry) {
      try {
        const url = `https://${domain}/branches/${slug}/AR`;
        
        const resp = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${this.token}`,
          },
        });

        if (!resp.ok) continue;

        const data = await resp.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Filtrar por código postal (algunos vienen como string, otros como número)
          // Normalizamos el zipCode para comparar (ej: "C1000" -> "1000" si es necesario, 
          // o simplemente coincidencia exacta si Envia usa el mismo formato)
          const filtered = data.filter((b: any) => {
            const bZip = String(b.address?.postalCode || "");
            return bZip === zipCode || bZip.includes(zipCode) || zipCode.includes(bZip);
          });

          if (filtered.length > 0) {
            console.log(`[Envia] SUCCESS! Found ${filtered.length} branches for CP ${zipCode} (from ${data.length} total) using ${slug}`);
            
            return filtered.map((b: any) => ({
              id: String(b.branch_id || b.branch_code || ""),
              name: b.reference || b.name || "Sucursal Correo Argentino",
              street: b.address?.street || "",
              number: b.address?.number || "",
              district: b.address?.locality || b.address?.district || "",
              city: b.address?.city || "",
              state: b.address?.state || "",
              postalCode: b.address?.postalCode || zipCode,
              latitude: b.address?.latitude || null,
              longitude: b.address?.longitude || null,
            }));
          }
        }
      } catch (e) {
        // Continue to next slug
      }
    }

    console.log(`[Envia] No branches found for CP ${zipCode} after filtering the full carrier list.`);
    return [];
  }

  async generateLabel(order: any, carrier: string, service: string) {
    const packages = this.mapItemsToPackages(order.items);
    
    // Suporting both frontend (camelCase) and DB (snake_case) formats
    const addr = order.direccion_envio || order.direccionEnvio;
    if (!addr) throw new Error("No se encontró la dirección de envío en la orden.");

    const provincia = addr.provincia;
    const city = addr.localidad || addr.ciudad;
    const cp = addr.cp || addr.codigoPostal;
    const street = addr.calle;
    const number = addr.numero;
    const floor = addr.piso || addr.pisoDepto;

    const stateCode = PROVINCIA_MAPPING[provincia] || provincia;

    const payload = {
      origin: ORIGIN_ADDRESS,
      destination: {
        name: `${order.cliente_nombre || order.clienteNombre || ""} ${order.cliente_apellido || order.clienteApellido || ""}`.trim(),
        company: "",
        email: order.payer_email || order.payerEmail || "",
        phone: order.cliente_telefono || order.clienteTelefono || "",
        street: street,
        number: number,
        district: city, // Envia usually maps city to district for AR
        city: city,
        state: stateCode,
        country: "AR",
        postalCode: cp,
        reference: floor || "",
      },
      packages,
      shipment: {
        carrier: carrier,
        service: service,
        type: 1,
        ...(addr.locationId ? { destinationBranchCode: addr.locationId } : {})
      },
      settings: {
        printFormat: "PDF",
        printSize: "STOCK_4X6",
      }
    };

    try {
      console.log("Envia Label Payload:", JSON.stringify(payload, null, 2));
      const resp = await fetch(`${this.baseUrl}/ship/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      const bodyText = await resp.text();
      console.log("Envia Label Response:", bodyText);

      if (!resp.ok) {
        throw new Error(`Envia API Error Label (${resp.status}): ${bodyText}`);
      }

      return JSON.parse(bodyText);
    } catch (error) {
      console.error("Error generating Envia label:", error);
      throw error;
    }
  }

  private mapItemsToPackages(items: any[]): EnviaPackage[] {
    // Collect total weight from all items. Ensure at least 100g if data is missing.
    let totalWeight = items.reduce((sum, item) => {
      const peso = item.variante?.peso_g || item.peso_g || 100;
      return sum + (Number(peso) || 100) * item.quantity;
    }, 0);
    
    // Safety check: Envia requires weight > 0
    if (totalWeight <= 0) totalWeight = 100;
    
    // Heuristic for box size: if it's just one item, use its exact dimensions
    // if more, use a box large enough (heuristic)
    const isSingleItem = items.length === 1 && items[0].quantity === 1;
    let boxSize;

    if (isSingleItem) {
      const v = items[0].variante || items[0];
      boxSize = {
        length: Number(v.largo_cm || 10),
        width: Number(v.ancho_cm || 10),
        height: Number(v.alto_cm || 5)
      };
    } else {
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      boxSize = this.calculateBoxSize(itemCount);
    }

    return [{
      content: "Perfumes / Fragancias",
      amount: 1,
      type: "box",
      dimensions: boxSize,
      weight: Math.max(0.1, totalWeight / 1000), // Convert to kg, min 0.1kg (100g)
      insurance: 0,
      declaredValue: 0,
      weightUnit: "KG",
      lengthUnit: "CM",
    }];
  }

  private calculateBoxSize(itemCount: number) {
    // Simple heuristic
    if (itemCount <= 2) return { length: 15, width: 10, height: 5 };
    if (itemCount <= 5) return { length: 20, width: 15, height: 10 };
    return { length: 30, width: 20, height: 15 };
  }
}
