// Guarda y lee bloques de datos en la tabla kv_store de Supabase.
// La tabla tiene dos filas fijas: "props" (tus propuestas) y "set" (tus ajustes de firma).

import { supabaseAdmin } from "./supabaseAdmin";

export async function kvGet(key, valorPorDefecto) {
  const db = supabaseAdmin();
  const { data, error } = await db.from("kv_store").select("value").eq("key", key).maybeSingle();
  if (error) throw new Error("No se pudo leer de Supabase: " + error.message);
  return data ? data.value : valorPorDefecto;
}

export async function kvSet(key, value) {
  const db = supabaseAdmin();
  const { error } = await db.from("kv_store").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error("No se pudo guardar en Supabase: " + error.message);
}
