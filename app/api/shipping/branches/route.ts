import { NextRequest, NextResponse } from "next/server";
import { EnviaClient } from "@/lib/envia";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zipCode = searchParams.get("zipCode");
    const carrier = searchParams.get("carrier") || "correoArgentino";

    if (!zipCode) {
      return NextResponse.json({ error: "Missing zipCode" }, { status: 400 });
    }

    const envia = new EnviaClient();
    // We'll implement getBranches in EnviaClient
    const branches = await envia.getBranches(zipCode, carrier);

    return NextResponse.json({ branches });
  } catch (error: any) {
    console.error("API Branches Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
