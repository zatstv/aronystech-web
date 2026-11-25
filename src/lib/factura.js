import { MAYOREO } from "../data/sitio.js";

/* "$8" → 8. Los precios del catálogo se escriben como texto para mostrarlos. */
export function precioNumero(producto) {
  return Number(String(producto?.precio ?? "").replace(/[^0-9.]/g, "")) || 0;
}

/* Una pieza del catálogo se paga en la página si tiene precio de lista y no
   llega a mayoreo: desde MAYOREO unidades el precio baja y lo cotiza Hugo. */
export function sePagaEnLinea(producto, cantidad) {
  return precioNumero(producto) > 0 && cantidad < MAYOREO;
}

export const dinero = (n) => `$${n.toFixed(2)}`;

/* Número de factura: fecha + cuatro caracteres al azar. No hay base de datos,
   así que no es correlativo; sirve para que cliente y taller hablen de la
   misma factura en el WhatsApp. */
export function numeroFactura(fecha = new Date()) {
  const d = `${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, "0")}${String(fecha.getDate()).padStart(2, "0")}`;
  const azar = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AT-${d}-${azar}`;
}

/* La factura en texto, para que viaje en el mensaje de WhatsApp. */
export function facturaEnTexto(f) {
  return [
    `Hola, ya pagué mi pedido. Factura ${f.numero}`,
    "",
    `• Cliente: ${f.cliente}`,
    ...f.lineas.map((l) => `• ${l}`),
    `• ${f.cantidad} × ${dinero(f.precio)} = ${dinero(f.total)}`,
    `• Pagado con: ${f.metodo}`,
    `• Comprobante: ${f.comprobante}`,
    "",
    "¿Me confirman la fecha de entrega y el envío?",
  ].join("\n");
}
