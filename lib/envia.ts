import { getShippingConfig, ShippingConfig, ShippingBox, getShippingBoxes } from "./shipping-config";
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
    const [shippingConfig, shippingBoxes] = await Promise.all([
      getShippingConfig(),
      getShippingBoxes()
    ]);
    const packages = this.mapItemsToPackages(items, shippingConfig, shippingBoxes);
    
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
          // Normalización de códigos postales para una búsqueda más flexible
          const normalizeZip = (cp: string) => {
            const clean = cp.toUpperCase().replace(/\s/g, "");
            const match = clean.match(/[A-Z]?(\d{4})[A-Z]{0,3}/);
            return match ? match[1] : clean;
          };

          const searchZip = normalizeZip(zipCode);
          const isGenericCaba = searchZip === "1000";

          let filtered = data.filter((b: any) => {
            const bZipRaw = String(b.address?.postalCode || "");
            const bZip = normalizeZip(bZipRaw);
            const bState = String(b.address?.state || "").toUpperCase();

            // Especial para CABA: Si ponen 1000, mostrar todo lo de DF (Ciudad Autónoma)
            if (isGenericCaba && (bState === "DF" || bState === "CABA" || bState === "C")) {
              return true;
            }

            return bZip === searchZip || bZip.includes(searchZip) || searchZip.includes(bZip);
          });

          // Si no hay resultados exactos, intentamos una búsqueda más amplia por prefijo (primeros 3 dígitos)
          if (filtered.length === 0 && searchZip.length >= 3) {
            const prefix = searchZip.substring(0, 3);
            filtered = data.filter((b: any) => {
              const bZip = normalizeZip(String(b.address?.postalCode || ""));
              return bZip.startsWith(prefix);
            });
          }

          if (filtered.length > 0) {
            console.log(`[Envia] SUCCESS! Found ${filtered.length} branches for CP ${zipCode} (normalized: ${searchZip}) using ${slug}`);
            
            return filtered
              .sort((a, b) => {
                // Ordenar: primero las que tengan el CP exacto, luego por nombre
                const aZip = normalizeZip(String(a.address?.postalCode || ""));
                const bZip = normalizeZip(String(b.address?.postalCode || ""));
                if (aZip === searchZip && bZip !== searchZip) return -1;
                if (aZip !== searchZip && bZip === searchZip) return 1;
                return (a.reference || a.name || "").localeCompare(b.reference || b.name || "");
              })
              .map((b: any) => ({
                id: String(b.branch_code || b.branch_id || ""),
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

  async generateLabel(order: any, carrierInput: string, service: string) {
    console.log(">>> [ENVIA_CLIENT] GENERATING LABEL - VERSION: 2.5 (EMAIL_FIX) <<<");
    const config = await getShippingConfig();
    const packages = this.mapItemsToPackages(order.items, config);
    
    // Suporting both frontend (camelCase) and DB (snake_case) formats
    let addr = order.direccion_envio || order.direccionEnvio;
    if (typeof addr === 'string') {
      try { addr = JSON.parse(addr); } catch (e) { console.error("Error parsing direccion_envio:", e); }
    }

    if (!addr) throw new Error("No se encontró la dirección de envío en la orden.");

    const locationId = addr.locationId || addr.branch_code || addr.branchCode;
    const rawCp = addr.codigoPostal || addr.cp || addr.postalCode || "";
    
    // Mapeo robusto de campos (Soportando nombres en español e inglés)
    const rawStreet = addr.calle || addr.street || "";
    const rawNumber = addr.numero || addr.number || "";
    const rawCity = addr.ciudad || addr.localidad || addr.city || addr.district || "";
    const rawState = addr.provincia || addr.state || "";

    // IMPORTANT: For branch shipments, we MUST use the branch's CP and City
    const isSucursal = !!locationId || service.toLowerCase().includes("suc") || service.toLowerCase().includes("sucursal");
    const finalCp = (isSucursal && (addr.sucursalPostalCode || addr.branchPostalCode)) ? (addr.sucursalPostalCode || addr.branchPostalCode) : rawCp;
    const finalCity = (isSucursal && (addr.sucursalCiudad || addr.branchCity)) ? (addr.sucursalCiudad || addr.branchCity) : rawCity;
    
    // For branches, if street/number are empty, we use branch info as placeholder
    const finalStreet = (isSucursal && !rawStreet) ? (addr.sucursalNombre || "Sucursal Correo Argentino") : rawStreet;
    const finalNumber = (isSucursal && !rawNumber) ? (addr.sucursalPostalCode || finalCp || "1") : rawNumber;
    
    const carrier = carrierInput.toLowerCase().replace(/-/g, "").includes("correoargentino") 
      ? "correoargentino" 
      : carrierInput;

    // Helper functions for normalization
    const cleanPhone = (p: string) => (p || "").replace(/\D/g, "");
    const cleanNumeric = (v: any) => String(v || "").replace(/\D/g, "");

    // Normalización crítica para Correo Argentino
    const displayPostalCode = isSucursal ? cleanNumeric(finalCp) : finalCp;
    const locationIdClean = String(locationId || "").trim();
    
    // Normalización robusta de Provincia (Debe ser de 2 letras para Envia)
    const stateInput = String(rawState || "").trim();
    const stateUpper = stateInput.toUpperCase();
    
    let stateClean = "";
    
    // 1. Buscar en el mapeo (insensible a mayúsculas)
    const foundKey = Object.keys(PROVINCIA_MAPPING).find(k => k.toUpperCase() === stateUpper);
    if (foundKey) {
      stateClean = PROVINCIA_MAPPING[foundKey];
    } 
    // 2. Si ya tiene 2 letras, lo usamos directo
    else if (stateInput.length === 2) {
      stateClean = stateUpper;
    }
    // 3. Casos especiales de CABA
    else if (stateUpper.includes("CABA") || stateUpper.includes("CIUDAD AUTONOMA") || stateUpper === "C" || stateUpper.includes("FEDERAL")) {
      stateClean = "DF";
    }
    // 4. Fallback: Si sigue siendo largo, enviamos BA como seguro para Argentina
    else {
      stateClean = "BA";
    }

    if (!stateClean) stateClean = "BA"; 

    // FINAL CRITICAL FIX: For Correo Argentino, CABA MUST be "DF"
    // CABA postal codes are normally between 1000 and 1499
    const cpNum = parseInt(cleanNumeric(displayPostalCode));
    if (cpNum >= 1000 && cpNum <= 1499) {
      stateClean = "DF";
    }
    
    const cityClean = finalCity || (isSucursal ? "CABA" : "");

    const payload: any = {
      origin: {
        ...ORIGIN_ADDRESS,
        phone: cleanPhone(ORIGIN_ADDRESS.phone),
        postalCode: cleanNumeric(ORIGIN_ADDRESS.postalCode)
      },
      destination: {
        name: `${order.cliente_nombre || ""} ${order.cliente_apellido || ""}`.trim(),
        company: isSucursal ? (addr.sucursalNombre || "Sucursal Correo Argentino") : "",
        email: order.payer_email || order.cliente_email || order.clienteEmail || "",
        phone: cleanPhone(order.cliente_telefono || order.clienteTelefono || ""),
        street: finalStreet || "Calle Conocida",
        number: finalNumber || "123",
        district: cityClean,
        city: cityClean,
        state: stateClean,
        country: "AR",
        postalCode: displayPostalCode,
        reference: addr.referencia || addr.piso || addr.pisoDepto || "",
        ...(locationId ? { 
          branchCode: locationIdClean, 
          locationId: locationIdClean 
        } : {})
      },
      packages,
      shipment: {
        carrier: carrier,
        service: service,
        type: isSucursal ? 11 : 1,
        ...(locationId ? { 
          destinationBranchCode: locationIdClean,
          branchCode: locationIdClean,
          locationId: locationIdClean,
          destinationUnitCode: locationIdClean,
          isReference: 1
        } : {})
      },
      settings: {
        printFormat: "PDF",
        printSize: "STOCK_4X6"
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

  private mapItemsToPackages(items: any[], config: ShippingConfig, boxes: ShippingBox[] = []): EnviaPackage[] {
    // Total quantity of items in the cart
    const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    
    // 1. Determine the best box
    let selectedBox: { length: number; width: number; height: number };
    let packagingWeight = Number(config.packaging_base_weight_g) || 130; // Fallback global

    if (boxes.length > 0) {
      // Find the first box that can fit the totalQuantity
      const bestFit = boxes.find(b => b.max_items >= totalQuantity);
      
      if (bestFit) {
        selectedBox = {
          length: Number(bestFit.largo_cm),
          width: Number(bestFit.ancho_cm),
          height: Number(bestFit.alto_cm)
        };
        packagingWeight = Number(bestFit.peso_base_g) || packagingWeight;
      } else {
        // Use the largest one available
        const largestBox = boxes[boxes.length - 1];
        selectedBox = {
          length: Number(largestBox.largo_cm),
          width: Number(largestBox.ancho_cm),
          height: Number(largestBox.alto_cm)
        };
        packagingWeight = Number(largestBox.peso_base_g) || packagingWeight;
        // Basic scaling for height if it exceeds max_items
        selectedBox.height += Math.ceil((totalQuantity - largestBox.max_items) / 5) * 2;
      }
    } else {
      // Fallback if no boxes configured
      selectedBox = { length: 15, width: 10, height: 5 };
      if (totalQuantity > 15) {
        selectedBox.height += Math.floor((totalQuantity - 15) / 5) * 2;
      }
    }

    // 2. Centralized Weight Logic:
    // Total Weight = (Total items * weight per decant) + Weight of the selected Box
    const decantWeight = Number(config.decant_weight_g) || 12;
    let totalWeightG = (totalQuantity * decantWeight) + packagingWeight;
    
    // Safety check: Envia requires weight > 0
    if (totalWeightG <= 0) totalWeightG = 150; // Minimum safety fallback

    return [{
      content: "Perfumes / Fragancias",
      amount: 1,
      type: "box",
      dimensions: selectedBox,
      weight: Math.max(0.1, totalWeightG / 1000), // Convert to kg, min 0.1kg (100g)
      insurance: 0,
      declaredValue: 0,
      weightUnit: "KG",
      lengthUnit: "CM",
    }];
  }

  // Heuristic for box size is no longer used, we use global config now.
}
