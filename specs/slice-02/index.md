# Slice 02: índice de ejecución

Estado: P-01 a P-06 aprobadas. Supabase staging y tipos completados el 2026-08-18; siguiente unidad: integración frontend.

| Orden | Spec | Entregable | Estado |
| ---: | --- | --- | --- |
| 1 | `supabase.md` | Auth, esquema, grants, RLS y pruebas de aislamiento | completada: migraciones, RLS, RPC, advisors y tipos |
| 2 | `frontend.md` | Login y Clientes conectados directamente a Supabase | núcleo local completado; pendiente E2E Auth/Data API en staging |
| 3 | `web-publication.md` | staging sintético y smoke test | spec lista; publicación requiere cinco gates y autorización |
| crecimiento | `../growth/nestjs-api.md` | API NestJS cuando la complejidad lo justifique | diferida; fuera de Slice 02 |

`backend.md` se conserva como registro histórico de la arquitectura evaluada y queda supersedida para Slice 02 por `../growth/nestjs-api.md`.

## Regla de avance

Cada spec pasa por: aprobación → prueba roja → implementación mínima → refactor → verificación → evidencia. Ningún paso permite datos reales, borrado o acceso fuera del workspace autorizado.
