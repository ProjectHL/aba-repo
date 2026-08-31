# Brújula — S-ABA-01 y S-ABA-02 implementadas

Fecha: 2026-08-30

## Estado ejecutivo

S-ABA-01 y S-ABA-02 quedaron implementadas localmente y en Supabase `ABA_staging`, con regresión
verde y dos flujos autenticados sintéticos persistidos. El candidato web no fue publicado; el Site
visible continúa con su versión anterior.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Acceso por estudiante | asignaciones, capabilities, grants temporales y revocación | verde en Supabase staging |
| Auditoría | ledger append-only de asignación/solicitud/decisión | verde |
| Expediente mínimo | contexto persistente e historia versionada | verde local + staging |
| Consentimiento | referencia por finalidad, transición append-only | verde local + staging |
| Frontend | repositorio, formularios persistentes y tarjeta de acceso | verde local |
| Regresión | 139/139, TypeScript, lint y build | verde |
| Publicación web | no autorizada ni ejecutada | pendiente |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-30-s-aba-01-02-local-staging.md`
- `supabase/tests/005_student_access_and_minimum_record.sql`
- `supabase/schema/010_student_access_and_minimum_record.sql`
- `supabase/schema/013_student_access_audit_ledger.sql`
- `supabase/schema/017_student_record_foreign_key_indexes.sql`
- `apps/web/src/features/clinical/student-record/`
- `apps/web/verification/s-aba-01-02-20260830-2036/`
- `specs/s-aba-01-student-authorization-access/`
- `specs/s-aba-02-minimum-record-consent/`

## P0/P1/P2

- P0: ninguno observado en los contratos automatizados o flujos remotos ejecutados.
- P1 abierto de validación: falta publicar el candidato y probar en navegador autenticado estados
  de solicitud, aprobación, revocación, deep link, formulario persistente y bloqueo familiar.
- P2 abierto: code splitting del chunk principal del bundle.
- P2 preexistente: protección de contraseñas filtradas deshabilitada en Supabase Auth; no se cambió.
- Cerrado: el primer intento remoto chocó con restricciones del ledger clínico histórico. Se
  resolvió sin alterar ni borrar ese historial mediante un ledger de acceso dedicado.
- Cerrado: una revocación se reportaba como conflicto de versión; ahora devuelve
  `student_edit_required` mediante gate explícito.

## Límites vigentes

- Sólo identidades y datos sintéticos.
- No producción, datos reales, Storage, firma ni adjuntos.
- No Sites, VPS, despliegue o publicación sin autorización separada.
- No borrar registros sintéticos ni históricos; los test runs permanecen como evidencia.
- Chat sigue bloqueado por DEC-ABA-10.

## Siguiente norte

**Único objetivo:** preparar y, sólo con autorización explícita, publicar el candidato web en el
Site staging para ejecutar el smoke/E2E autenticado de S-ABA-01 y S-ABA-02.

**Autorización requerida:** publicación/actualización de Sites staging. La autorización actual de
Supabase no habilita esa publicación.

**No objetivos:** producción, audiencia real, datos clínicos reales, Storage, firma, VPS, chat o
nuevas specs.

## Skills y agentes

1. `aba-mvp-qa-release-loop` antes de empaquetar el candidato.
2. `sites:sites-building` y luego `sites:sites-hosting` únicamente tras autorizar publicación.
3. `browser:control-in-app-browser` y `aba-authenticated-e2e-evidence` para el smoke autenticado.
4. `supabase:supabase` sólo si el retest revela un defecto remoto; para SQL, sumar
   `supabase:supabase-postgres-best-practices`.
5. `brujula` al cerrar o bloquear el gate de publicación.

Agente primario activo; no se usaron subagentes. Delegación sólo si la persona usuaria la solicita,
respetando workspace, no borrado/movimiento, datos sintéticos y prohibición de producción/deploy no
autorizado.

