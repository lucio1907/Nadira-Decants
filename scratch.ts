import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("ordenes")
    .select("id, status, created_at, mp_payment_id")
    .order("created_at", { ascending: false })
    .limit(10);
    
  if (error) {
    console.error("Error fetching orders:", error);
  } else {
    console.log("Recent orders:");
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
