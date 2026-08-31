# Slice 13 / Frontend

## Contrato SDD

El frontend seguirá React, Vite, Tailwind y shadcn/ui. Los repositorios permanecen separados del
render y toda respuesta remota se valida antes de entrar al modelo de dominio. Los estados mínimos
por formulario son: inicial, carga, validación, guardando, guardado confirmado, error recuperable,
vacío y reintento. Ningún texto puede afirmar persistencia si el repositorio no la confirma.

## 13A — dimensiones de medición de sesión

- `frequency`: contador entero no negativo; unidad visible `ocurrencias`.
- `duration`: campo decimal no negativo; unidad propuesta `segundos`.
- `latency`: campo decimal no negativo; unidad propuesta `segundos`.
- `interval`: contrato propuesto `intervalos observados / intervalos totales`, ambos enteros no
  negativos, `observados <= totales`, con porcentaje derivado.
- La UI debe mostrar el control adecuado según `measurementUnit`, conservar valores al fallar y
  enviar el mismo significado al repositorio/RPC.
- Una sesión sin metas ni planes sigue deshabilitando guardar.

La unidad se deriva del plan al configurar la sesión y se guarda como snapshot en la medición para
preservar el significado histórico si el plan cambia. Contrato **aprobado e implementado en 13A**;
las filas legacy conservan unidad `null` y los informes no inventan su significado.

## 13B — paridad de formularios

- Alta: agregar adaptaciones de hogar/colegio sólo con campos sintéticos; historia clínica debe
  distinguir diagnóstico, evaluación, operación y medicamento sin mostrar que se guardó si no hay
  repositorio aprobado.
- Ficha: mostrar consentimiento y acceso de usuarios como estados explícitos si el contrato remoto
  está listo; de lo contrario, marcarlo como contrato pendiente.
- Entrevista: modelar informantes y filas/columnas dinámicas sin exigir una matriz no confirmada; la
  representación debe ser accesible con teclado y conservar filas al añadir/quitar.
- Preferencias y funcional: mantener fecha, tipo, campos observados y aviso visible de adjunto no
  persistido.
- Adquisición: conservar programa → meta y etiquetar los complementos de protocolo sin perder su
  relación con la meta.

### Contrato de campos propuesto

| Área | Campo | Tipo | Requerido | Persistencia propuesta | Fuente |
| --- | --- | --- | ---: | --- | --- |
| Contexto | `home_adaptations` | textarea, máx. 2000 | no | perfil contextual aditivo | E-004 observed |
| Contexto | `schooling` | texto, máx. 500 | no | perfil contextual aditivo | E-004 observed; catálogo desconocido |
| Contexto | `school_adaptations` | textarea, máx. 2000 | no | perfil contextual aditivo | E-004 observed |
| Diagnóstico | `label`, `occurred_on?` | repetible | `label` | entrada clínica aditiva | E-005 observed |
| Evaluación histórica | `name`, `occurred_on?` | repetible | `name` | entrada clínica aditiva | E-005/E-006 observed |
| Operación | `procedure`, `occurred_on?` | repetible | `procedure` | entrada clínica aditiva | E-005 observed |
| Medicamento | `name`, `dose`, `prescriber`, `started_on`, `ended_on?` | repetible | nombre/dosis | entrada clínica aditiva | E-006 observed |
| Consentimiento | `pending | active | revoked` | estado | sí | contrato remoto nuevo | E-007 observed; valores inferred |
| Acceso cliente | usuario + `active | inactive` | repetible | sí | contrato remoto nuevo | E-008 observed; estados inferred |
| Entrevista | informante + fortalezas/necesidades | matriz repetible | una fila | `assessments.payload` | E-009 observed |

Hasta aprobar persistencia, contexto, historia, consentimiento y acceso deben mostrarse como
`Contrato pendiente` y no ofrecer un botón que simule guardado.

### 13B.1 — entrevista dinámica aprobada

Primer lote ejecutable de formularios clínicos. La entrevista inicial mantiene sus cuatro campos
base y reemplaza los dos textarea globales por una colección ordenada de informantes:

```ts
type InitialInterviewPayloadV1 = {
  schema_version: 1
  consultation_reason: string
  development_history: string
  family_context: string
  priorities: string
  informants: Array<{
    informant: string
    strengths: string
    needs: string
  }>
}
```

Reglas: mínimo una fila; `informant` es un descriptor sintético libre de nombres/RUT/correos,
máximo 80; fortalezas y necesidades son requeridas y máximo 2000; se preserva el orden. Añadir o
quitar una fila no altera las demás. El formulario conserva todos los valores tras un error de
guardado, muestra `Guardando`, `Guardado`, `Error recuperable` y permite reintento. Sólo se limpia
después de escritura confirmada; `saved-stale` no se interpreta como fallo de escritura.

El identificador estable de React Hook Form es exclusivamente de UI y no se persiste. No se exige
catálogo de relaciones porque el video no lo confirma. Adjuntos continúan sin Storage.

### Estados 13B.1

| Estado | Resultado visible | Persistencia |
| --- | --- | --- |
| inicial | una fila de informante vacía | ninguna |
| validación | resumen/campo inválido accesible | ninguna |
| guardando | controles bloqueados y texto `Guardando…` | solicitud en curso |
| guardado | confirmación sintética | assessment creado |
| guardado/lista desactualizada | escritura confirmada y reintento de lectura | assessment creado |
| error recuperable | error visible, valores intactos | no confirmado |

13B.2 y 13B.3 permanecen sin botón de guardado hasta una decisión separada de Supabase.

## 13C — informe de evaluación

- La ruta `/informes/evaluacion` carga evaluaciones del cliente seleccionado.
- Consolida sólo `initial_interview`, `preference` y `functional` disponibles.
- Presenta vacío, carga, error recuperable y contenido imprimible.
- Excluye adjuntos no persistidos, DOB, tutores, notas sensibles y datos de otro cliente.

### Contrato de consulta propuesto

```ts
type EvaluationReportQuery = { clientId: string; from?: string; to?: string }
type EvaluationReport = {
  clientId: string
  generatedAt: string
  assessments: Array<{
    id: string
    kind: "initial_interview" | "preference" | "functional"
    status: "draft" | "completed"
    occurredOn: string | null
    title: string
    payload: Json
  }>
}
```

El repositorio responsable será el `AssessmentRepository` existente más un constructor puro del
reporte. Incluye `draft` y `completed`, excluye `archived`. El rango usa `occurred_on`; con rango
activo, registros sin fecha quedan fuera. Cliente inexistente conserva 404; falta de autorización
invalida la sesión; una fila de otro cliente produce `INVALID_DATA_RESPONSE`.

## 13D — informe completo y PDF

- La ficha ofrece un enlace a `/informes/completo?client=<id>` o equivalente seguro.
- El informe completo incluye módulos autorizados: resumen sintético, programas/metas, planes,
  sesiones, series y porcentajes; cada módulo puede declarar “sin registros”.
- El PDF se genera bajo demanda, sin subir contenido, con paginación, nombre sintético y marca de
  datos sintéticos.
- La prueba de PDF escribe sólo en `apps/web/verification/` y no en `dist` ni fuera del workspace.

### Contrato `CompleteReport` propuesto

Orden en pantalla y PDF:

1. encabezado sintético y período;
2. resumen de conteos;
3. evaluaciones no archivadas;
4. programas y metas con criterio/procedimiento;
5. planes de conducta y unidad;
6. sesiones del período;
7. gráficos y porcentajes;
8. módulos vacíos declarados.

Permitido: iniciales ficticias, ID clínico sintético, títulos, criterios, procedimientos, unidades,
fechas clínicas sintéticas y métricas derivadas. Excluido: DOB, tutores, convivencia, nombres,
correos, RUT, notas libres de sesión, prescriptor, adjuntos y datos de otro cliente.

Nombre determinista: `informe-completo-<clinicalId-sanitizado>-<desde>-<hasta>.pdf`; sin rango,
`informe-completo-<clinicalId-sanitizado>-historial.pdf`.

La prueba debe validar encabezado/secciones, ausencia de campos prohibidos, una página para vacío,
al menos dos páginas con fixture completo y aislamiento entre dos clientes.

## Criterios aprobables

- La sesión usa un control coherente con `frequency`, `duration`, `latency` e `interval`; no
  presenta un contador entero como si representara todas las dimensiones.
- Alta y ficha pueden representar adaptaciones de hogar/colegio, consentimiento e historia clínica
  sólo cuando los campos y reglas estén aprobados.
- Entrevista puede modelar matriz de informantes sin perder accesibilidad ni los datos existentes.
- La ficha ofrece un enlace al informe del cliente actual, preservando cliente y periodo.
- Informe de evaluación consulta evaluaciones reales y muestra estados de carga, vacío, error y
  éxito sin incluir adjuntos no persistidos.
- Informe completo incluye sólo módulos autorizados y declara explícitamente lo que queda fuera.
- PDF se genera bajo demanda y la prueba escribe únicamente en `apps/web/verification/`.

## Pruebas TDD mínimas

- 13A: cada unidad renderiza su control y mapea el valor correcto al draft de sesión.
- 13B: añadir/quitar informante conserva valores y no mezcla campos.
- 13C: las tres clases de evaluación aparecen en el informe y el contenido no cruza cliente.
- 13D: el botón sólo aparece en informe completo; el generador recibe el reporte correcto y
  produce un PDF con al menos una página en el directorio de verificación.

## No incluir

Datos reales, almacenamiento de adjuntos, corrección retroactiva de sesiones, cambios clínicos no
aprobados, ni despliegue.
