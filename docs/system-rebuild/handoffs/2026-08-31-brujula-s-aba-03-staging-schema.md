# Brújula — S-ABA-03 schema staging verificado

Fecha: 2026-08-31

## Estado ejecutivo

S-ABA-03 tiene implementación local y schema remoto verificados. `ABA_staging` recibió las
migraciones aditivas 018/019 y el contrato 006 pasó. La slice no está cerrada: el frontend aún no
se publicó y por ello el E2E autenticado por UI con fixtures persistentes sigue pendiente.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Spec D03-01–D03-08 | aprobada | verde |
| Dominio/repositorio/UI | local, 147/147 + tipos + lint | verde |
| Supabase schema | 018/019 en historial remoto | verde |
| Contrato SQL/RLS | 006 verde; sin DELETE; ledger cerrado | verde |
| Advisors S-ABA-03 | sin FK faltantes; sin definer público nuevo | verde |
| Fixtures autenticados | no creados en este gate | pendiente UI |
| Publicación y smoke | no ejecutados | pendiente |
| S-ABA-04–10 | backlog ordenado; specs pendientes | pendiente |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-staging-schema.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-local-tdd.md`
- `specs/s-aba-03-program-lifecycle/`
- `supabase/schema/018_program_lifecycle.sql`
- `supabase/schema/019_program_lifecycle_fk_indexes.sql`
- `supabase/tests/006_program_lifecycle.sql`

## Riesgos

- P0: ninguno demostrado en schema/contrato.
- P1: E2E autenticado BDD-03-01–12 pendiente; no afirmar cierre funcional hasta ejecutarlo.
- P2: `PERF-14-001` del bundle local permanece documentado.
- Preexistente fuera de S-ABA-03: advisors de funciones `SECURITY DEFINER` de slices anteriores y
  protección de contraseñas filtradas deshabilitada; no se modificaron sin nueva spec/autorización.

## Límites

- Sólo staging e identidades/datos sintéticos; sin producción ni datos reales.
- Sin borrado. Los futuros fixtures persistirán con `test_run_id`.
- No VPS, Storage, ampliación de audiencia ni S-ABA-04 antes de cerrar el gate actual.

## Siguiente norte

**Único objetivo:** publicar el candidato frontend S-ABA-03 en el sitio staging y ejecutar el E2E
autenticado BDD-03-01–12 con fixtures sintéticos persistentes.

**Autorización requerida:** publicación de Sites staging y creación de fixtures UI persistentes.
No autoriza producción ni datos reales.

## Skills y agentes

1. `sites:sites-building` y `sites:sites-hosting` para empaquetar/publicar.
2. `browser:control-in-app-browser` y `aba-authenticated-e2e-evidence` para smoke/BDD.
3. `supabase:supabase` sólo para verificación remota acotada.
4. `aba-mvp-qa-release-loop` y `brujula` al cerrar el gate.

Agente primario activo; sin subagentes. Delegación deshabilitada salvo solicitud explícita y bajo
workspace, no borrado, datos sintéticos y sin producción.
