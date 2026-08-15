import { NextResponse } from "next/server";
import { COOKIE_NAME, getExpectedToken } from "@/lib/session";

export async function POST(req) {
  const accesoConfigurado = process.env.APP_ACCESS_CODE;
  if (!accesoConfigurado) {
    return NextResponse.json({ error: "El servidor no tiene configurado el código de acceso (APP_ACCESS_CODE)." }, { status: 500 });
  }

  const { codigo } = await req.json().catch(() => ({}));
  if (codigo !== accesoConfigurado) {
    return NextResponse.json({ error: "Código incorrecto." }, { status: 401 });
  }

  const token = await getExpectedToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
