# Slice 13 / Backend

## Contrato SDD

No se requiere NestJS para este slice. Las vistas consumen repositorios Supabase existentes. No se
crea endpoint de exportación server-side: el PDF es local y bajo demanda.

Si una decisión futura exige edición, auditoría de corrección, Storage o exportación server-side,
debe abrirse una spec independiente antes de añadir API.

## Contratos de datos

- La sesión recibe valores con dimensión explícita y no debe reinterpretar unidades en backend.
- El informe recibe datos ya filtrados por `client_id` y fecha; debe rechazar mezcla de clientes.
- El PDF no recibe DOB, tutores, notas clínicas ni adjuntos.
- Errores de autorización se normalizan a estado de sesión inválida; detalles internos nunca llegan a
  la UI.

Payload propuesto de medición:

```ts
type SessionBehaviorMeasurementDraft =
  | { behaviorPlanId: string; measurementUnit: "frequency"; value: number }
  | { behaviorPlanId: string; measurementUnit: "duration" | "latency"; value: number; unit: "seconds" }
  | { behaviorPlanId: string; measurementUnit: "interval"; observed: number; total: number }
```

`frequency` exige entero. `duration` y `latency` aceptan hasta dos decimales. `interval` exige
enteros y `observed <= total`. El contrato está pendiente de aprobación y no autoriza aún cambios
de RPC.

## Gate backend

TypeScript de contratos, pruebas de mapeo y pruebas de aislamiento deben pasar antes de que el
subagente frontend conecte nuevos controles.

## 13B.1 — contrato de entrevista

No se añade NestJS ni RPC. `AssessmentRepository.create` sigue siendo el puerto y envía un
`initial_interview` con `InitialInterviewPayloadV1` exactamente como se define en frontend. El
adaptador no convierte el array en texto ni añade nombres, correos o identificadores directos.
La respuesta remota continúa validándose como JSON y por `client_id`; el constructor de informes
13C será responsable de validar `schema_version` antes de interpretar el payload.

13B.2 contexto y 13B.3 historia no tienen contrato backend aprobado. No reutilizar
`assessments.payload` para esos módulos sin nueva decisión.
