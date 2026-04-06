"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginAdmin(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
