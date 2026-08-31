# Test run: preflight local de publicación web

Fecha: 2026-08-18  
Entorno: local, build de staging; sin despliegue.

## Resultado

- 11 archivos de pruebas aprobados; 32 casos verdes.
- TypeScript y ESLint sin errores.
- Build Vite de staging aprobado y conservado en `apps/web/verification/build-20260818-publication-preflight-v2/`.
- Verificador de artefacto: 9 archivos inspeccionados, sin `service_role`, `sb_secret_` ni JWT literal.
- `index.html` declara `noindex, nofollow`, idioma español, referrer restrictivo y título de staging.
- QA visual en `/login`: banner persistente “Entorno de pruebas · Datos exclusivamente sintéticos”, formulario y controles accesibles visibles.

## Limitaciones

- El bundle principal mide 685.49 kB (204.46 kB gzip); code splitting queda como deuda de optimización, no como bloqueo funcional del preflight.
- No se configuraron headers del proveedor, fallback SPA ni URL pública porque el despliegue no está autorizado.
- El E2E remoto sigue pendiente de una identidad Auth sintética y membresías para dos organizaciones.
- El Dashboard de Supabase permanece en pantalla de inicio de sesión; no se creó ninguna cuenta ni se insertaron credenciales.

## Próximo gate

Tras iniciar sesión en el Dashboard, preparar la creación de las identidades sintéticas. La acción final de crear cada usuario requiere confirmación inmediata del usuario.
