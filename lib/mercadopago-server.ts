import { createAdminClient } from "./supabase/server";

/**
 * Gets the Mercado Pago Access Token from the database ('configuracion' table)
 * or falls back to the MP_ACCESS_TOKEN environment variable.
 */
export async function getMercadoPagoToken(): Promise<string | null> {
  try {
    const supabase = await createAdminClient();
    
    // Try to get from database
    const { data: configs, error } = await supabase
      .from("configuracion")
      .select("mp_access_token")
      .limit(1);

    if (error) {
      console.error("Supabase Error fetching config:", error.message, error.details, error.hint);
    }
    
    console.log(`[Config Check] Rows found: ${configs?.length || 0}`);
    if (configs && configs.length > 0) {
      console.log(`[Config Check] First row token exists: ${!!configs[0].mp_access_token}`);
    }

    const config = configs?.[0];

    if (!error && config?.mp_access_token) {
      return config.mp_access_token;
    }

    // Fallback to environment variable
    const envToken = process.env.MP_ACCESS_TOKEN;
    if (envToken) {
      return envToken;
    }

    console.error("Mercado Pago Access Token not found in database or environment variables.");
    return null;
  } catch (err) {
    console.error("Error fetching Mercado Pago token:", err);
    // Final fallback to env var if database check fails catastrophically
    return process.env.MP_ACCESS_TOKEN || null;
  }
}
