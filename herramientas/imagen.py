#!/usr/bin/env python3
"""
Edita o genera imágenes con Gemini (Nano Banana).

La llave NO va en este archivo. Se lee de la variable de entorno GEMINI_API_KEY
o del archivo ~/.config/aronystech/gemini.key (que no se sube a ningún lado).

Uso:
    python3 herramientas/imagen.py salida.jpg "instrucción" [foto-base.jpg ...]

Ejemplos:
    # editar una foto real
    python3 herramientas/imagen.py img/soporte-con-celular.jpg \
        "Poné un celular apoyado en el soporte" img/soportes-celular.jpg

    # generar desde cero (para fondos o texturas, NO para inventar productos)
    python3 herramientas/imagen.py fondo.jpg "Superficie de madera clara vista desde arriba"
"""
import base64, json, mimetypes, os, pathlib, sys, urllib.request

MODELO = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")
URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent"


def llave():
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k.strip()
    f = pathlib.Path.home() / ".config" / "aronystech" / "gemini.key"
    if f.exists():
        return f.read_text().strip()
    sys.exit("No hay llave. Poné GEMINI_API_KEY o creá ~/.config/aronystech/gemini.key")


def parte_imagen(ruta):
    tipo = mimetypes.guess_type(ruta)[0] or "image/jpeg"
    datos = base64.b64encode(pathlib.Path(ruta).read_bytes()).decode()
    return {"inline_data": {"mime_type": tipo, "data": datos}}


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    salida, instruccion, bases = sys.argv[1], sys.argv[2], sys.argv[3:]

    partes = [parte_imagen(b) for b in bases] + [{"text": instruccion}]
    cuerpo = {
        "contents": [{"parts": partes}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {"aspectRatio": os.environ.get("GEMINI_ASPECT", "4:3")},
        },
    }

    req = urllib.request.Request(
        URL % MODELO,
        data=json.dumps(cuerpo).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": llave()},
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        res = json.load(r)

    if "candidates" not in res:
        sys.exit("Respuesta sin imagen:\n" + json.dumps(res, indent=2, ensure_ascii=False)[:1500])

    guardadas = 0
    for parte in res["candidates"][0]["content"]["parts"]:
        blob = parte.get("inlineData") or parte.get("inline_data")
        if blob:
            pathlib.Path(salida).write_bytes(base64.b64decode(blob["data"]))
            print("Guardada:", salida)
            guardadas += 1
        elif parte.get("text"):
            print("Nota del modelo:", parte["text"].strip()[:400])
    if not guardadas:
        sys.exit("El modelo no devolvió imagen.")


if __name__ == "__main__":
    main()
