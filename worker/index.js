/* El servidor del sitio. Casi todo son archivos estáticos (dist/), que
   Cloudflare sirve solo sin pasar por acá. Este código corre únicamente
   para lo que no es un archivo: hoy, /api/chat, el asistente que atiende a
   los clientes y arma el pedido antes de mandarlo a WhatsApp.

   La llave de Gemini NO va en el repositorio. Se guarda en Cloudflare:
     npx wrangler secret put GEMINI_API_KEY
   y para probar en local, en un archivo .dev.vars (ignorado por git):
     GEMINI_API_KEY=...                                                    */

import { instrucciones } from "./instrucciones.js";

const MODELO_POR_DEFECTO = "gemini-2.5-flash";

/* Topes para que nadie use el chat como IA gratis ni gaste la cuota:
   mensajes cortos, conversación acotada y respuestas breves. */
const MAX_MENSAJES = 30;
const MAX_LARGO = 1200;

/* Lo que Gemini tiene que devolver siempre: la respuesta para el cliente y,
   cuando ya hay lo necesario, el pedido resumido para WhatsApp. */
const ESQUEMA = {
  type: "OBJECT",
  properties: {
    respuesta: { type: "STRING" },
    pedido_listo: { type: "BOOLEAN" },
    resumen: { type: "STRING" },
  },
  required: ["respuesta", "pedido_listo"],
};

function json(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

async function chat(request, env) {
  if (request.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!env.GEMINI_API_KEY) return json({ error: "sin_llave" }, 503);

  let mensajes;
  try {
    ({ mensajes } = await request.json());
  } catch {
    return json({ error: "Formato inválido" }, 400);
  }
  if (!Array.isArray(mensajes) || mensajes.length === 0) return json({ error: "Sin mensajes" }, 400);

  const contenidos = mensajes
    .slice(-MAX_MENSAJES)
    .filter((m) => m && typeof m.texto === "string" && m.texto.trim())
    .map((m) => ({
      role: m.de === "asistente" ? "model" : "user",
      parts: [{ text: m.texto.slice(0, MAX_LARGO) }],
    }));
  /* Gemini exige que la conversación empiece por el cliente. El saludo de
     bienvenida lo pone la página, así que se descarta si viene primero. */
  while (contenidos.length && contenidos[0].role !== "user") contenidos.shift();
  if (!contenidos.length) return json({ error: "Sin mensajes" }, 400);

  const modelo = env.GEMINI_MODEL || MODELO_POR_DEFECTO;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: instrucciones() }] },
      contents: contenidos,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
        responseSchema: ESQUEMA,
        /* Sin "pensar": para atender un chat no hace falta, y así responde
           más rápido y gasta menos de la cuota gratis. */
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!r.ok) {
    const detalle = await r.text();
    console.error("Gemini", r.status, detalle.slice(0, 500));
    return json({ error: r.status === 429 ? "ocupado" : "fallo" }, 502);
  }

  const datos = await r.json();
  const texto = datos?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  try {
    const salida = JSON.parse(texto);
    return json({
      respuesta: String(salida.respuesta || "").trim(),
      pedido_listo: Boolean(salida.pedido_listo),
      resumen: salida.pedido_listo ? String(salida.resumen || "").trim() : "",
    });
  } catch {
    /* Si por algo no vino como JSON, al menos se muestra el texto. */
    return json({ respuesta: texto.trim() || "Perdón, no te entendí. ¿Me lo repites?", pedido_listo: false, resumen: "" });
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/chat") return chat(request, env);
    return env.ASSETS.fetch(request);
  },
};
