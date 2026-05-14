import { createAdminClient } from "./lib/supabase/server";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("ordenes")
    .select("id, direccion_envio, envia_service, envia_carrier")
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) console.error(error);
  console.log(JSON.stringify(data, null, 2));
}
test();
