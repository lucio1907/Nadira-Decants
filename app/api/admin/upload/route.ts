import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Límite de seguridad en el servidor: 2MB
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "El archivo excede el límite de 2MB" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock mode or not configured
      console.log("Mock upload requested:", file.name);
      return NextResponse.json({ 
        url: `https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800` 
      });
    }

    const supabase = await createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${Date.now()}-${file.name.replace(/\\s+/g, "-")}`;
    
    const { data, error } = await supabase.storage
      .from("productos")
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload error:", error);
      return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("productos")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
