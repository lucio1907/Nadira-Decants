import { getShippingConfig, ShippingConfig, ShippingBox, getShippingBoxes } from "./shipping-config";

export interface CorreoArgentinoPackage {
  weight: number; // in kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

const PROVINCIA_MAPPING: Record<string, string> = {
  "Buenos Aires": "B",
  "CABA": "C",
  "Catamarca": "K",
  "Chaco": "H",
  "Chubut": "U",
  "Córdoba": "X",
  "Corrientes": "W",
  "Entre Ríos": "E",
  "Formosa": "P",
  "Jujuy": "Y",
  "La Pampa": "L",
  "La Rioja": "F",
  "Mendoza": "M",
  "Misiones": "N",
  "Neuquén": "Q",
  "Río Negro": "R",
  "Salta": "A",
  "San Juan": "J",
  "San Luis": "D",
  "Santa Cruz": "Z",
  "Santa Fe": "S",
  "Santiago del Estero": "G",
  "Tierra del Fuego": "V",
  "Tucumán": "T"
};

let cachedToken = "";
let tokenExpiration = 0; // Timestamp

export class CorreoArgentinoClient {
  private token: string;
  private customerId: string;
  private baseUrl = process.env.CORREO_ARG_API_URL || "https://apitest.correoargentino.com.ar/micorreo/v1";

  constructor() {
    this.token = process.env.CORREO_ARG_JWT_TOKEN || cachedToken;
    this.customerId = process.env.CORREO_ARG_CUSTOMER_ID || "";
    if (!this.customerId) {
      console.warn("CORREO_ARG_CUSTOMER_ID is not defined in environment variables");
    }
  }

  private async ensureToken() {
    if (this.token) return; // If manually set in env or cached
    
    // Check if we have a valid cached token
    if (cachedToken && Date.now() < tokenExpiration) {
      this.token = cachedToken;
      return;
    }

    const user = process.env.CORREO_ARG_API_USER;
    const pass = process.env.CORREO_ARG_API_PASSWORD;
    
    if (!user || !pass) {
      console.warn("CORREO_ARG_API_USER or CORREO_ARG_API_PASSWORD missing. Cannot generate token.");
      return;
    }

    try {
      const basicAuth = Buffer.from(`${user}:${pass}`).toString('base64');
      const resp = await fetch(`${this.baseUrl}/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
        },
      });

      if (!resp.ok) {
        throw new Error(`Failed to generate token: ${await resp.text()}`);
      }

      const data = await resp.json();
      if (data.token) {
        this.token = data.token;
        cachedToken = data.token;
        // Parse expiration or set a default TTL of 23 hours to be safe (PDF shows it usually lasts 24h)
        tokenExpiration = Date.now() + 23 * 60 * 60 * 1000; 
      }
    } catch (e) {
      console.error("Correo Argentino Token Gen Error:", e);
    }
  }

  async getQuotes(destinationZip: string, province: string, items: any[]): Promise<any[]> {
    await this.ensureToken();
    const [shippingConfig, shippingBoxes] = await Promise.all([
      getShippingConfig(),
      getShippingBoxes()
    ]);
    const packages = this.mapItemsToPackages(items, shippingConfig, shippingBoxes);
    const pkg = packages[0];
    
    const payload = {
      customerId: this.customerId,
      postalCodeOrigin: "2942", // Configurado para Nadira Decants
      postalCodeDestination: destinationZip,
      dimensions: {
        weight: Math.max(1, Math.round(pkg.weight * 1000)), // en gramos
        height: Math.round(pkg.dimensions.height),
        width: Math.round(pkg.dimensions.width),
        length: Math.round(pkg.dimensions.length)
      }
    };

    try {
      const resp = await fetch(`${this.baseUrl}/rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      const bodyText = await resp.text();

      if (!resp.ok) {
        throw new Error(`Correo Argentino API Error (Rates): ${bodyText}`);
      }

      let result: any;
      try {
        result = JSON.parse(bodyText);
      } catch (e) {
        throw new Error(`Correo Argentino API Response is not JSON: ${bodyText.substring(0, 200)}`);
      }
      
      if (!result.rates || !Array.isArray(result.rates)) {
        console.error("Correo Argentino API returned no rates array:", result);
        return [];
      }
      
      // Map to frontend expected format
      return result.rates.map((r: any, idx: number) => ({
        carrier: "correoArgentino",
        carrier_id: 1, // Dummy
        // El nombre del servicio incluirá si es sucursal/domicilio y si es clásico/expreso
        service: `${r.deliveredType === "S" ? "Sucursal" : "Domicilio"} ${r.productName}`,
        // Usamos service_id para guardar el productType (CP o EP) y el tipo de entrega (S o D)
        service_id: `${r.productType}-${r.deliveredType}`,
        totalPrice: r.price,
        deliveryEstimate: `${r.deliveryTimeMin}-${r.deliveryTimeMax} días`,
        basePrice: r.price,
        fuelPrice: 0,
        extraPrice: 0,
        taxPrice: 0,
      }));
    } catch (error) {
      console.error("Error fetching Correo Argentino quotes:", error);
      throw error;
    }
  }

  async getBranches(zipCode: string, provinceInput?: string): Promise<any[]> {
    await this.ensureToken();
    let provinceCode = "B"; // Default fallback
    if (provinceInput) {
      // Intentar encontrar el código de 1 letra
      const stateUpper = provinceInput.toUpperCase();
      const foundKey = Object.keys(PROVINCIA_MAPPING).find(k => k.toUpperCase() === stateUpper);
      if (foundKey) {
        provinceCode = PROVINCIA_MAPPING[foundKey];
      } else if (stateUpper.includes("CABA") || stateUpper === "C" || stateUpper.includes("FEDERAL")) {
        provinceCode = "C";
      }
    }

    try {
      const url = `${this.baseUrl}/agencies?customerId=${this.customerId}&provinceCode=${provinceCode}`;
      
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.token}`,
        },
      });

      if (!resp.ok) {
        console.error(`Error fetching branches: ${await resp.text()}`);
        return [];
      }

      const data = await resp.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const normalizeZip = (cp: string) => {
          const clean = cp.toUpperCase().replace(/\s/g, "");
          const match = clean.match(/[A-Z]?(\d{4})[A-Z]{0,3}/);
          return match ? match[1] : clean;
        };

        const searchZip = normalizeZip(zipCode);

        let filtered = data.filter((b: any) => {
          const bZipRaw = String(b.location?.address?.postalCode || "").trim();
          if (!bZipRaw) return false;
          const bZip = normalizeZip(bZipRaw);
          return bZip === searchZip;
        });

        // Si no hay coincidencias exactas, buscar las más cercanas por diferencia numérica del Código Postal
        if (filtered.length === 0) {
          const searchNum = parseInt(searchZip, 10);
          if (!isNaN(searchNum)) {
            const withDiff = data.map((b: any) => {
              const bZipRaw = String(b.location?.address?.postalCode || "").trim();
              const bZip = normalizeZip(bZipRaw);
              const bNum = parseInt(bZip, 10);
              const diff = (!bZip || isNaN(bNum)) ? 999999 : Math.abs(bNum - searchNum);
              return { b, diff, bZip };
            }).filter((x: any) => x.bZip); // ignorar las que no tienen CP
            
            withDiff.sort((x: any, y: any) => x.diff - y.diff);
            
            // Tomamos las 5 sucursales con código postal numéricamente más cercano
            filtered = withDiff.slice(0, 5).map((x: any) => x.b);
          }
        }

        if (filtered.length > 0) {
          return filtered.map((b: any) => ({
            id: String(b.code || ""),
            name: b.name || "Sucursal Correo Argentino",
            street: b.location?.address?.streetName || "",
            number: b.location?.address?.streetNumber || "",
            district: b.location?.address?.locality || "",
            city: b.location?.address?.city || "",
            state: b.location?.address?.province || "",
            postalCode: b.location?.address?.postalCode || zipCode,
            latitude: b.location?.latitude || null,
            longitude: b.location?.longitude || null,
          }));
        }
      }
      return [];
    } catch (e) {
      console.error("Exception fetching branches:", e);
      return [];
    }
  }

  async generateLabel(order: any, carrierInput: string, service: string) {
    await this.ensureToken();
    const config = await getShippingConfig();
    const packages = this.mapItemsToPackages(order.items, config);
    const pkg = packages[0];
    
    let addr = order.direccion_envio || order.direccionEnvio;
    if (typeof addr === 'string') {
      try { addr = JSON.parse(addr); } catch (e) { console.error("Error parsing direccion_envio:", e); }
    }

    if (!addr) throw new Error("No se encontró la dirección de envío en la orden.");

    const locationId = addr.locationId || addr.branch_code || addr.branchCode;
    const rawCp = addr.codigoPostal || addr.cp || addr.postalCode || "";
    const rawStreet = addr.calle || addr.street || "";
    const rawNumber = addr.numero || addr.number || "";
    const rawCity = addr.ciudad || addr.localidad || addr.city || addr.district || "";
    const rawState = addr.provincia || addr.state || "";

    const isSucursal = service.toLowerCase().includes("suc") || service.toLowerCase().includes("sucursal") || service.toLowerCase().includes("punto");
    const finalCp = (isSucursal && (addr.sucursalPostalCode || addr.branchPostalCode)) ? (addr.sucursalPostalCode || addr.branchPostalCode) : rawCp;
    const finalCity = (isSucursal && (addr.sucursalCiudad || addr.branchCity)) ? (addr.sucursalCiudad || addr.branchCity) : rawCity;
    const finalStreet = (isSucursal && !rawStreet) ? (addr.sucursalNombre || "Sucursal Correo Argentino") : rawStreet;
    const finalNumber = (isSucursal && !rawNumber) ? (addr.sucursalPostalCode || finalCp || "1") : rawNumber;

    const cleanPhone = (p: string) => (p || "").replace(/\D/g, "");
    const cleanNumeric = (v: any) => String(v || "").replace(/\D/g, "");
    const displayPostalCode = isSucursal ? cleanNumeric(finalCp) : finalCp;

    let stateClean = "B";
    const stateUpper = String(rawState || "").trim().toUpperCase();
    const foundKey = Object.keys(PROVINCIA_MAPPING).find(k => k.toUpperCase() === stateUpper);
    if (foundKey) {
      stateClean = PROVINCIA_MAPPING[foundKey];
    } else if (stateUpper.includes("CABA") || stateUpper === "C" || stateUpper.includes("FEDERAL")) {
      stateClean = "C";
    }

    const parseArgentinePhone = (p: string) => {
      let digits = (p || "").replace(/\D/g, "");
      if (digits.startsWith("54")) digits = digits.slice(2);
      if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
      digits = digits.slice(-10); 

      if (digits.length !== 10) return { area: "", num: digits };

      if (digits.startsWith("11")) {
        return { area: "11", num: digits.slice(2) };
      }

      const threeDigitCodes = ["220", "221", "223", "236", "249", "260", "261", "263", "264", "266", "280", "291", "294", "297", "298", "299", "336", "341", "342", "343", "345", "348", "351", "353", "358", "362", "370", "376", "379", "380", "381", "383", "385", "387", "388"];
      const firstThree = digits.slice(0, 3);
      
      if (threeDigitCodes.includes(firstThree)) {
        return { area: firstThree, num: digits.slice(3) };
      }

      return { area: digits.slice(0, 4), num: digits.slice(4) };
    };

    const isExpreso = service.toLowerCase().includes("expreso");
    
    const parsedSender = parseArgentinePhone("3329516307");
    const parsedRecipient = parseArgentinePhone(order.cliente_telefono || order.clienteTelefono || "");

    const payload: any = {
      customerId: this.customerId,
      extOrderId: String(order.id),
      orderNumber: String(order.id).slice(-8).toUpperCase(),
      sender: {
        name: "Nadira Decants",
        phone: parsedSender.area || parsedSender.num,
        cellPhone: parsedSender.num,
        email: "nadira.beauty.baradero@gmail.com",
        originAddress: {
          streetName: "San Martin",
          streetNumber: "1485",
          floor: "",
          apartment: "",
          city: "Baradero",
          provinceCode: "B",
          postalCode: "2942"
        }
      },
      recipient: {
        name: `${order.cliente_nombre || ""} ${order.cliente_apellido || ""}`.trim(),
        phone: parsedRecipient.area || parsedRecipient.num,
        cellPhone: parsedRecipient.num,
        email: order.payer_email || order.cliente_email || order.clienteEmail || "",
      },
      shipping: {
        deliveryType: isSucursal ? "S" : "D",
        productType: isExpreso ? "EP" : "CP",
        weight: Math.max(1, Math.round(pkg.weight * 1000)),
        declaredValue: Number(order.total_amount) || 0,
        height: Math.round(pkg.dimensions.height),
        length: Math.round(pkg.dimensions.length),
        width: Math.round(pkg.dimensions.width),
      }
    };

    if (isSucursal) {
      payload.shipping.agency = String(locationId);
    } else {
      payload.shipping.address = {
        streetName: finalStreet || "Calle Conocida",
        streetNumber: finalNumber || "123",
        floor: String(addr.piso || "").substring(0, 3),
        apartment: String(addr.depto || "").substring(0, 3),
        city: finalCity,
        provinceCode: stateClean,
        postalCode: displayPostalCode
      };
    }

    try {
      const resp = await fetch(`${this.baseUrl}/shipping/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      const bodyText = await resp.text();

      if (!resp.ok) {
        throw new Error(`Correo Argentino API Error Import (${resp.status}): ${bodyText}`);
      }

      const result = JSON.parse(bodyText);
      
      // IMPORTANTE: La API no devuelve una URL de etiqueta, solo un status de importación.
      // Devolvemos un mock para que el sistema de Nadira no se rompa y guarde el envío.
      return {
        data: [{
          trackUrl: `https://micorreo.correoargentino.com.ar/`, // Placeholder
          label: "imported", // Valor mock para que la UI sepa que ya se importó
          trackingNumber: result.createdAt ? "Importar desde MiCorreo" : "Error",
          shipmentId: result.createdAt ? `micorreo-${order.id}` : ""
        }]
      };
    } catch (error) {
      console.error("Error importing to Correo Argentino:", error);
      throw error;
    }
  }

  private mapItemsToPackages(items: any[], config: ShippingConfig, boxes: ShippingBox[] = []): CorreoArgentinoPackage[] {
    const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    
    let selectedBox = { length: 15, width: 10, height: 5 };
    let packagingWeight = Number(config.packaging_base_weight_g) || 130;

    if (boxes.length > 0) {
      const bestFit = boxes.find(b => b.max_items >= totalQuantity);
      if (bestFit) {
        selectedBox = {
          length: Number(bestFit.largo_cm),
          width: Number(bestFit.ancho_cm),
          height: Number(bestFit.alto_cm)
        };
        packagingWeight = Number(bestFit.peso_base_g) || packagingWeight;
      } else {
        const largestBox = boxes[boxes.length - 1];
        selectedBox = {
          length: Number(largestBox.largo_cm),
          width: Number(largestBox.ancho_cm),
          height: Number(largestBox.alto_cm)
        };
        packagingWeight = Number(largestBox.peso_base_g) || packagingWeight;
        selectedBox.height += Math.ceil((totalQuantity - largestBox.max_items) / 5) * 2;
      }
    } else {
      if (totalQuantity > 15) {
        selectedBox.height += Math.floor((totalQuantity - 15) / 5) * 2;
      }
    }

    const decantWeight = Number(config.decant_weight_g) || 12;
    let totalWeightG = (totalQuantity * decantWeight) + packagingWeight;
    if (totalWeightG <= 0) totalWeightG = 150;

    return [{
      dimensions: selectedBox,
      weight: Math.max(0.1, totalWeightG / 1000),
    }];
  }
}
