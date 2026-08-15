// Sesión simple por código de acceso compartido (sin cuentas de usuario).
// Funciona igual en el servidor y en el middleware (Web Crypto, sin dependencias de Node).

export const COOKIE_NAME = "conecta_session";

async function sha256Hex(texto) {
  const datos = new TextEncoder().encode(texto);
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function getExpectedToken() {
  const secreto = process.env.SESSION_SECRET || process.env.APP_ACCESS_CODE || "";
  return sha256Hex(secreto + "::conecta-session");
}

export async function isAuthorized(cookieValue) {
  if (!cookieValue) return false;
  const esperado = await getExpectedToken();
  return cookieValue === esperado;
}
