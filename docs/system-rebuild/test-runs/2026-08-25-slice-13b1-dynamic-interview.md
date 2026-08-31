# Evidencia TDD/BDD — Slice 13B.1 entrevista dinámica (2026-08-25)

## Resultado

La entrevista inicial puede capturar una colección ordenada de informantes con fortalezas y
necesidades independientes. El contrato se guarda como `InitialInterviewPayloadV1` dentro de
`assessments.payload`. Sólo se usaron textos y UUID sintéticos; no se crearon filas remotas.

## SDD

- Contrato aprobado en `docs/system-rebuild/decisions/2026-08-25-slice-13b1-interview.md`.
- Payload: `schema_version: 1`, cuatro campos base y array `informants`.
- Mínimo una fila; orden preservado; identificador de React no persistido.
- Contexto, historia, consentimiento y acceso siguen fuera del alcance.

## TDD rojo → verde

| Comportamiento | Rojo | Verde |
| --- | --- | --- |
| Trigger específico y matriz | formulario especializado ausente | diálogo accesible con una fila inicial |
| Añadir/quitar | no existía colección | la fila restante conserva sus tres valores |
| Payload | dos textarea globales | array versionado sin IDs técnicos |
| Error | contrato no cubierto | valores base e informante permanecen intactos |
| Privacidad | sin validador específico | RUT/correo y array vacío rechazados por Zod |

Resultados finales:

- focused: 14/14;
- regresión: 22 archivos, 103/103 pruebas;
- `tsc -b`: verde;
- `eslint .`: verde;
- build: `apps/web/verification/release-20260825-slice13b1`;
- JS inicial: 953.94 kB / 287.82 kB gzip, aumento gzip aproximado 0.35%, bajo el gate 10%.

## BDD

| ID | Given | When | Then | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- |
| 13B1-001 | entrevista sintética con informante A | añade B y elimina A | B conserva relación, fortalezas y necesidades | prueba de ficha | pass |
| 13B1-002 | formulario válido | activa trigger con Enter y guarda | repositorio recibe payload v1 ordenado | prueba de ficha | pass de contrato |
| 13B1-003 | repositorio rechaza escritura | intenta guardar | error visible y valores intactos | prueba de ficha | pass |
| 13B1-004 | correo/RUT o cero informantes | valida | no construye payload | prueba de contrato | pass |

El viewport estrecho y la escritura autenticada real en staging se reservan al QA final, por lo que
no se presentan como evidencia completada aquí.

## Supabase staging

Consulta metadata de sólo lectura:

- `assessments.relrowsecurity = true`;
- `authenticated` tiene SELECT e INSERT;
- políticas: `assessments_select_member`, `assessments_insert_writer` y
  `assessments_update_writer`;
- no se aplicó migración ni se insertaron fixtures.

La revisión del changelog no encontró un breaking change aplicable al uso de JSONB/RLS existente.
El cambio relevante para tablas nuevas exige grants explícitos, pero 13B.1 no crea tablas.

## Pendientes

- P0/P1 dentro de 13B.1: ninguno a nivel de contrato.
- E2E autenticado y viewport móvil: QA final.
- 13B.2 contexto e historia: bloqueados por decisión de modelo.
