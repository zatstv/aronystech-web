# De dónde salieron estos skills

No son nuestros. Son una copia de **ui-ux-pro-max**, un plugin de Claude Code
con guías de UI/UX (paletas, tipografías, reglas de accesibilidad, presets de
GSAP, estilos por stack).

- Repo: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Versión: 2.13.0 · commit `de5f12b` · copiado el 2026-09-20
- Licencia: MIT (está en `LICENSE`, al lado de este archivo)

Se copió la carpeta `.claude/skills/` del repo y nada más. A propósito **no**
se trajo su `stack/`, que incluye un `settings.json` con permisos amplios
(`Read(//home/**)`, `enableAllProjectMcpServers`) pensados para proyectos
nuevos, no para este.

## Para actualizar

No hay que editar estos archivos a mano: se pisan enteros con la versión nueva.

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uipro
rm -rf .claude/skills && mkdir -p .claude/skills
cp -R /tmp/uipro/.claude/skills/. .claude/skills/
cp /tmp/uipro/LICENSE .claude/skills/LICENSE
```

(y volver a escribir este archivo con la versión y el commit nuevos)

## Ojo con una cosa

`design/scripts/logo/generate.py` genera logos llamando a APIs de pago
(muapi.ai, Gemini, AtlasCloud). Solo funciona si existen las variables de
entorno `MUAPI_API_KEY`, `GEMINI_API_KEY` o `ATLASCLOUD_API_KEY`. Sin
ellas no hace nada y no sale a la red. Tenemos una llave de Gemini guardada en
`~/.config/aronystech/gemini.key`: si algún día se exporta como variable de
entorno, ese script podría gastarla sin avisar.

El resto de los scripts son Python de librería estándar y no salen a internet.
