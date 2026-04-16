import { NextResponse } from "next/server";
import { EnviaClient } from "@/lib/envia";

export async function POST(req: Request) {
  try {
    const { zipCode, province, items } = await respToJSON(req);

    if (!zipCode || !province || !items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const envia = new EnviaClient();
    const quotes = await envia.getQuotes(zipCode, province, items);

    return NextResponse.json({ quotes });
  } catch (error: any) {
    console.error("Envia Quote API Error:", error);
    return NextResponse.json({ error: "Los envíos no están disponibles actualmente" }, { status: 500 });
  }
}

async function respToJSON(req: Request) {
    try {
        return await req.json();
    } catch {
        return {};
    }
}
