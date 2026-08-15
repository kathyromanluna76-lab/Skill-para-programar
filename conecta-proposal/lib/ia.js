// Redacción con IA. Se ejecuta solo en el servidor: aquí es el único lugar
// donde se usa la llave de acceso a la API de Claude (ANTHROPIC_API_KEY).

const RULES = `Reglas obligatorias:
- Español profesional de Perú, tono ejecutivo y consultivo, claro y orientado a resultados.
- PROHIBIDO inventar cifras, porcentajes, ahorros, plazos, nombres o compromisos que no estén en los datos entregados.
- Nunca uses el guion largo ni rayas tipográficas. Usa comas, puntos, dos puntos o punto y coma.
- Nada de frases vacías tipo transformador, disruptivo, sin duda, en un mundo cada vez más.
- No uses encabezados ni viñetas salvo que se pida. Devuelve solo el texto pedido, sin preámbulo.`;

function ctx(p) {
  return `Cliente: ${p.cli?.razon || "no indicado"} (${p.cli?.sector || "sector no indicado"})
Contacto: ${p.cli?.contacto || ""} ${p.cli?.cargo ? "(" + p.cli.cargo + ")" : ""}
Decisor y su preocupación: ${p.cli?.decisor || "no indicado"} / ${p.cli?.preocupacion || "no indicado"}
Proyecto: ${p.pro?.proyecto || ""}
Tipo de servicio: ${p.ser?.tipo || ""}
Notas de la reunión: ${p.pro?.notas || "sin notas"}
Problema en una frase: ${p.pro?.problema || ""}
Síntomas observados: ${p.pro?.sintomas || ""}
Impacto en el negocio: ${p.pro?.impacto || ""}
Objetivo declarado: ${p.pro?.objetivo || ""}
Procesos incluidos: ${p.ser?.incluye || ""}
Procesos excluidos: ${p.ser?.excluye || ""}
Entregables: ${p.ser?.entregables || ""}
Fases: ${(p.fas || []).map(f => `${f.n} (${f.s} semanas): ${(f.a || "").replace(/\n/g, "; ")}`).join(" | ") || "no definidas"}`;
}

const PROMPTS = {
  tesis:"Redacta la idea que sostiene la propuesta: una o dos oraciones que reencuadren el problema del cliente y expliquen por qué este trabajo va antes que la inversión en tecnología, infraestructura o personal. Debe poder decirse en voz alta frente a un directorio. Sin cifras. Devuelve solo la frase, sin comillas.",
  preguntas:"Redacta entre 5 y 7 preguntas concretas que este proyecto responderá, escritas en primera persona del plural desde la voz del equipo del cliente, por ejemplo: ¿Qué tan confiable es nuestro forecast? Cada pregunta debe apuntar a una decisión real del negocio. Una por línea, cada una iniciando con guion medio.",
  contexto:"Redacta la sección Contexto y situación actual, de 2 párrafos como máximo. Describe la situación de la empresa y el entorno operativo que motiva el encargo, usando únicamente lo que aparece en los datos.",
  problema:"Redacta la sección Problema empresarial identificado. Un párrafo breve que separe síntomas de problema de fondo, y luego una lista de 3 a 5 viñetas con los efectos concretos en la operación o en el negocio. Devuelve las viñetas con guion medio al inicio de cada línea.",
  objetivo:"Redacta la sección Objetivo de la consultoría. Un párrafo de 3 líneas con el objetivo general, y luego 3 o 4 objetivos específicos como viñetas con guion medio al inicio.",
  alcance:"Redacta la sección Alcance del servicio. Un párrafo corto de encuadre y luego dos listas con viñetas de guion medio: primero lo que el servicio incluye, después una línea que diga 'No incluye:' seguida de las exclusiones. Usa solo los procesos indicados.",
  metodologia:"Redacta la sección Metodología de trabajo en 2 párrafos, adaptando la metodología base al caso concreto del cliente. Menciona el trabajo de campo, el uso de información del cliente y cómo se valida con el equipo.",
  beneficios:"Redacta la sección Beneficios esperados como 5 o 6 viñetas con guion medio al inicio. Cada beneficio debe conectarse con un impacto de negocio como nivel de servicio, productividad, costos, inventarios, capital de trabajo, confiabilidad de información, trazabilidad o capacidad de decisión. Sin cifras.",
  cierre:"Redacta el Cierre comercial en un párrafo de 4 a 6 líneas. Debe transmitir experiencia real, seguridad y cercanía, invitar a conversar sobre la propuesta y cerrar con una frase que hable del compromiso con resultados. Sin cifras y sin promesas cuantificadas."
};

export const SECCIONES_VALIDAS = Object.keys(PROMPTS);

export async function generarSeccion(key, propuesta, firma, libBase) {
  if (!SECCIONES_VALIDAS.includes(key)) {
    throw new Error("Sección desconocida: " + key);
  }
  let extra = "";
  if (key === "metodologia" && libBase) extra = `\nMetodología base de la firma para este servicio (adáptala, no la copies literal): ${libBase.metodologia}`;
  if (key === "beneficios" && libBase) extra = `\nBeneficios típicos de este servicio como referencia: ${libBase.beneficios.replace(/\n/g, "; ")}`;
  if (key === "tesis" && libBase) extra = `\nIdea base de la firma para este servicio (adáptala al cliente, no la copies literal): ${libBase.tesis}`;
  if (key === "preguntas" && libBase) extra = `\nPreguntas típicas de este servicio como referencia: ${libBase.preguntas.replace(/\n/g, " ")}`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Falta configurar ANTHROPIC_API_KEY en el servidor.");

  const body = {
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Eres consultor senior de ${firma || "la firma"}, firma de Supply Chain y operaciones.\n${RULES}\n\nDatos del encargo:\n${ctx(propuesta)}${extra}\n\nTarea: ${PROMPTS[key]}`
    }]
  };

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  if (!r.ok) {
    const detalle = await r.text().catch(() => "");
    throw new Error(`La API de Claude respondió ${r.status}. ${detalle.slice(0, 300)}`);
  }

  const d = await r.json();
  return (d.content || []).filter(x => x.type === "text").map(x => x.text).join("\n").trim();
}
