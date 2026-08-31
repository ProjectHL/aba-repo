# Registro de reorganizaciones de especificaciones

Este registro conserva la secuencia de decisiones de planificación. Una reorganización ocurre cada
cinco specs de implementación materialmente completadas, o antes si una evidencia E2E obliga a
corregir el plan. Las entradas históricas no se reescriben.

| Ciclo | Fecha | Disparador | Mapa anterior | Specs sucesoras | Próximo checkpoint |
| --- | --- | --- | --- | --- | --- |
| 01 | 2026-08-24 | E2E autenticado reveló P0 visual y brechas S-08/S-13/formularios | `2026-08-24-pre-slice-10-spec-map.md` | `specs/slice-10/{frontend,supabase,backend,web-publication}.md`, `10c-export-contract.md` | Tras 5 specs/materializaciones de Slice 10 o antes ante evidencia contradictoria. Conteo actual: 3/5 (10A, 10B frontend, 10C.1 contrato). |
| 02 | 2026-08-25 | Checkpoint E2E 10A confirmó el arreglo local; 10C.1 tiene evidencia local | `2026-08-25-pre-10d-spec-map.md` | `specs/slice-10/web-publication.md` (10D), con límites preservados en frontend/Supabase/backend | Tras 5 specs/materializaciones desde 10D o evidencia contradictoria. Conteo reiniciado: 0/5. |
| 03 | 2026-08-25 | QA 10D y auditoría de release completadas | `2026-08-25-pre-slice-11-release-map.md` | `specs/slice-11/{frontend,supabase,backend,web-publication}.md` | Tras 5 materializaciones de Slice 11 o una evidencia contradictoria. Conteo reiniciado: 0/5. |
| 04 | 2026-08-25 | Solicitud explícita de gráficos y evidencia de visualización CSS mínima sin librería | `2026-08-25-pre-slice-12-charts-map.md` | `specs/slice-12/{frontend,supabase,backend,web-publication}.md` | Tras 5 materializaciones de Slice 12 o una evidencia contradictoria. Conteo reiniciado: 0/5. |
| 05 | 2026-08-30 | Checkpoint Slice 15 + comparativo APP ABA + decisión de reorganizar para Fase 2 sin programación | 2026-08-30-phase-2-preparation-map.md | docs/system-rebuild/phase-2-pm-epic.md y futura roadmap Fase 2 | Tras aprobar cinco specs de Fase 2 o evidencia contradictoria de QA/VPS. Conteo reiniciado: 0/5. |
