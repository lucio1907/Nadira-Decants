import { NextRequest, NextResponse } from "next/server";
import { CorreoArgentinoClient } from "@/lib/correo-argentino";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zipCode = searchParams.get("zipCode");
    const province = searchParams.get("province");

    if (!zipCode) {
      return NextResponse.json({ error: "Missing zipCode" }, { status: 400 });
    }

    const envia = new CorreoArgentinoClient();
    const branches = await envia.getBranches(zipCode, province || undefined);

    return NextResponse.json({ branches });
  } catch (error: any) {
    console.error("API Branches Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
