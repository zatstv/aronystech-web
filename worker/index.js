/* El servidor del sitio. Casi todo son archivos estáticos (dist/), que
   Cloudflare sirve solo sin pasar por acá. Este código corre únicamente
   para lo que no es un archivo: hoy, /api/chat, el asistente que atiende a
   los clientes y arma el pedido antes de mandarlo a WhatsApp.

   La IA es Claude Haiku. La llave NO va en el repositorio. Se guarda en
   Cloudflare:
     npx wrangler secret put ANTHROPIC_API_KEY
   y para probar en local, en un archivo .dev.vars (ignorado por git):
     ANTHROPIC_API_KEY=...                                                 */

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import { instrucciones } from "./instrucciones.js";
import { MAYOREO, PRODUCTOS } from "../src/data/sitio.js";

/* Se puede cambiar sin tocar código con la variable CLAUDE_MODEL. */
const MODELO_POR_DEFECTO = "claude-haiku-5-5";

/* Topes para que nadie use el chat como IA gratis ni gaste de más:
   mensajes cortos y conversación acotada. */
const MAX_MENSAJES = 30;
const MAX_LARGO = 1200;

/* Lo que Claude tiene que devolver siempre: la respuesta para el cliente y,
   cuando ya hay lo necesario, el pedido resumido para WhatsApp. Si el pedido
   es una pieza del catálogo, también cuál es, para que la página abra el
   pago con eso ya llenado. La API garantiza que la salida cumple este formato. */
const SALIDA = z.object({
  respuesta: z.string(),
  pedido_listo: z.boolean(),
  resumen: z.string(),
  producto_id: z.string(),
  cantidad: z.number(),
  color: z.string(),
  texto: z.string(),
});

/* Solo se ofrece pagar en la página si es una pieza real del catálogo, con
   cantidad válida y por debajo de mayoreo. Si no, el pedido va a WhatsApp. */
function pagoDelCatalogo({ pedido_listo, producto_id, cantidad, color, texto }) {
  const producto = PRODUCTOS.find((p) => p.id === producto_id);
  const n = Math.round(cantidad);
  if (!pedido_listo || !producto || !(n >= 1 && n < MAYOREO)) return null;
  return { producto_id, cantidad: n, color: color.trim(), texto: producto.textoLibre ? texto.trim().slice(0, 10) : "" };
}

/* Las instrucciones no cambian entre pedidos: se arman una vez y se marcan
   para la caché de Anthropic, así cada mensaje después del primero las lee
   a una décima parte del precio. */
const SISTEMA = [{ type: "text", text: instrucciones(), cache_control: { type: "ephemeral" } }];

function json(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/* La conversación que manda la página, en el formato de la API: empieza
   por el cliente y alterna. Si un mensaje quedó sin respuesta (porque falló
   la red, por ejemplo), dos seguidos del cliente se juntan en uno. */
function armarMensajes(mensajes) {
  const salida = [];
  for (const m of mensajes.slice(-MAX_MENSAJES)) {
    if (!m || typeof m.texto !== "string" || !m.texto.trim()) continue;
    const role = m.de === "asistente" ? "assistant" : "user";
    const texto = m.texto.slice(0, MAX_LARGO);
    if (!salida.length && role !== "user") continue; // el saludo de bienvenida lo pone la página
    const ultimo = salida[salida.length - 1];
    if (ultimo && ultimo.role === role) ultimo.content += `\n\n${texto}`;
    else salida.push({ role, content: texto });
  }
  return salida;
}

async function chat(request, env) {
  if (request.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!env.ANTHROPIC_API_KEY) return json({ error: "sin_llave" }, 503);

  let mensajes;
  try {
    ({ mensajes } = await request.json());
  } catch {
    return json({ error: "Formato inválido" }, 400);
  }
  if (!Array.isArray(mensajes)) return json({ error: "Sin mensajes" }, 400);
  const conversacion = armarMensajes(mensajes);
  if (!conversacion.length || conversacion.at(-1).role !== "user") return json({ error: "Sin mensajes" }, 400);

  /* Si tarda más de 20 s se corta y se reintenta una vez: mejor avisar al
     cliente y mandarlo a WhatsApp que dejarlo esperando. */
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, timeout: 20_000, maxRetries: 1 });

  try {
    const r = await client.messages.parse({
      model: env.CLAUDE_MODEL || MODELO_POR_DEFECTO,
      max_tokens: 4000,
      system: SISTEMA,
      messages: conversacion,
      /* Esfuerzo bajo: para atender un chat alcanza, y responde más rápido. */
      output_config: { effort: "low", format: zodOutputFormat(SALIDA) },
    });

    if (r.stop_reason === "refusal" || !r.parsed_output) {
      console.error("Sin respuesta usable", r.stop_reason, JSON.stringify(r.stop_details ?? null));
      return json({
        respuesta: "Eso mejor lo ve Hugo directamente. Escríbele por WhatsApp y te atiende ahí.",
        pedido_listo: false,
        resumen: "",
      });
    }

    const { respuesta, pedido_listo, resumen } = r.parsed_output;
    return json({
      respuesta: respuesta.trim(),
      pedido_listo,
      resumen: pedido_listo ? resumen.trim() : "",
      pago: pagoDelCatalogo(r.parsed_output),
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return json({ error: "ocupado" }, 502);
    if (error instanceof Anthropic.APIConnectionTimeoutError) return json({ error: "ocupado" }, 502);
    if (error instanceof Anthropic.APIError) {
      console.error("Claude", error.status, error.message);
      return json({ error: error.status === 529 ? "ocupado" : "fallo" }, 502);
    }
    console.error("Claude", error);
    return json({ error: "fallo" }, 502);
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/chat") return chat(request, env);
    return env.ASSETS.fetch(request);
  },
};
