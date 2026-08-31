# Handoff: E2E staging completo

Fecha: 2026-08-18  
Estado: Frontend + Supabase listos para iniciar la publicación web autorizada.

## Cerrado

- Tres identidades Auth sintéticas autoconfirmadas.
- Dos organizaciones activas con roles `clinician`, `viewer` y `clinician`.
- Login, alta, detalle, `403`, aislamiento RLS, `409`, unicidad por organización y cierre de sesión verificados.
- Fixtures de cliente archivados y trazados por `test_run_id`.
- Sin contraseñas, tokens o datos reales en la evidencia.

## Siguiente spec

`specs/slice-02/web-publication.md` — seleccionar el hosting, crear su configuración dentro de `aba 2`, aplicar fallback SPA y headers, probar el artefacto y solicitar confirmación inmediatamente antes de publicar.

NestJS permanece diferido a `specs/growth/nestjs-api.md`.
