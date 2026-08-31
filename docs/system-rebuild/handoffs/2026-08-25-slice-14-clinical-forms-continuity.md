# Handoff de continuidad — Slice 14 formularios clínicos

Fecha: 2026-08-25  
Workspace único autorizado: `C:\Users\Moonlabpc\Desktop\aba 2`  
Estado: implementación integrada; regresión completa y build final pendientes por cierre de sesión.

## Objetivo activo

Completar primero todo el frontend de formularios clínicos de la spec paraguas
`specs/slice-14-clinical-forms-frontend-closure/`. No avanzar a informe completo, PDF,
publicación o QA final hasta cerrar y verificar este frente.

La spec fue aprobada por el usuario el 2026-08-25. La decisión está registrada en
`docs/system-rebuild/decisions/2026-08-25-slice-14-approved.md`.

## Reglas no negociables

- Trabajar 100% dentro de `C:\Users\Moonlabpc\Desktop\aba 2`.
- No acceder a otras carpetas sin permiso exacto del usuario.
- No borrar, mover, limpiar ni reemplazar destructivamente archivos o datos.
- Sólo fixtures sintéticos; nunca datos reales de pacientes.
- Sin cambios de Supabase, RLS, RPC, Storage, producción o despliegue para Slice 14.
- Spec first, TDD rojo-verde-refactor y BDD antes de declarar cierre.
- shadcn/ui como base; NestJS sigue diferido.

## Implementado en esta sesión

### CF-01 — base común

- `FrontendDraftProvider` con borradores en memoria por `clientId`.
- Aislamiento A/B, conservación dentro del montaje y limpieza al cambiar/cerrar sesión.
- Sin Web Storage, URL, red o serialización.
- `syntheticFreeTextSchema` central para rechazar RUT/correos.
- Refactor de entrevista inicial para reutilizar la validación central.
- Contratos separados para cumplir Fast Refresh y ESLint.

Archivos principales:

- `apps/web/src/features/clinical/forms/frontend-draft-context.tsx`
- `apps/web/src/features/clinical/forms/frontend-draft-store.ts`
- `apps/web/src/features/clinical/forms/synthetic-free-text-schema.ts`

### CF-02 / CF-03 — contexto e historia clínica

- Contexto hogar/colegio: adaptaciones del hogar, escolarización y adaptaciones escolares.
- Historia estructurada: diagnósticos, evaluaciones históricas, procedimientos y medicamentos.
- Filas repetibles y confirmación antes de quitar una fila con contenido.
- Fechas no futuras y término de medicamento no anterior al inicio.
- Etiqueta autoritativa `Borrador temporal · no guardado`.
- Integrados en `InformationPanel`; los conteos reemplazan las tarjetas fijas `Sin…`.

Archivos principales:

- `apps/web/src/features/clinical/forms/client-context-form-dialog.tsx`
- `apps/web/src/features/clinical/forms/clinical-history-form-dialog.tsx`
- `apps/web/src/features/clinical/forms/clinical-draft-contracts.ts`
- `apps/web/src/features/clients/client-detail-page.tsx`

Evidencia focal:

- `docs/system-rebuild/test-runs/2026-08-25-slice-14-cf02-cf03-frontend-drafts.md`
- 8/8 pruebas focales verdes antes de integración.

### CF-04 / CF-05 — evaluaciones

- Entrevista inicial dinámica conservada.
- Preferencias y evaluación funcional reemplazaron el formulario genérico.
- Payloads v1 tipados; `occurredOn` se envía fuera del payload.
- Archivo excluido del payload y mostrado sólo como nombre efímero.
- Estados invalid/saving/saved/saved-stale/error y reintento sin duplicar escritura.
- Texto autoritativo remoto: `Guardado en staging con RLS`.

Archivos principales:

- `apps/web/src/features/clinical/assessment-forms-contract.ts`
- `apps/web/src/features/clinical/assessment-forms-dialog.tsx`
- integración en `apps/web/src/features/clients/client-detail-page.tsx`

Validación focal integrada: 19/19 pruebas verdes incluyendo ficha del cliente.

### CF-06 — programas, metas y planes

- Se conservaron todos los campos visibles actuales.
- Se añadieron schemas Zod tipados y validación sintética central.
- Mapeadores estables para programas, metas y planes.
- Serialización complementaria con orden/etiquetas fijados por pruebas.
- Triggers ahora usan `Ver formulario de <nombre>`.

Archivos principales:

- `apps/web/src/features/clinical/clinical-plan-form-contracts.ts`
- `apps/web/src/features/clinical/clinical-plan-form-contracts.test.ts`
- integración en `apps/web/src/features/clients/client-detail-page.tsx`

### CF-07 / CF-08 — sesión y continuidad

- Captura de sesión por frecuencia, duración, latencia e intervalo se conserva.
- Se integró `ClinicalJourneyCompass`:
  información → evaluación → adquisición → reducción → sesiones → informes.
- La navegación no finge aprobación clínica y conserva `clientId`.
- Consentimiento clínico y usuarios asignados aparecen como
  `Contrato pendiente · no editable`, sin botones falsos de guardado.

Archivos principales:

- `apps/web/src/features/clinical/forms/clinical-journey-contract.ts`
- `apps/web/src/features/clinical/forms/clinical-journey-compass.tsx`
- integración en `apps/web/src/features/clients/client-detail-page.tsx`

## Última verificación confirmada

- TypeScript `tsc --noEmit`: verde después de integrar CF-02/03 y CF-05.
- ESLint global: verde después de separar contratos/componentes y retirar el setState en efecto.
- Pruebas focales de borradores + ficha: 21/21 verdes.
- Pruebas focales de evaluaciones + ficha: 19/19 verdes.
- Una regresión anterior a la última integración alcanzó 128/128; el subagente CF-02/03 alcanzó
  130/130 antes de integración.

No se alcanzó a ejecutar después de la integración final:

1. Vitest completo.
2. Typecheck + ESLint en el mismo gate final.
3. Build staging aislado.
4. BDD integrado de punta a punta para todos los formularios.
5. Revisión visual local de 320 px y escritorio.

## Próxima acción exacta

1. Leer completamente las skills `aba-tdd-validation` y `aba-bdd-flow-validation`.
2. Ejecutar desde `apps/web`:
   - `.\node_modules\.bin\vitest.cmd run`
   - `.\node_modules\.bin\tsc.cmd --noEmit`
   - `.\node_modules\.bin\eslint.cmd .`
3. Corregir cualquier regresión con test rojo primero; no borrar archivos.
4. Crear un directorio de build nuevo y previamente inexistente dentro de
   `apps/web/verification/`; no reutilizar ni vaciar un build anterior.
5. Ejecutar build staging hacia ese directorio nuevo.
6. Validar BDD con datos sintéticos:
   - alta → ficha;
   - preparar contexto e historia;
   - cambiar de pestaña y confirmar conservación;
   - entrevista, preferencias y funcional;
   - programa → meta;
   - plan de conducta;
   - sesión;
   - continuar a informes conservando cliente;
   - consentimiento/accesos sin edición.
7. Revisar 320 px y escritorio, teclado/Escape/foco y mensajes de persistencia.
8. Documentar test-run, bugs y correcciones. Sólo entonces actualizar handoff y brújula.

## Riesgos a revisar primero

- Verificar que todos los tests que renderizan `ClientDetailPage` incluyan AuthContext y
  `FrontendDraftProvider`.
- Confirmar que el cambio de identidad remonta el store y vacía drafts sin perderlos durante
  cambios normales de pestaña.
- Confirmar que los formularios CF-05 envían `occurredOn` al repositorio y nunca dentro del payload.
- Confirmar que el formulario genérico restante sólo se usa para CF-06 y conserva valores ante
  error de schema/remoto.
- Revisar tildes visibles de `Escolarización`, `Añadir`, `Diagnóstico` y `Término`; algunos labels
  internos fueron creados sin tilde para facilitar selectores de test y deben pulirse sin romper
  accesibilidad.

## Estado real de la brújula

| Categoría | Avance estimado | Nota |
| --- | ---: | --- |
| Inventario/spec de formularios | 100% | Slice 14 aprobada y detallada |
| Base común y privacidad frontend | 95% | Falta BDD final integrado |
| Contexto e historia | 92% | Implementados; falta revisión visual integrada |
| Evaluaciones | 95% | Tipadas e integradas; falta BDD real de ficha |
| Programas/metas/planes | 90% | Contratos tipados; falta revisión visual/errores por campo |
| Sesiones | 95% | Ya conectada; sólo regresión |
| Navegación/bloqueados | 95% | Integrado; falta smoke completo |
| Cierre frontend Slice 14 | 92% | No declarar 100% hasta gates y BDD |
| MVP global | 76% | Informes completos/PDF y QA final siguen fuera de este cierre |

## Condición para declarar formularios cerrados

Full Vitest, TypeScript, ESLint y build staging aislado verdes; BDD sintético completo; revisión
visual responsive; 0 P0/P1 abiertos; evidencia y brújula actualizadas. No desplegar sin una
autorización separada del usuario.

