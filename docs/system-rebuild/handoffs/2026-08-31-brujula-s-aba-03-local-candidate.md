# Brújula — S-ABA-03 candidato local

Fecha: 2026-08-31

## Estado ejecutivo

El alcance completo S-ABA-03–10 fue autorizado como backlog. S-ABA-03 es la primera slice:
D03-01–D03-08 están aprobadas y su candidato local quedó verde. La persistencia todavía no puede
cerrarse porque la migración 018 y el contrato 006 no se ejecutaron en `ABA_staging`.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Spec S-ABA-03 | cuatro capas y BDD aprobados | verde |
| Dominio/repositorio/UI | implementados localmente | verde |
| Regresión | 146/146, TypeScript y lint | verde |
| Build/preflight | candidato aislado, 18 archivos | verde |
| SQL/RLS | 018 + 006 creados, sin ejecución DB | pendiente remoto |
| Supabase | sin mutaciones | sin cambio |
| Publicación | no autorizada ni ejecutada | pendiente |
| S-ABA-04–10 | backlog ordenado; specs aún no aprobadas | pendiente |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-local-tdd.md`
- `docs/system-rebuild/phase-2-functional-backlog-execution.md`
- `specs/s-aba-03-program-lifecycle/`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-01-02-version-13-auth-smoke.md`

## P0/P1/P2

- P0/P1 locales de S-ABA-03: ninguno reproducido.
- P1 de validación: RLS y persistencia autenticada de 018/006 pendientes.
- P2: `PERF-14-001`; chunk principal 304.27 kB gzip, +1.31% minificado frente a v13.
- Bloqueo externo independiente: OpenAI Auth 500 impide cerrar el smoke visible de v13.

## Límites

- Sólo identidades y datos sintéticos; los fixtures remotos deben permanecer.
- No producción, datos reales, Storage, VPS, ampliación de audiencia ni publicación.
- No borrar tablas, versiones, registros o artefactos.
- S-ABA-04 no inicia implementación antes de su spec y decisiones aprobadas.

## Siguiente norte

**Único objetivo:** aplicar y verificar S-ABA-03 en `ABA_staging` con migración 018, contrato 006 y
E2E autenticado sintético.

**Autorización requerida:** modificación de schema/RLS/RPC en `ABA_staging` y creación de fixtures
sintéticos persistentes. No autoriza publicación ni producción.

**No objetivos:** Sites, VPS, datos reales, S-ABA-04, IA, chat, exportaciones u offline.

## Skills y agentes

1. `supabase:supabase` y `supabase:supabase-postgres-best-practices` antes de aplicar 018.
2. `aba-authenticated-e2e-evidence` para el flujo sintético remoto.
3. `aba-mvp-qa-release-loop` para la regresión posterior.
4. `brujula` al cerrar o bloquear el gate.

Agente primario activo; sin subagentes. Delegación deshabilitada salvo solicitud explícita y bajo
workspace, no borrado, datos sintéticos y sin producción.
