# Mapa previo a Fase 2 — preparación

Fecha: 2026-08-30  
Disparador: checkpoint de evidencia de Slice 15, comparativo APP ABA vs. proyecto actual y solicitud de reorganizar el proyecto para una Fase 2 sin programación.

## Mapa anterior

El índice raíz todavía declara Slice 12 como continuación activa. Esa afirmación está superada por evidencia posterior:

- Slice 13: dimensiones de medición y contratos asociados, con evidencia TDD/BDD local.
- Slice 14: cierre de formularios clínicos frontend.
- Slice 15: informes clínicos y PDF local como candidato local, con smoke visual/autenticado, lecturas RLS y PDF físico pendientes de autorización.
- Contrato atómico y comparativo APP ABA: identifican brechas de producto que no están aprobadas para implementar.

## Evidencia usada

- docs/system-rebuild/handoffs/2026-08-29-brujula-slice-15-local-candidate.md
- docs/system-rebuild/test-runs/2026-08-29-slice-15-local-release-loop.md
- docs/system-rebuild/current-development-state.md
- docs/system-rebuild/comparativo-spec.md
- docs/system-rebuild/atomic-model-aba-contract.md
- docs/system-rebuild/spec-reviews/2026-08-29-s-aba-01-access-authorization.md

## Decisiones abiertas que el mapa previo no resuelve

1. DEC-ABA-01 y DEC-ABA-02: permisos por estudiante y acceso familiar.
2. Consentimiento, alcance clínico mínimo, edición/auditoría de registros, offline, exportaciones, chat e IA.
3. Alcance y controles de una VPS/publicación para pruebas públicas.
4. Gate pendiente de Slice 15: navegador real, RLS autenticada, PDF físico e inspección visual autorizada.

## Sucesor de planificación

El sucesor es una sola continuación de planificación: **Fase 2 — organización, specs y preparación de piloto público controlado**. No es una autorización de implementación, cambios en Supabase, infraestructura, VPS ni publicación.

La épica PM y el documento de estado definirán las historias/specs propuestas. Cada historia conserva el requisito de aprobación explícita y cuatro capas antes de entrar a TDD.

## Próximo checkpoint

Tras aprobar la épica Fase 2 y cinco specs materialmente aprobadas o ante evidencia contradictoria de QA/VPS. Antes de ese checkpoint, la actividad se limita a documentación, decisiones y preparación no operativa.

