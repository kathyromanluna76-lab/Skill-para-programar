import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

export async function GET() {
  try {
    const props = await kvGet("props", []);
    return NextResponse.json({ props });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { props } = await req.json();
    if (!Array.isArray(props)) {
      return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
    }
    await kvSet("props", props);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
