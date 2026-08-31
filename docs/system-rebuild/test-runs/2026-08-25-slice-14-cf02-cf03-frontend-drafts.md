# Slice 14 — CF-02/CF-03 borradores frontend

Fecha: 2026-08-25  
Alcance: contexto hogar/colegio e historia clínica estructurada.  
Persistencia: sólo `FrontendDraftProvider`; sin Supabase, repositorio, Storage ni despliegue.

## Contrato ejecutado

- Spec aprobada: `specs/slice-14-clinical-forms-frontend-closure/`.
- Fixtures: `client-a`, usuario `synthetic-user` y descriptores exclusivamente sintéticos.
- Contexto: adaptaciones del hogar, escolarización y adaptaciones escolares.
- Historia: diagnósticos, evaluaciones históricas, procedimientos y medicamentos.
- Fechas opcionales, nunca futuras; término de medicamento igual o posterior a inicio.
- Una sección vacía es válida; una fila añadida exige su descriptor principal.
- Una fila con valores sólo se quita después de confirmación y no altera las demás.
- Etiqueta autoritativa: `Borrador temporal · no guardado`.

## Evidencia TDD

### Rojo

```text
vitest clinical-draft-contracts.test.ts clinical-draft-dialogs.test.tsx
2 suites failed: no existían clinical-draft-contracts, client-context-form-dialog ni
clinical-history-form-dialog.
```

### Verde focalizado

```text
Test Files  2 passed (2)
Tests       8 passed (8)
```

Cobertura observable:

- fechas futuras rechazadas en diagnósticos, evaluaciones y procedimientos;
- término de medicamento anterior a inicio rechazado;
- RUT/correo rechazados mediante el validador central;
- filas vacías opcionales y descriptor principal obligatorio al añadir;
- contexto preparado en memoria y etiqueta honesta;
- cero `fetch` y cero escritura en Web Storage al preparar contexto;
- cancelación/confirmación al quitar una fila con valores;
- quitar B conserva A/C;
- un draft inválido no actualiza el provider.

### Regresión local

```text
vitest run --reporter=dot  -> 30 archivos, 130 pruebas, PASS
tsc -b                     -> PASS
eslint focalizado          -> PASS
```

`eslint .` quedó bloqueado por cuatro errores preexistentes/concurrentes de CF-01 en
`clinical-journey-compass.tsx` y `frontend-draft-context.tsx`; ninguno pertenece a los archivos
CF-02/03 de este lote.

## Archivos del lote

- `apps/web/src/features/clinical/forms/clinical-draft-contracts.ts`
- `apps/web/src/features/clinical/forms/client-context-form-dialog.tsx`
- `apps/web/src/features/clinical/forms/clinical-history-form-dialog.tsx`
- `apps/web/src/features/clinical/forms/clinical-draft-contracts.test.ts`
- `apps/web/src/features/clinical/forms/clinical-draft-dialogs.test.tsx`

## Integración pendiente en la ficha

No se editó `client-detail-page.tsx` para evitar conflicto con otros lotes. Importar:

```ts
import { ClientContextFormDialog } from "@/features/clinical/forms/client-context-form-dialog"
import { ClinicalHistoryFormDialog } from "@/features/clinical/forms/clinical-history-form-dialog"
```

Renderizar en el panel de Información con el ID autoritativo del cliente:

```tsx
<ClientContextFormDialog clientId={clientId} />
<ClinicalHistoryFormDialog clientId={clientId} />
```

## BDD siguiente

`BDD-CF-02`, `BDD-CF-03`, `BDD-CF-04` y `BDD-CF-14`: integrar en ficha, preparar A, cambiar de
pestaña, comprobar continuidad; abrir B vacío; volver a A; remontar y comprobar pérdida. Esto es
evidencia de componente, no persistencia autenticada.

P0/P1 propios abiertos: 0. Publicación: no ejecutada ni autorizada.
