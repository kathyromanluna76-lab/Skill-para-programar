import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

export async function GET() {
  try {
    const set = await kvGet("set", {});
    return NextResponse.json({ set });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { set } = await req.json();
    if (!set || typeof set !== "object") {
      return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
    }
    await kvSet("set", set);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
