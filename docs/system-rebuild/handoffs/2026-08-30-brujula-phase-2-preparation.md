# Brújula — Fase 2 de preparación y piloto público planificado

Fecha: 2026-08-30

## Estado ejecutivo

La Fase 1 queda documentada como base local con funcionalidades clínicas parciales y un candidato local de Slice 15. Se reorganizó la continuidad hacia una única continuación de planificación: **Fase 2 — organización de specs y preparación de un piloto público controlado**.

No se programó, no se modificó Supabase, no se creó una VPS, no se configuró dominio/DNS/TLS, no se desplegó, no se publicó y no se usaron datos reales.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Estado actual de desarrollo | snapshot creado | documentado |
| Comparativo APP ABA | capacidades existentes, parciales y ausentes | documentado |
| Épica PM Fase 2 | E2-00 a E2-07, historias/specs y tareas | propuesta lista para aprobación |
| Reorganización de specs | ciclo 05 y mapa previo registrados | documentada |
| Slice 15 | candidato local anterior | QA visual/RLS/PDF físico pendientes |
| VPS/publicación | ruta de preparación sin acciones remotas | pendiente de decisiones y autorización |

## Evidencia enlazada

- docs/system-rebuild/current-development-state.md
- docs/system-rebuild/comparativo-spec.md
- docs/system-rebuild/phase-2-pm-epic.md
- docs/system-rebuild/agents/phase-2-pm.md
- docs/system-rebuild/decision-log/2026-08-30-phase-2-preparation-map.md
- docs/system-rebuild/test-runs/2026-08-29-slice-15-local-release-loop.md
- docs/system-rebuild/handoffs/2026-08-29-brujula-slice-15-local-candidate.md

## P0/P1/P2

- P0/P1: no se ejecutó un nuevo flujo ni se declara una ausencia nueva. La última evidencia local de Slice 15 no reproduce P0/P1.
- P2 abierto: PERF-14-001, bundle principal de 296.24 kB gzip.
- Brechas de producto: permisos por estudiante, visibilidad familiar, consentimiento, sesiones guiadas, chat, offline y salidas separadas. Son decisiones/specs pendientes, no defects confirmados.
- Gates pendientes de Slice 15: navegador real, lecturas RLS autenticadas, PDF físico e inspección visual.

## Límites y stop conditions

- Sólo documentación y fixtures sintéticos.
- No cambios de código, schema, RLS, Auth, Storage, VPS, DNS, secretos, infraestructura, despliegue o publicación.
- No datos reales, pruebas públicas reales, cuentas de proveedores ni acceso a producción.
- La planificación de piloto/VPS no autoriza adquirir ni crear recursos.
- Cada cambio funcional requiere una spec de cuatro capas aprobada antes de TDD.

## Siguiente norte

**Único objetivo siguiente:** aprobar la épica Fase 2 y ejecutar solamente P2-S00-01/P2-S00-02 como documentación de gobernanza y plantilla de spec.

**Autorización requerida:** confirmación explícita para preparar esos dos documentos. No incluye S-ABA-01, código, Supabase, QA remoto, VPS ni publicación.

**No objetivos:** no iniciar las specs funcionales P2-S01+ ni los gates de VPS/piloto; no ejecutar los pendientes de Slice 15 salvo autorización independiente.

## Skills y agentes del siguiente chat

1. Cargar aba-spec-reorganization-loop al siguiente checkpoint de cinco specs aprobadas o evidencia contradictoria.
2. Cargar aba-sdd-spec-first antes de preparar cualquier spec funcional de P2-S01+.
3. Cargar supabase:supabase y supabase:supabase-postgres-best-practices sólo cuando una spec aprobada afecte Supabase/SQL/RLS.
4. Cargar aba-tdd-validation sólo tras aprobar una spec y autorizar implementación.
5. Cargar aba-mvp-qa-release-loop para QA local de un cambio aprobado; cargar brujula al cerrar el gate.
6. Agente primario: conserva la trazabilidad. PM de Fase 2: documento docs/system-rebuild/agents/phase-2-pm.md; no hay subagentes activos. Se delegan sólo subtareas solicitadas, dentro del workspace, sin borrado, datos reales, producción ni despliegue.

## Mensaje inicial sugerido

> Carga aba-sdd-spec-first. Usa docs/system-rebuild/phase-2-pm-epic.md y docs/system-rebuild/current-development-state.md. Sin programar ni tocar Supabase, prepara sólo P2-S00-01 y P2-S00-02 como documentos de gobernanza; marca toda decisión no aprobada como pendiente.

