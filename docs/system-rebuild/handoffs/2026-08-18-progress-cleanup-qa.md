# Handoff — QA de consolidación

Fecha: 2026-08-18

## Estado entregado

- Regresión: 59/59 pruebas, TypeScript y ESLint verdes.
- Login, registro, responsive y guards verificados en navegador local staging.
- 14 tablas públicas con RLS; `anon` no tiene lectura.
- Lote 03 de programas, metas y planes listo para seguir desarrollando.
- Arranque local corregido: `pnpm dev` carga staging por defecto.
- Ningún dato, tabla, archivo o índice fue eliminado.

## Pendientes controlados

1. La protección de contraseñas filtradas requiere Supabase Pro.
2. Falta el E2E autenticado del lote 03 con una credencial temporal disponible sólo durante QA.
3. Los cambios posteriores a Sites v11 aún no están publicados.
4. Sesiones y reportes continúan incompletos.

## Brújula del MVP profesional

| Categoría | Avance | Dirección |
| --- | ---: | --- |
| Base UI, navegación y Auth | 90% | endurecer seguridad antes de datos reales |
| Gestión y ficha de clientes | 85% | edición clínica queda fuera del núcleo actual |
| Evaluaciones | 75% | mejorar estructura y completar historial |
| Adquisición y reducción | 70% | conexión lista; falta E2E autenticado |
| Sesiones clínicas | 30% | siguiente prioridad crítica |
| Informes y gráficos | 20% | depende de sesiones persistentes |
| Supabase, RLS y auditoría | 85% | advisor Pro pendiente |
| Publicación y operación | 55% | redesplegar después del próximo bloque estable |
| QA y cumplimiento para piloto | 65% | QA final con cuenta profesional y sólo datos sintéticos |

**Avance ponderado estimado del MVP profesional: 63%.**

## Siguiente spec

Slice 09 / Lote 04: operación atómica de sesión clínica. Debe crear una cabecera de sesión y sus
mediciones/ensayos en una única transacción, impedir parciales y alimentar el primer gráfico real.

