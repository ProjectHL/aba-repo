# Handoff — Lote 05A, informes clínicos derivados

Fecha: 2026-08-24

## Entregado

- La ruta privada `/informes` permite seleccionar un cliente sintético activo y filtrar por rango.
- El repositorio consulta sólo sesiones no archivadas, mediciones y ensayos del mismo cliente.
- La vista presenta evolución temporal por plan y porcentajes verificables por meta.
- Hay carga, vacío, error recuperable y reintento, sin filtrar detalles internos.
- El resumen imprimible omite fecha de nacimiento, tutores, notas de sesión y otros datos no
  necesarios; conserva el aviso de datos sintéticos.
- No hubo cambios de esquema, RPC, grants ni publicación.
- Regresión: 79/79 pruebas, TypeScript y ESLint en verde.

## Archivos clave

- `apps/web/src/features/reports/reports-page.tsx`
- `apps/web/src/features/reports/supabase-clinical-report-repository.ts`
- `apps/web/src/features/reports/report-analytics.ts`
- `docs/system-rebuild/test-runs/2026-08-24-derived-clinical-reports.md`

## Brújula del MVP profesional

| Categoría | Avance | Dirección inmediata |
| --- | ---: | --- |
| Auth y navegación | 90% | recuperación de contraseña y endurecimiento |
| Gestión y ficha de clientes | 85% | edición clínica completa |
| Evaluaciones | 75% | historial y presentación |
| Adquisición y reducción | 78% | pulido y validación final |
| Sesiones clínicas | 72% | historial detallado y correcciones controladas |
| Informes y gráficos | 52% | pulido visual, responsive e impresión manual |
| Supabase, RLS y auditoría | 90% | mantener contratos y pruebas RLS |
| Publicación y operación | 55% | publicar el próximo bloque estable |
| QA y cumplimiento piloto | 65% | gate final sólo con datos sintéticos |

**Avance ponderado estimado del MVP profesional: 74%.**

## Siguiente spec

Slice 09 / Lote 05B — pulido visual, impresión y responsive de informes. Antes de publicar, validar
manualmente la impresión, contraste, navegación por teclado y el comportamiento autenticado con
datos exclusivamente sintéticos. No conectar datos reales ni modificar producción.
