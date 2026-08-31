# Brújula — Slice 15 candidato local

Fecha: 2026-08-29

## Estado

Slice 15 está especificado, aprobado e implementado localmente. RPT-02 ahora compone evaluaciones
versionadas y RPT-03 reúne evaluación, adquisición, reducción y progreso. El PDF consume el mismo
modelo minimizado, bloquea payloads incompatibles y evita doble descarga.

| Categoría | Avance verificable | Estado |
| --- | ---: | --- |
| Spec y decisión D15-01–D15-06 | 100% | aprobadas y documentadas |
| TDD focalizado | 100% | tres ciclos rojo-verde |
| Regresión local | 100% | 137/137, TypeScript y ESLint verdes |
| BDD de Informes | 100% automatizado | 19/19 módulo Informes |
| Candidato staging local | 100% | build/preflight, 17 archivos |
| Informes completos funcionales | 85% | falta smoke visual/autenticado |
| PDF completo | 85% | contrato verde; falta archivo/QA visual autorizado |
| Responsive/impresión | 60% | CSS/automatización; falta navegador real |
| Supabase | sin cambio | smoke de lecturas RLS pendiente |
| Publicación | 0% en Slice 15 | no autorizada |

## Evidencia autoritativa

- `docs/system-rebuild/decisions/2026-08-29-slice-15-approved.md`;
- `specs/slice-15-complete-clinical-reports-pdf/`;
- `docs/system-rebuild/test-runs/2026-08-29-slice-15-complete-reports-tdd.md`;
- `docs/system-rebuild/test-runs/2026-08-29-slice-15-complete-reports-bdd.md`;
- `apps/web/verification/release-20260829-slice-15-reports/`.

## Riesgos y límites

- P0/P1 locales: ninguno reproducible.
- P2: `PERF-14-001`; principal 296.24 kB gzip.
- Sin cambios de schema, RLS, RPC, Storage, Auth, publicación o datos reales.
- No se realizó una descarga física ni smoke autenticado en esta fase.

## Siguiente norte

El loop de QA/release local quedó verde. El siguiente paso requiere autorización explícita para el
smoke visual/autenticado de Slice 15 y, por separado, para escribir/verificar un PDF dentro del
workspace. No desplegar.
