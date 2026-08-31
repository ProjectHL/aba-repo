# Test run: hosting preflight v1

Fecha: 2026-08-18  
Estado: local, sin Site creado ni despliegue.

## Acceso manual reparado

- Cuenta autoconfirmada: `aba.e2e.manual.a.20260818@example.com`.
- Organización: A.
- Rol: `clinician`.
- Login real verificado contra `ABA_staging`.
- La contraseña estándar se comunica al usuario, pero no se guarda en este documento ni en archivos del proyecto.

## Gates locales

- 11 archivos de pruebas y 32 casos aprobados.
- TypeScript y ESLint aprobados.
- `@openai/sites-vite-plugin` fijado en `0.2.0`; integración condicional hasta recibir un `project_id` real.
- Build conservado en `apps/web/verification/build-20260818-hosting-preflight-v1/`.
- 12 archivos inspeccionados sin patrón de clave secreta, JWT literal ni `service_role`.
- CSP, HSTS, `nosniff`, referrer policy, permissions policy y `X-Robots-Tag` presentes en `_headers`.
- `/assets/*` devuelve `404.html`; el resto usa fallback SPA a `index.html`.

## Incidente corregido

La instalación creó una caché local dentro del proyecto y ESLint intentó analizar sus archivos internos. Se añadieron exclusiones explícitas para `.corepack-cache/**` y `.npm-cache/**`; no se eliminó ningún archivo. El lint volvió a verde.

## Pendiente

- Crear una única vez el Site privado y persistir su `project_id` real.
- Repetir build con el plugin de Sites activo.
- Verificar que Sites aplica o reemplaza correctamente headers y fallback SPA.
- Guardar una versión y solicitar confirmación inmediata antes del despliegue final.
