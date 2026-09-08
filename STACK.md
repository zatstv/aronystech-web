# Decisión técnica — dónde vive la página y con qué base de datos

Investigado el 2026-09-07, a partir de dos cosas que pediste:
"algo con Docker en vez de Vercel" y "una base de datos diferente".

---

## 0. La advertencia honesta, y por qué igual vale la pena

Para un catálogo de impresiones 3D con 2 administradores, Docker + base de datos es
**más máquina de la que el trabajo necesita**. Un HTML en Netlify haría lo mismo, gratis
y sin nada que mantener.

Dicho eso: la página va a crecer, querés aprender esto, y el costo real es ~$5 al mes.
Es una razón perfectamente válida. Así que abajo está el camino bien hecho, no la versión
de juguete.

Lo único que sí te pido es que separes las dos cosas: **el catálogo público debe seguir
siendo archivos estáticos** (rapidísimo, no se cae). Docker y la base de datos son para
**la zona de admin**, que es la parte que de verdad las necesita.

---

## 1. Qué es Docker, en cristiano

Vercel/Netlify son "subí tu código y nosotros vemos cómo correrlo". Cómodo, pero jugás
con sus reglas, sus precios y sus límites.

Docker es lo contrario: vos armás una **caja** que ya trae adentro todo lo que tu app
necesita para funcionar (el programa, la versión exacta de cada cosa, la configuración).
Esa caja corre igual en tu compu, en un servidor de $5 o en uno de $500. La receta para
armarla es un archivo de texto que se llama **Dockerfile** — eso es lo que escuchaste.

Lo que ganás:
- **No dependés de nadie.** Si mañana Vercel sube precios, movés la caja a otro lado.
- **Corre igual en todos lados.** Se acabó el "en mi compu sí funciona".
- **Precio fijo y barato.** Un servidor de ~$5/mes aguanta este proyecto y diez más.

Lo que perdés:
- Vos sos el que actualiza el servidor, revisa que no se caiga y hace respaldos.
- Si se rompe un domingo, no hay soporte: sos vos.

**Ya tenés Docker instalado** en esta máquina (versión 29.7.2), así que podés practicar
local antes de pagar un servidor.

---

## 2. "Docker suelto" vs. un panel encima

Docker pelado se maneja por comandos. Existen paneles que le ponen una interfaz web y te
dan la experiencia de Vercel pero en **tu** servidor: conectás GitHub, hacés push, se
despliega solo, con HTTPS automático.

| Opción | Qué es | Para vos |
|---|---|---|
| **Coolify** ⭐ | El más parecido a Vercel. Interfaz web, despliegue automático desde GitHub, HTTPS solo, bases de datos con un click. Apache 2.0, la comunidad más grande. | **Recomendado.** Es exactamente "Vercel pero mío". |
| **Dokploy** | Más nuevo, más liviano, interfaz más linda. Ya pasó a CapRover en popularidad. Todavía es pre-1.0. | Buena opción si querés lo más nuevo y no te asusta que cambien cosas. |
| **CapRover** | El veterano (desde 2017). Usa Docker Swarm, así que los archivos `docker-compose` funcionan solo a medias. | No. Es el más viejo y el más limitado de los tres. |
| **Kamal** | Sin interfaz, todo por comandos. El de la gente de Ruby on Rails. | No para empezar. |
| **Docker Compose a mano** | Un archivo de texto, `docker compose up`, listo. | Sirve perfecto para practicar local. |

**Camino sugerido:** practicás local con `docker compose`, y cuando quieras publicarlo
ponés **Coolify** en un servidor.

### Dónde poner el servidor

| Proveedor | Precio | Comentario |
|---|---|---|
| **Hetzner CX22** (2 vCPU, 4 GB) | ~$4.90/mes | La mejor relación precio/potencia que hay. 20 TB de tráfico incluido. |
| DigitalOcean equivalente | ~$24/mes | Lo mismo por 5× el precio. Solo si querés servidores en América. |

Coolify se come 300–400 MB de RAM solo por existir, así que **4 GB es el mínimo cómodo**.
El de 2 GB queda muy justo.

> ⚠️ **Ojo con tu VPS actual.** El de netPika (el que abrís con `vps`) es **Windows por
> RDP**. Docker en Windows Server es un dolor de cabeza y no es para lo que sirve ese
> servidor. Para esto se necesita una máquina Linux aparte.

---

## 3. La base de datos

Preguntaste por "algo diferente". Esto es lo que hay hoy:

| Opción | Qué la hace diferente | ¿Sirve acá? |
|---|---|---|
| **PocketBase** ⭐ | Un **solo archivo ejecutable** que ya trae adentro la base de datos (SQLite), el sistema de usuarios y contraseñas, la subida de archivos, y **un panel de administración terminado**. Lo corrés y ya tenés backend. | **Sí. Es la respuesta.** Ver abajo por qué. |
| **Turso / libSQL** | SQLite copiado a servidores por todo el mundo, para que cargue rapidísimo en cualquier país. | Sobra. Tus clientes están todos en Panamá. |
| **SurrealDB** | Una sola base que funciona como tabla, como documentos y como grafo al mismo tiempo. Muy moderna. | Interesantísima, pero es aprender un lenguaje de consultas nuevo para guardar 15 productos. |
| **Convex** | La lógica del backend se escribe en TypeScript y se ejecuta dentro de la base, que además avisa sola cuando algo cambia. | Preciosa, pero es para apps con datos en vivo. Un catálogo no cambia solo. |
| **Postgres** (Supabase, Neon) | El estándar serio de la industria. | Correctísimo, pero es lo "normal" y trae más piezas que mantener. |
| **MongoDB** | Ya lo usás en OpenStock. | Funciona, pero no es "diferente" para vos. |

### Por qué PocketBase

Porque **resuelve tres cosas de un solo golpe**, y una de ellas es la que ya pediste antes:

1. Es una base de datos **distinta a todo lo que has usado** (SQLite embebido en un binario de Go).
2. Trae **usuarios y login ya hechos**. Tu zona de admin para 2 personas se vuelve
   "crear 2 usuarios en el panel". No hay que programar nada de login.
3. Trae un **panel de administración ya construido** donde se editan productos, precios y
   fotos desde el navegador o el teléfono. Es la sección 9b del PROYECTO.md, gratis.
4. Va en un contenedor Docker de unos 30 MB. Ridículamente liviano.

**Lo malo, dicho de frente:** PocketBase todavía no llega a la versión 1.0. Sus propios
autores dicen que no lo recomiendan para sistemas críticos, porque entre versiones pueden
cambiar cosas y hay que leer el changelog al actualizar. Para un catálogo de una PYME eso
es un riesgo aceptable — lo peor que pasa es que un día haya que migrar. Para el sistema
de facturación de un banco, no.

---

## 4. La arquitectura propuesta

```
   VISITANTE                          JUAN Y VOS
       │                                   │
       ▼                                   ▼
 ┌─────────────┐                  ┌──────────────────┐
 │  CATÁLOGO   │                  │  /admin  (login) │
 │   HTML/CSS  │                  │   panel PocketBase│
 │  estático   │                  └────────┬─────────┘
 └──────┬──────┘                           │ edita
        │  lee los productos               ▼
        └────────────────────────► ┌──────────────────┐
                                   │   PocketBase     │
                                   │  (Docker)        │
                                   │  productos,      │
                                   │  precios, fotos  │
                                   └──────────────────┘
        │
        ▼
   Botón WhatsApp con el pedido pre-escrito
```

- **El catálogo público es estático.** Carga instantáneo y no se cae aunque el servidor
  esté apagado. Nadie que entre a ver llaveros toca la base de datos.
- **PocketBase corre en Docker** y guarda productos, precios en dólares, colores y fotos.
- **La zona de admin es el panel de PocketBase**, protegido con su propio login. Dos
  usuarios: vos y Juan.
- Cuando cambiás un precio en el panel, el catálogo se vuelve a generar y se publica.

Esto reemplaza los tres niveles de la sección 9b del PROYECTO.md: PocketBase ES el
Nivel 2 y el Nivel 3 juntos, sin trámites de Cloudflare ni cuentas de GitHub.

---

## 5. El plan, por etapas

| Etapa | Qué se hace | Costo |
|---|---|---|
| **1. Practicar** | Levantar PocketBase local con `docker compose`, meterle 3 productos de prueba, ver el panel. Todo en tu compu. | $0 |
| **2. Catálogo** | Construir la página estática que lee los productos de PocketBase. | $0 |
| **3. Publicar** | Servidor Hetzner + Coolify. Dominio apuntado. HTTPS automático. | ~$5/mes + dominio |
| **4. Crecer** | Si algún día se necesita carrito y pagos, ya está toda la base montada. | — |

**Empezá por la etapa 1.** Ya tenés Docker instalado; no hay que pagar ni registrar nada
para ver esto funcionando esta misma semana.

---

## 6. Decisiones que quedan tomadas

- **Moneda: dólares (USD).** Todos los precios del catálogo en $.
- **Admin: 2 personas** al inicio (vos y Juan), con capacidad de agregar más después.
- Contenedores con **Docker**, panel **Coolify** cuando se publique.
- Base de datos **PocketBase**.
- Catálogo público **estático**; la base de datos solo la toca el admin.

---

## Fuentes

- Comparativa de PaaS auto-hospedados: [wz-it.com](https://wz-it.com/en/blog/self-hosted-paas-comparison-coolify-dokploy-caprover/), [MassiveGRID](https://massivegrid.com/blog/dokploy-vs-coolify-vs-caprover/)
- PocketBase — documentación y estado: [pocketbase.io/docs](https://pocketbase.io/docs/), [Going to production](https://pocketbase.io/docs/going-to-production/), [Better Stack](https://betterstack.com/community/guides/database-platforms/pocketbase-backend/)
- Alternativas de base de datos: [Encore](https://encore.dev/articles/supabase-alternatives), [Puter dev blog](https://developer.puter.com/blog/pocketbase-alternatives/)
- Precios de servidores: [Better Stack — Hetzner vs DigitalOcean](https://betterstack.com/community/guides/web-servers/digitalocean-vs-hetzner/), [Mejores VPS para Coolify](https://nextgrowth.ai/best-vps-for-coolify/)
