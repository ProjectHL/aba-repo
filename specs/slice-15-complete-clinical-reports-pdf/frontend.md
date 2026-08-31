# Slice 15 / Frontend

## Estado

**APROBADA EL 2026-08-29 PARA IMPLEMENTACIÓN LOCAL CON TDD.**

## Viaje del usuario propuesto

1. Un profesional autenticado abre Informes desde la navegación o desde la brújula del expediente.
2. Selecciona un cliente activo al que ya puede acceder.
3. Selecciona RPT-01, RPT-02 o RPT-03.
4. Opcionalmente aplica un rango válido.
5. Revisa una vista HTML con fuentes y estados explícitos.
6. En RPT-03 puede imprimir o solicitar un PDF local, si D15-05 se aprueba.

Seleccionar un informe no crea, edita, completa ni aprueba registros clínicos.

## Catálogo y contenido propuesto

### RPT-01 · Progreso y gráficos

Mantiene el contrato actual:

- cantidad de sesiones no archivadas dentro del rango;
- serie cronológica por plan con mediciones existentes;
- correctos, incorrectos y porcentaje acumulado por meta;
- gráfico accesible y alternativa textual equivalente.

No rellenar fechas sin medición ni convertir unidades. Una serie conserva su unidad registrada.

### RPT-02 · Evaluación conductual

Contenido aprobado, limitado a datos persistidos:

- lista de evaluaciones no archivadas, agrupadas por `kind`;
- título, fecha disponible, estado y campos compatibles con la versión conocida del payload;
- entrevista inicial: campos base y matriz dinámica aprobada;
- preferencias y funcional: campos v1 aprobados;
- indicador explícito de payload desconocido o versión no compatible, sin mostrar JSON crudo.

No generar jerarquías, síntesis, hipótesis o conclusiones nuevas. “Síntesis” significa composición de
entradas existentes, no interpretación clínica.

### RPT-03 · Informe completo

Contenido aprobado por D15-02:

- encabezado mínimo: iniciales, ID clínico, tipo de informe y período;
- sección de evaluación equivalente a RPT-02;
- programas y metas: nombre, área, criterio, procedimiento, estado y suplementos etiquetados ya
  persistidos dentro del contrato vigente;
- planes de conducta: nombre, definición, dimensión, función/estrategias disponibles y estado;
- progreso equivalente a RPT-01;
- aviso de datos sintéticos y alcance/minimización.

No incluir `FrontendDraftProvider`, fecha de nacimiento, convivencia, tutores, hermanos, notas de
sesión, adjuntos, consentimiento, usuarios asignados, IDs internos ni datos de otra organización.

## Contrato de vista propuesto

```ts
type ClinicalReportKind = "progress" | "evaluation" | "complete"

type ClinicalReportRequest = {
  clientId: string
  kind: ClinicalReportKind
  dateRange: { from?: string; to?: string }
}

type ReportSection<T> =
  | { status: "ready"; data: T }
  | { status: "empty"; reason: "no-records" | "not-applicable" }
  | { status: "unsupported"; reason: "unknown-payload-version" }

type EvaluationReportItem =
  | {
      sourceId: string // interno para trazabilidad/UI; nunca visible ni exportado
      kind: "initial_interview"
      title: string
      occurredOn: string | null
      status: "draft" | "completed"
      payload: InitialInterviewPayloadV1
    }
  | {
      sourceId: string
      kind: "preference"
      title: string
      occurredOn: string | null
      status: "draft" | "completed"
      payload: PreferenceAssessmentPayloadV1
    }
  | {
      sourceId: string
      kind: "functional"
      title: string
      occurredOn: string | null
      status: "draft" | "completed"
      payload: FunctionalAssessmentPayloadV1
    }

type AcquisitionReport = Array<{
  program: Pick<AcquisitionProgramSummary, "name" | "description" | "status">
  goals: Array<Pick<AcquisitionGoalSummary,
    "skillArea" | "name" | "masteryCriterion" | "teachingProcedure" | "status"
  >>
}>

type BehaviorReductionReport = Array<Pick<BehaviorPlanSummary,
  | "name"
  | "operationalDefinition"
  | "measurementUnit"
  | "hypothesizedFunction"
  | "antecedentStrategy"
  | "replacementBehavior"
  | "responseStrategy"
  | "status"
>>

type CompleteClinicalReport = {
  schemaVersion: 1
  client: { initials: string; clinicalId: string }
  dateRange: { from?: string; to?: string }
  evaluation: ReportSection<EvaluationReportItem[]>
  acquisition: ReportSection<AcquisitionReport>
  behaviorReduction: ReportSection<BehaviorReductionReport>
  progress: ReportSection<ClinicalReport>
}
```

Los payloads deben validarse antes de entrar al modelo. Evaluaciones archivadas se excluyen. Un
payload no compatible produce `unsupported`; un objetivo cuyo `programId` no existe invalida la
sección de adquisición. `sourceId` se usa sólo para trazabilidad y claves de UI, nunca se renderiza,
imprime ni pasa al generador PDF.

## Regla temporal propuesta

- `from > to`: error local, cero consultas nuevas.
- Sesiones, mediciones y ensayos: filtrar por `occurredOn` dentro del rango inclusivo.
- Evaluaciones: incluir por `occurredOn`; si la fecha es nula, mostrar en “Sin fecha” sólo cuando no
  haya filtro. Con rango activo, excluirlas y explicar el conteo omitido.
- Programas, metas y planes: mostrar su estado vigente como estructura del expediente, sin afirmar
  que se creó o estuvo activo dentro del rango.

Esta regla quedó aprobada por D15-03.

## Máquina de estados

| Estado | Presentación | Acciones |
| --- | --- | --- |
| `loading-clients` | `Cargando expedientes…` | ninguna |
| `empty-clients` | no hay cliente sintético activo | volver a Clientes |
| `invalid-range` | resumen accesible del error | corregir fechas |
| `loading-report` | `Cargando informe…` | evitar solicitudes duplicadas |
| `ready` | secciones y fuentes disponibles | imprimir; PDF sólo en RPT-03 |
| `empty-report` | no hay registros en el período | cambiar rango |
| `unsupported` | registro omitido por versión desconocida | revisar fuente; no exportar como completo |
| `error` | mensaje normalizado, sin detalle interno | reintentar lectura |
| `exporting` | `Preparando PDF local…` | bloquear doble activación |
| `export-error` | error accesible; vista intacta | reintentar |
| `exported` | confirmar que el navegador inició la descarga | no afirmar persistencia ni auditoría |

Si D15-04 conserva atomicidad, `unsupported` o error en una sección requerida bloquea el PDF
completo. Un estado vacío válido no equivale a error y puede exportarse con la sección “Sin
registros”.

## Accesibilidad y responsive

- navegación por tipo de informe con nombre y estado actual perceptibles;
- errores con `role=alert`, carga/exportación con `role=status`;
- foco devuelto a la acción tras diálogo o fallo;
- gráficos con nombre accesible y lista/tablas textuales equivalentes;
- PDF no es el único acceso al contenido;
- 320 px sin overflow del viewport; tablas con tarjetas o scroll propio;
- impresión/PDF excluyen navegación, botones, banner de entorno y mensajes técnicos.

## Pruebas TDD requeridas después de aprobación

- prueba roja por cada cálculo, filtro temporal y dato excluido;
- RPT-02 rechaza payload desconocido sin mostrar JSON;
- RPT-03 no mezcla `clientId` ni exporta una sección fallida;
- vacío válido se diferencia de error y de versión no soportada;
- doble click no genera dos descargas;
- PDF e impresión comparten el mismo modelo aprobado;
- teclado, alternativa textual y viewport 320 px.
