import { createAdminClient } from "../lib/supabase/server";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("ordenes")
    .select("id, cliente_telefono, payer_email")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) console.error(error);
  console.log(JSON.stringify(data, null, 2));
}
test();
