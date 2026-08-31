# Test run: Sites versión 1

Fecha: 2026-08-18  
Estado: versión guardada; no desplegada.

## Resultado

- Site `ABA Data Hub · Staging` creado una sola vez.
- Acceso `custom` verificado con un único usuario owner, sin grupos ni visitantes externos.
- Plugin de Sites activo con `project_id` real.
- 32 pruebas, typecheck, lint, build, Worker y análisis de secretos aprobados.
- `dist/server/index.js` presente y compatible con Worker ESM.
- Fallback SPA y 404 de assets verificados mediante ejecución automatizada.
- Versión guardada: 1.
- Commit fuente: `5931e6e8570f5761d19b542dcec2c5448ef00469`.
- No existe URL activa ni despliegue.

## Empaquetado no destructivo

El helper estándar usa una carpeta temporal y la elimina al finalizar. Para respetar la regla absoluta de no borrado, se creó directamente un archivo tar desde `dist` dentro de `apps/web/verification/`, sin eliminar ni mover archivos.

## Gate pendiente

Confirmación explícita para desplegar la versión 1 como Site privado owner-only.
