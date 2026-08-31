# Slice 14 / Frontend

## Arquitectura común CF-01

Crear componentes de formulario sobre shadcn/ui, React Hook Form y Zod:

- `ClinicalFormDialog`: trigger con nombre específico, scroll, descripción y estado;
- `ClinicalFormStatus`: `idle | invalid | saving | saved | saved-stale | error | draft-ready`;
- `RepeatableSection`: filas con ID sólo de UI, añadir/quitar y orden estable;
- `FrontendDraftProvider`: memoria React por `clientId`, nunca almacenamiento del navegador;
- `ClinicalJourneyCompass`: módulos, estado y acción siguiente.

```ts
type ClinicalFormDialogProps<TValues, TPayload> = {
  title: string
  triggerLabel: `Ver formulario de ${string}`
  persistence: "remote" | "frontend-draft"
  defaultValues: TValues
  schema: ZodType<TValues>
  toPayload: (values: TValues) => TPayload
  onRemoteSave?: (payload: TPayload) => Promise<"saved" | "saved-stale">
  onDraftReady?: (payload: TPayload) => void
  onRetryRefresh?: () => Promise<boolean>
}
```

Las props son discriminadas en implementación: `remote` exige `onRemoteSave`; `frontend-draft`
exige `onDraftReady`. Nunca se admiten ambas callbacks ni ninguna.

`FrontendDraftProvider` vive bajo el proveedor de sesión autenticada y sobre las rutas privadas.
Mantiene `Record<clientId, {context, history}>`: cambiar A→B nunca copia datos; volver a A conserva
su draft mientras la misma app siga montada. Logout o remount destruye todos los drafts. No expone
un método de serialización.

Un error enfoca el resumen accesible. Un guardado remoto fallido conserva valores. Un
`saved-stale` confirma escritura y ofrece reintentar lectura sin duplicar. Un draft temporal usa
`Preparar borrador`, no `Guardar`.

### Máquina de estados CF-01

| Desde | Evento | Hacia | Efecto permitido |
| --- | --- | --- | --- |
| `idle` | submit inválido | `invalid` | enfocar resumen, cero escritura |
| `idle`/`invalid`/`error` | submit remoto válido | `saving` | deshabilitar submit duplicado |
| `saving` | escritura confirmada + refresh ok | `saved` | limpiar formulario remoto |
| `saving` | escritura confirmada + refresh falla | `saved-stale` | confirmar escritura; no duplicar |
| `saving` | escritura no confirmada | `error` | conservar valores |
| `saved-stale` | reintentar refresh | `saving` | sólo lectura, nunca repetir create |
| `idle`/`invalid` | preparar draft válido | `draft-ready` | escribir sólo en provider React |
| `draft-ready` | editar | `idle` | mantener valores, retirar estado listo |

`blocked` no forma parte de `ClinicalFormStatus`: es una capacidad sin formulario. `draft-ready`
permite usar `Continuar`, pero no equivale a guardado ni aprobación clínica. La navegación nunca se
bloquea por un módulo vacío o inválido: la brújula recomienda un orden, no impone una regla clínica.

### Validación sintética central

Crear `syntheticFreeTextSchema({label, max, required})` y reutilizarlo en todo texto libre,
incluidos arrays y `prescriberDescriptor`. Patrón mínimo común: correo y RUT chileno con/sin puntos
o guion. Mensaje exacto: `No ingreses RUT ni correos reales`. La prueba de contrato itera todos los
schemas CF-02–CF-06; no se duplican regex por formulario.

## Inventario autoritativo

| ID | Formulario | Campos/acciones | Persistencia | Estado actual | Cierre requerido |
| --- | --- | --- | --- | --- | --- |
| CF-02A | alta base | iniciales, ID, idioma, nacimiento, convivencia, tutores, hermanos | remote `create_client` | conectado | conservar |
| CF-02B | contexto hogar/colegio | adaptaciones hogar, escolarización, adaptaciones escolares | frontend-draft | ausente | formulario repetible/revisión |
| CF-03A | diagnósticos | etiqueta, fecha opcional | frontend-draft | tarjeta fija | añadir/quitar/revisar |
| CF-03B | evaluaciones históricas | nombre, fecha opcional | frontend-draft | tarjeta fija | añadir/quitar/revisar |
| CF-03C | operaciones/procedimientos | procedimiento, fecha opcional | frontend-draft | tarjeta fija | añadir/quitar/revisar |
| CF-03D | medicamentos | nombre, dosis, descriptor prescriptor, inicio, término | frontend-draft | tarjeta fija | añadir/quitar/revisar |
| CF-04 | entrevista inicial | cuatro campos base + informantes | remote assessment payload v1 | implementado | mantener y mostrar resumen |
| CF-05A | preferencias | fecha, tipo, alta/baja, respuesta, topografía, notas, archivo efímero | remote sin archivo | genérico | especializar y tipar |
| CF-05B | funcional | fecha, tipo, conducta, antecedente, consecuencia, función, topografía, archivo efímero | remote sin archivo | genérico | especializar y tipar |
| CF-06A | programa | nombre, descripción | remote | conectado | tipar/estandarizar estados |
| CF-06B | meta | programa, área, nombre, criterio, procedimiento, ayudas, respuesta, generalización, mantenimiento | remote; suplementos documentados | conectado | tipar y revisar payload |
| CF-06C | plan de conducta | conducta, definición, unidad, función, estrategias, línea base, fuente, nivel, intensidad | remote; suplementos documentados | conectado | tipar y revisar payload |
| CF-07 | sesión | fecha, notas sintéticas, frecuencia, duración, latencia, intervalo, ensayos | remote RPC atómica | implementado | mantener y añadir acción siguiente |
| CF-08A | consentimiento | estado y explicación | blocked | ausente | tarjeta no editable |
| CF-08B | usuarios asignados | lista/roles | blocked | ausente | tarjeta no editable |

## Contratos de draft frontend

```ts
type ClientContextDraft = {
  homeAdaptations: string
  schooling: string
  schoolAdaptations: string
}

type ClinicalHistoryDraft = {
  diagnoses: Array<{ uiId: string; label: string; occurredOn: string }>
  historicalAssessments: Array<{ uiId: string; name: string; occurredOn: string }>
  procedures: Array<{ uiId: string; procedure: string; occurredOn: string }>
  medications: Array<{
    uiId: string
    name: string
    dose: string
    prescriberDescriptor: string
    startedOn: string
    endedOn: string
  }>
}
```

`uiId` no sale del proceso React. Texto máximo: contexto 2000, escolarización 500, etiqueta/nombre/
procedimiento 200, dosis 120, descriptor 120. Fechas no futuras; término no anterior a inicio.
Todos los campos son opcionales salvo el descriptor principal de una fila que el usuario añadió.

## Payloads remotos CF-05

```ts
type PreferenceAssessmentPayloadV1 = {
  schema_version: 1
  assessment_type: string
  highest_preference: string
  response?: string
  lowest_preference?: string
  topography?: string
  notes?: string
}

type FunctionalAssessmentPayloadV1 = {
  schema_version: 1
  assessment_type?: string
  target_behavior: string
  antecedent?: string
  consequence?: string
  hypothesized_function?: string
  topography?: string
}
```

`occurredOn` pertenece a `CreateAssessmentDraft`, no se duplica dentro del payload. Archivo y nombre
de archivo no forman parte del payload. `assessment_type` y `highest_preference` son requeridos en
preferencias; `target_behavior` es requerido en funcional. El resto es opcional porque el video no
confirma obligatoriedad.

## Contratos CF-06

Los puertos existentes son autoritativos. Los campos complementarios siguen documentados dentro de
`teachingProcedure` u `operationalDefinition` con etiquetas estables hasta una futura migración.
La UI debe mostrar esa limitación y un resumen antes de enviar; no puede presentarlos luego como
columnas persistidas independientes.

## Estados y acciones

| Estado | Remote | Frontend draft | Blocked |
| --- | --- | --- | --- |
| vacío | instrucción y trigger | instrucción y trigger | explicación |
| inválido | resumen + campos | resumen + campos | n/a |
| procesando | `Guardando…` | `Preparando…` | n/a |
| éxito | `Guardado en staging con RLS` | `Borrador temporal listo` | n/a |
| error | error recuperable, valores intactos | error local, valores intactos | n/a |
| reload | carga desde repo | se pierde con advertencia | no cambia |

## Navegación CF-08

La ficha muestra una brújula con orden recomendado, no una regla clínica:

1. Información/contexto/historia.
2. Evaluación conductual.
3. Programas de adquisición.
4. Reducción de conductas.
5. Sesión.
6. Informes.

Cada acción `Continuar` cambia pestaña o navega a una ruta existente, conserva `clientId` y no marca
el módulo como clínicamente terminado. `Completo` sólo significa formulario válido/persistido según
su tipo; nunca aprobación profesional.

Contrato exacto:

```ts
type ClinicalJourneyStep = {
  id: "information" | "assessment" | "acquisition" | "reduction" | "sessions" | "reports"
  label: string
  capability: "remote" | "frontend-draft" | "mixed" | "blocked"
  next:
    | { kind: "tab"; tab: WorkspaceTab }
    | { kind: "route"; to: string }
    | null
}
```

| Paso | Acción exacta | Destino | Vacío/draft/error |
| --- | --- | --- | --- |
| `information` | `Continuar a Evaluación` | tab `assessment` | siempre habilitada |
| `assessment` | `Continuar a Adquisición` | tab `acquisition` | siempre habilitada |
| `acquisition` | `Continuar a Reducción` | tab `reduction` | siempre habilitada |
| `reduction` | `Continuar a Sesiones` | tab `sessions` | siempre habilitada |
| `sessions` | `Continuar a Informes` | `/informes?client=<clientId>` | siempre habilitada, ID codificado con URLSearchParams |
| `reports` | ninguna | `null` | n/a |

El mapa es una constante de dominio frontend, no se calcula desde estado remoto. Contexto/historia,
consentimiento y acceso viven dentro de `information` y no agregan pasos propios.

## Serialización exacta CF-06

El valor primario se conserva primero. Cada suplemento no vacío se añade en este orden, separado
por dos saltos de línea antes del bloque y uno entre líneas, con formato `Etiqueta: valor`:

- meta: `Desvanecimiento de ayudas`, `Respuesta correcta`, `Generalización`, `Mantenimiento`;
- plan: `Línea base`, `Fuente de línea base`, `Nivel actual`, `Intensidad`.

No se emiten etiquetas vacías, espacios finales ni un bloque suplementario vacío. Pruebas snapshot
del mapper fijan orden y delimitadores.

## Accesibilidad y responsive

- Trigger único: `Ver formulario de <nombre>`.
- Diálogo cierra con Escape y devuelve foco.
- Añadir/quitar filas con botones nombrados; no depender de color/icono.
- 320 px sin scroll horizontal del viewport; tablas se convierten en tarjetas o scroll propio.
- Errores usan `role=alert`; confirmaciones `role=status`.
- No borrar una fila con valores sin confirmación local explícita.

## Pruebas TDD por lote

- CF-01: máquina de estados y foco.
- CF-02/03: draft sobrevive a pestañas, se pierde en remount y nunca llama repositorio.
- CF-03: quitar fila B no altera A/C; fechas de medicamento válidas.
- CF-05: payload v1 excluye archivo y fecha se mapea a `occurredOn`.
- CF-06: mapper conserva etiquetas complementarias y relación programa→meta.
- CF-07: regresión de cuatro dimensiones y atomicidad.
- CF-08: cada `Continuar` preserva cliente y estado; blocked no ofrece guardar.
- CF-01 privacidad: draft A no aparece en B; volver a A conserva A; logout/remount borra ambos.
