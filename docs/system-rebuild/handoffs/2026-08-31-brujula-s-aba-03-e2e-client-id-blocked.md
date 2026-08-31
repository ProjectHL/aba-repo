# Brújula — S-ABA-03 v14: E2E bloqueado antes de persistencia

Fecha: 2026-08-31

## Estado ejecutivo

S-ABA-03 continúa publicada como versión 14 y accesible mediante sesión autenticada. El intento
autorizado de crear `UV / E2E-SABA03-20260831` fue detenido por validación local antes de cualquier
persistencia. La slice permanece abierta y BDD-03-01–12 no se inició.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Publicación v14 y login | previamente verificados | verde previo |
| Formulario de alta | fixture adulto sintético preparado y enviado una vez | bloqueado |
| Persistencia de `UV` | ninguna escritura demostrada | pendiente |
| BDD-03-01–12 | no ejecutados | P1 abierto |
| Schema/configuración Supabase | sin mutaciones en este intento | sin cambio |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-v14-e2e-client-create-blocked.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-sites-v14-auth-handoff.md`
- `apps/web/src/features/clients/client-form-schema.ts`

## P0/P1/P2

- P0: ninguno demostrado en este intento.
- P1 abierto: falso positivo de la validación de ID clínico que rechaza el fixture autorizado antes
  de crear el cliente; BDD-03-01–12 bloqueado por dependencia.
- P2: `PERF-14-001` permanece sin cambio (chunk principal previamente documentado).

## Límites vigentes

- Sólo `ABA_staging`, sesión existente y datos adultos estrictamente ficticios.
- No borrar, archivar, truncar, mover ni limpiar fixtures o artefactos.
- Sin producción, datos reales, credenciales service role, S-ABA-04–10, Storage, IA, chat,
  exportación u offline.

## Siguiente norte

**Único objetivo:** decidir si se aprueba corregir la validación local del ID clínico para que
acepte exactamente `E2E-SABA03-20260831`, y de aprobarse, completar primero el ciclo SDD/TDD antes
de reintentar el alta una sola vez.

**Autorización requerida:** aprobación explícita del cambio de especificación y código. No se debe
alterar el identificador autorizado como atajo.

**No objetivos:** reintentos con IDs alternativos, cambios Supabase, producción, borrar datos o
continuar BDD sin cliente persistido.

## Skills y agentes

1. `aba-sdd-spec-first` antes de cualquier cambio de comportamiento.
2. `aba-tdd-validation` después de una spec aprobada, para prueba roja, implementación mínima y
   regresión local.
3. `aba-mvp-qa-release-loop` para verificaciones posteriores al cambio.
4. `browser:control-in-app-browser` y `aba-authenticated-e2e-evidence` sólo al reintento
   autorizado en staging.
5. `brujula` al cierre o cambio material de estado.

Agente primario activo; sin subagentes. No delegar salvo solicitud explícita; toda delegación debe
mantener el workspace único, no borrado, sólo datos sintéticos y prohibición de producción.
