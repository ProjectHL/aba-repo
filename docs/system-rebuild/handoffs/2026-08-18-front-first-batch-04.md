# Handoff — Lote 04, sesión clínica atómica

Fecha: 2026-08-18

## Entregado

- Pestaña de sesión conectada a metas y planes reales del cliente.
- Registro de fecha, notas, mediciones y ensayos correctos/incorrectos.
- Una sola RPC transaccional; un error impide que quede una sesión parcial.
- RLS conservada mediante `SECURITY INVOKER` y permisos de ejecución explícitos.
- Estados clínicos del lote anterior alineados y cubiertos por regresión.
- Contrato SQL versionado y matriz de conexiones actualizada.
- 73/73 pruebas, TypeScript, ESLint y contrato remoto en verde.

No se publicó una nueva versión de Sites en este lote. La web pública aún no incluye estos cambios.

## Archivos clave

- `apps/web/src/pages/client-detail-page.tsx`
- `apps/web/src/features/clinical/supabase-clinical-session-repository.ts`
- `supabase/schema/008_atomic_clinical_session.sql`
- `supabase/tests/003_atomic_clinical_session.sql`
- `docs/system-rebuild/test-runs/2026-08-18-atomic-clinical-session.md`

## Brújula del MVP profesional

| Categoría | Avance | Dirección inmediata |
| --- | ---: | --- |
| Base UI, navegación y Auth | 90% | endurecimiento previo a datos reales |
| Gestión y ficha de clientes | 85% | completar edición clínica |
| Evaluaciones | 75% | historial y mejor estructura visual |
| Adquisición y reducción | 78% | validar flujo autenticado al QA final |
| Sesiones clínicas | 72% | historial detallado y edición controlada |
| Informes y gráficos | 20% | siguiente lote prioritario |
| Supabase, RLS y auditoría | 90% | mantener pruebas de contratos y RLS |
| Publicación y operación | 55% | publicar al cerrar bloque visual estable |
| QA y cumplimiento para piloto | 65% | gate final sólo con datos sintéticos |

**Avance ponderado estimado del MVP profesional: 69%.**

## Siguiente spec

Slice 09 / Lote 05A — informe clínico derivado:

1. consultar sesiones, mediciones y ensayos del cliente con aislamiento RLS;
2. mostrar evolución temporal por conducta y porcentaje de aciertos por meta;
3. filtrar por rango de fechas sin mezclar series ni clientes;
4. mostrar estados vacío, carga y error recuperable;
5. generar un resumen imprimible sin incluir identificadores innecesarios;
6. mantener reportes como vistas derivadas, sin duplicar datos clínicos en una tabla nueva.

Después corresponde Lote 05B: pulido visual de informes, impresión y validación responsive. El QA
integral y la publicación agrupada permanecen al final, como acordado.

