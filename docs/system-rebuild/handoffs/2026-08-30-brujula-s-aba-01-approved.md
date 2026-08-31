# Brújula — S-ABA-01 aprobada

Fecha: 2026-08-30

## Estado ejecutivo

S-ABA-01 quedó aprobada documentalmente con D01–D09 resueltas. El contrato define autorización por
estudiante, recurso y acción, pero no se implementó ni se modificaron Auth, Supabase, RLS, RPC,
Sites o staging.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Matriz de acceso | cuatro roles y operaciones atómicas | aprobada |
| Solicitudes y grants | decisión, 90 días, denegación y revocación | aprobados |
| Familia | sólo proyección minimizada futura | aprobada con dependencia S-ABA-02 |
| Cuatro capas + BDD | seis archivos trazables | aprobados, no ejecutados |
| Implementación | ningún cambio | no autorizada |
| Supabase/staging | ninguna mutación | sin cambio |

## Evidencia

- `specs/s-aba-01-student-authorization-access/index.md`
- `specs/s-aba-01-student-authorization-access/frontend.md`
- `specs/s-aba-01-student-authorization-access/backend.md`
- `specs/s-aba-01-student-authorization-access/supabase.md`
- `specs/s-aba-01-student-authorization-access/web-publication.md`
- `specs/s-aba-01-student-authorization-access/bdd.md`
- `docs/system-rebuild/spec-reviews/2026-08-30-s-aba-01-approved.md`

## P0/P1/P2

- P0/P1: no se ejecutó producto; no corresponde declarar defectos nuevos ni cierres técnicos.
- P2: compatibilidad de `admin|clinician|viewer` requiere diseño de migración futuro.
- Dependencia abierta: la vista familiar no se habilita hasta aprobar S-ABA-02.

## Límites vigentes

- Sólo fixtures sintéticos; no datos clínicos reales.
- No implementar S-ABA-01 sin autorización separada y `aba-tdd-validation`.
- No cambiar schema, RLS, RPC, Auth, Storage, Sites, audiencia ni publicación.
- Chat continúa bloqueado por DEC-ABA-10.

## Siguiente norte

**Único objetivo:** redactar y aprobar S-ABA-02 — expediente mínimo y consentimiento — mediante
`aba-sdd-spec-first`, separando campos observados de decisiones clínicas y legales inferidas.

**Autorización requerida:** aprobación explícita de las decisiones de S-ABA-02. La preparación
documental no autoriza implementación, Supabase, datos reales ni publicación.

**No objetivos:** no implementar S-ABA-01; no iniciar S-ABA-03+; no tocar staging o producción.

## Skills y agentes

1. `aba-sdd-spec-first` para S-ABA-02.
2. `brujula` al aprobar o bloquear el siguiente gate.
3. `aba-tdd-validation` sólo si luego se autoriza implementar una spec aprobada.
4. Agente primario activo; sin subagentes. Delegación sólo si la persona usuaria la solicita, dentro
   del workspace, sin borrado/movimiento, datos reales, producción ni despliegue.

