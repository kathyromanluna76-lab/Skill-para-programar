// Cliente de Supabase para uso exclusivo del servidor.
// Usa la llave de servicio (SUPABASE_SERVICE_ROLE_KEY), que nunca debe llegar al navegador:
// esa llave se salta las reglas de acceso (RLS), así que solo vive acá.

import { createClient } from "@supabase/supabase-js";

let cliente = null;

export function supabaseAdmin() {
  if (cliente) return cliente;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Falta configurar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el servidor.");
  }
  cliente = createClient(url, key, { auth: { persistSession: false } });
  return cliente;
}
