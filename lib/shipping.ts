/**
 * Estrategia de cálculo de envío para Correo Argentino
 * Zonas:
 * - Local: Baradero (CP 2942)
 * - Regional: PBA, CABA, Santa Fe
 * - Nacional: Resto del país
 */

const SHIPPING_RATES = {
  local: 2500,
  regional: 3800,
  nacional: 4900,
};

const FREE_SHIPPING_THRESHOLD = 60000;

export const calculateShipping = (
  zipCode: string,
  province: string,
  subtotal: number
): number => {
  // 1. Validar envío gratis
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  if (!zipCode) return 0;

  // 2. Lógica de zonas
  const cp = zipCode.trim();

  // Local
  if (cp === "2942") {
    return SHIPPING_RATES.local;
  }

  // Regional (Simplificado por nombre de provincia)
  const regionalProvinces = [
    "buenos aires",
    "pcia buenos aires",
    "provincia de buenos aires",
    "caba",
    "ciudad autónoma de buenos aires",
    "santa fe",
  ];

  const normalizedProvince = province.toLowerCase().trim();

  if (regionalProvinces.some((p) => normalizedProvince.includes(p))) {
    return SHIPPING_RATES.regional;
  }

  // Nacional
  return SHIPPING_RATES.nacional;
};
