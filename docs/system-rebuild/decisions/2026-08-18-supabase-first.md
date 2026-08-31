# ADR: Supabase-first y NestJS diferido

Fecha: 2026-08-18  
Estado: aprobada por el usuario.

## Decisión

Slice 02 se implementa con React → Supabase Auth/Data API/RPC → PostgreSQL/RLS. NestJS queda documentado como arquitectura de crecimiento en `specs/growth/nestjs-api.md`.

## Razón

- Reduce infraestructura y tiempo de entrega del clon funcional.
- Mantiene autorización en RLS y operaciones atómicas en RPC.
- El `ClientsRepository` evita acoplar componentes y permite añadir NestJS después.
- No existe todavía evidencia de múltiples consumidores o integraciones que justifiquen una API propia.

## Consecuencias

- Slice 02 no crea `apps/api`, OpenAPI, runtime Node ni CORS de API propia.
- Frontend consume Supabase mediante clave publicable.
- RLS, grants y validación de respuestas pasan a ser controles críticos.
- Informes o integraciones futuras pueden usar Edge Functions o activar la spec NestJS según evidencia.

## Límites

La decisión no autoriza conexión remota, publicación, secretos, datos reales ni borrado.

