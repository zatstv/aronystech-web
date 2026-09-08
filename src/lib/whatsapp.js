import { TEL } from "../data/sitio";

/* Arma el enlace de WhatsApp con el mensaje ya escrito.
   Siempre se pasa por acá para que el número viva en un solo lugar. */
export function linkWhatsApp(mensaje) {
  const base = `https://wa.me/${TEL}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
