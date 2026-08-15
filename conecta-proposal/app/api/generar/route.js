import { NextResponse } from "next/server";
import { generarSeccion } from "@/lib/ia";
import { LIB } from "@/lib/catalog";

export async function POST(req) {
  const { seccion, propuesta, firma } = await req.json().catch(() => ({}));
  if (!seccion || !propuesta) {
    return NextResponse.json({ error: "Falta la sección o la propuesta." }, { status: 400 });
  }
  try {
    const base = LIB[propuesta?.ser?.tipo];
    const texto = await generarSeccion(seccion, propuesta, firma, base);
    return NextResponse.json({ texto });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 502 });
  }
}
