/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
  dotenv.config();
}

async function checkConfig() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials in .env");
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const { data, error } = await supabase.from("configuracion").select("*");
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Config Data length:", data.length);
    if (data.length > 0) {
      console.log("Keys available:", Object.keys(data[0]));
      console.log("Value of mp_access_token exists:", !!data[0].mp_access_token);
    } else {
      console.log("Config table is empty");
    }
  }
}

checkConfig();
