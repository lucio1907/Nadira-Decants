import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zipCode = searchParams.get("zipCode");
    const province = searchParams.get("province");

    if (!zipCode) {
      return NextResponse.json({ error: "Missing zipCode" }, { status: 400 });
    }

    const zipNum = parseInt(zipCode, 10);
    const isCABA = province?.toUpperCase() === "CABA" || (zipNum >= 1000 && zipNum <= 1499);

    if (isCABA) {
        // CABA Special Case: Fetch Barrios from Georef
        try {
            const response = await fetch("https://apis.datos.gob.ar/georef/api/localidades?provincia=02&max=100");
            if (response.ok) {
                const data = await response.json();
                const places = data.localidades
                    .map((l: any) => ({
                        "place name": l.nombre,
                        "state": "Ciudad Autónoma de Buenos Aires"
                    }))
                    .sort((a: any, b: any) => a["place name"].localeCompare(b["place name"]));
                
                return NextResponse.json({ places });
            } else {
                console.error("Georef API error:", response.status, await response.text());
                // Fallback to a minimal list if Georef is down
                return NextResponse.json({ 
                    places: [
                        { "place name": "Ciudad Autónoma de Buenos Aires", "state": "Ciudad Autónoma de Buenos Aires" },
                        { "place name": "Palermo", "state": "Ciudad Autónoma de Buenos Aires" },
                        { "place name": "Belgrano", "state": "Ciudad Autónoma de Buenos Aires" },
                        { "place name": "Recoleta", "state": "Ciudad Autónoma de Buenos Aires" }
                    ]
                });
            }
        } catch (err) {
            console.error("Georef Fetch Exception:", err);
        }
    }

    const response = await fetch(`https://api.zippopotam.us/ar/${zipCode}`);
    if (!response.ok) {
        if (response.status === 404) {
            return NextResponse.json({ places: [] });
        }
      throw new Error("Error fetching from Zippopotam");
    }

    const data = await response.json();
    let places = data.places || [];

    // Map province names to Zippopotam state abbreviations/names if possible
    // Province names in checkout/page.tsx: "Buenos Aires", "CABA", "Catamarca", etc.
    // Zippopotam for AR returns "state": "BUENOS AIRES" etc.

    if (province) {
        const provinceUpper = province.toUpperCase();
        places = places.filter((p: any) => {
            const pState = p.state.toUpperCase();
            if (provinceUpper === "CABA") {
                return pState.includes("CIUDAD AUTONOMA") || pState === "C" || pState === "DF";
            }
            if (provinceUpper === "BUENOS AIRES") {
                return pState === "BUENOS AIRES" || pState === "B";
            }
            return pState.includes(provinceUpper);
        });
    }

    return NextResponse.json({ places });
  } catch (error: any) {
    console.error("API Location Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
