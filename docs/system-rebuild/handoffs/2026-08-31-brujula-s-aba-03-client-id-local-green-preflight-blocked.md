# Brújula — S-ABA-03: validación de fixture verde localmente, candidato no publicable

Fecha: 2026-08-31

## Estado ejecutivo

La corrección aprobada para el falso positivo de `E2E-SABA03-20260831` está implementada y verde
localmente: la prueba nueva pasa, y la regresión completa registra 148/148. No llegó a staging: el
candidato local falla el preflight del Worker de Sites, por lo que la versión 14 publicada sigue sin
la corrección y el fixture aún no existe.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Contrato frontend | spec SDD aprobada y actualizada | verde |
| TDD local | rojo observado; 9/9 enfocado | verde |
| Regresión local | 34 archivos, 148/148; tipos y lint | verde |
| Candidato aislado | build staging creado | verde local |
| Preflight Sites | Worker no autocontenido | P1 abierto |
| Staging / fixture `UV` | sin cambios remotos | pendiente |
| BDD-03-01–12 | no ejecutados | pendiente |

## Evidencia

- `docs/system-rebuild/decisions/2026-08-31-client-id-synthetic-validation-spec.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-client-id-validation-local.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-v14-e2e-client-create-blocked.md`
- `apps/web/verification/s-aba-03-client-id-validation-20260831/`

## P0/P1/P2

- P0: ninguno demostrado.
- P1 abierto: el Worker generado para el nuevo candidato depende de `ASSETS` y falla el preflight
  que exige el contrato autocontenido usado por la versión 14 aprobada.
- P2: `PERF-14-001` permanece; tamaño del chunk prácticamente sin variación.

## Límites vigentes

- Sólo workspace local y, para un retest separado autorizado, `ABA_staging` con datos adultos
  ficticios.
- No borrar, archivar, truncar, mover ni limpiar datos o artefactos.
- Sin producción, credenciales privilegiadas, S-ABA-04–10, Storage, IA, chat, exportación u offline.

## Siguiente norte

**Único objetivo:** diagnosticar y corregir el contrato local de empaquetado/preflight de Sites hasta
generar un candidato autocontenido que pase preflight, sin publicar aún.

**Autorización requerida posterior:** una vez verde el candidato, autorización separada para
publicarlo y otra confirmación puntual antes de crear el fixture en staging.

**No objetivos:** modificar Supabase, cambiar el fixture, eludir preflight, reemplazar la versión
14, borrar artefactos o ejecutar BDD antes de publicar el arreglo.

## Skills y agentes

1. `aba-sdd-spec-first` antes de cambiar el contrato de publicación.
2. `aba-tdd-validation` y `aba-mvp-qa-release-loop` para la corrección local y candidato.
3. `sites:sites-building` y `sites:sites-hosting` sólo si el próximo trabajo toca el contrato o
   publicación de Sites.
4. `browser:control-in-app-browser` y `aba-authenticated-e2e-evidence` únicamente tras una
   publicación autorizada.
5. `brujula` al siguiente cambio material.

Agente primario activo; sin subagentes. No delegar salvo solicitud explícita; cualquier delegación
debe respetar el workspace único, no borrado, datos sintéticos y prohibición de producción.
