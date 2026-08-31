# Brújula — Slice 15 cerrado

Fecha: 2026-08-30

## Estado ejecutivo

Slice 15 queda cerrado por aceptación explícita del responsable. Los gates locales, la publicación
privada, el E2E autenticado sintético y las tres rutas de Informes quedaron verdes. El responsable
descargó manualmente el informe completo, confirmó que funciona y que el PDF queda armado. La
mejora visual se conserva como P2 no bloqueante.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Spec D15-01–D15-06 | aprobada | cerrada |
| Gates automatizados | 137/137, TypeScript, ESLint y preflight | verdes |
| Publicación privada | versión 11 activa | verde |
| Recovery e inicio autenticado | operativo | verde |
| E2E clínico sintético | cadena completa y persistente | verde |
| RPT-01 Progreso | 3 ocurrencias y 80.0% consistentes | verde |
| RPT-02 Evaluación | tres evaluaciones persistidas | verde |
| RPT-03 Completo | secciones y métricas consistentes | verde |
| PDF completo | descarga manual y archivo armado | PASS responsable |
| Calidad visual PDF | mejorable | P2 no bloqueante |
| Supabase | sin mutaciones adicionales tras Auth URL | estable |

## Evidencia enlazada

- `docs/system-rebuild/test-runs/2026-08-30-slice-15-pdf-owner-validation.md` — aceptación manual
  del PDF y cierre.
- `docs/system-rebuild/test-runs/2026-08-30-slice-15-authenticated-e2e.md` — flujo autenticado,
  persistencia y consistencia.
- `docs/system-rebuild/test-runs/2026-08-30-private-staging-auth-recovery-publication.md` —
  publicación privada.
- `docs/system-rebuild/test-runs/2026-08-29-slice-15-local-release-loop.md` — gates automatizados.
- `specs/slice-15-complete-clinical-reports-pdf/` — contrato aprobado.

## P0/P1/P2

- P0/P1 de Slice 15: ninguno abierto al cierre.
- P1 de recovery a localhost: cerrado.
- P2 abierto: refinamiento visual del PDF, sin spec ni alcance aprobado.
- P2 abierto heredado: `PERF-14-001`.
- P2 independiente: Google OAuth sin evidencia operativa; no forma parte del cierre de Slice 15.

## Límites vigentes

- Los registros ficticios del E2E permanecen en staging y no se eliminan ni archivan.
- No usar datos clínicos reales ni identificadores de personas.
- No ampliar audiencia ni modificar schema, RLS, RPC, Storage, Auth o permisos sin nueva spec y
  autorización.
- La descarga manual validada no autoriza acceder a carpetas personales ni reutilizar el archivo.
- No iniciar mejoras visuales del PDF sin priorización y spec separada.

## Siguiente norte

**Único objetivo siguiente:** volver al contrato atómico de visión ABA y decidir si se prioriza
`S-ABA-01` — autorización y acceso por estudiante — mediante `aba-sdd-spec-first`.

**Autorización requerida:** aprobación explícita para abrir la spec S-ABA-01. Esta aprobación no
incluye implementación, Supabase, publicación, IA, offline ni datos reales.

**No objetivos:** no reabrir Slice 15, no pulir el PDF, no habilitar Google OAuth y no modificar
recursos remotos durante la fase de especificación.

## Skills y agentes

1. Cargar `aba-sdd-spec-first` antes de redactar S-ABA-01.
2. Cargar `supabase:supabase` y `supabase:supabase-postgres-best-practices` sólo si una spec
   aprobada toca Auth, SQL, schema o RLS.
3. Cargar `aba-tdd-validation` después de aprobar la spec y antes de implementar.
4. Cargar `brujula` al cerrar el próximo gate.
5. Agente primario activo; no hay subagentes ni delegación.

