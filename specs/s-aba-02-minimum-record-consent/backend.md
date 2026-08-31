# S-ABA-02 / Backend y dominio

Estado: **puertos Supabase implementados; producción bloqueada**

## Responsabilidad

Validar payloads, capacidades S-ABA-01, coherencia del estudiante y transiciones append-only. El
backend no interpreta diagnósticos, dosis, capacidad del otorgante ni validez jurídica.

## Contratos candidatos

~~~ts
type HistoricalEntryKind = "reported_diagnosis" | "assessment" | "procedure" | "medication"

type HistoricalEntry = {
  id: string
  studentId: string
  kind: HistoricalEntryKind
  descriptor: string
  occurredOn?: string
  status: "active" | "superseded" | "entered_in_error"
  supersedesId?: string
  medication?: { dose?: string; prescriberDescriptor?: string; startedOn?: string; endedOn?: string }
}

type ConsentRecord = {
  studentId: string
  purposeCode: string
  noticeVersion: string
  grantorDescriptor: string
  channel: string
  evidenceReference?: string
  status: "pending_review" | "valid" | "revoked" | "expired" | "superseded"
  effectiveAt?: string
  expiresAt?: string
}
~~~

## Reglas

1. `studentId` y organización se derivan/validan autoritativamente.
2. Cada lectura/escritura evalúa S-ABA-01; el cliente no declara su rol.
3. Descriptores no vacíos; fechas ISO no futuras cuando representan hechos históricos.
4. `endedOn >= startedOn` cuando ambas existen.
5. Corrección exige referencia a una entrada del mismo estudiante y tipo.
6. Una transición de consentimiento no actualiza ni borra la anterior.
7. Sólo una versión `valid` efectiva por estudiante/finalidad/instante.
8. `evidenceReference` es opaca, no una URL pública, secreto, token o binario.
9. Error de auditoría revierte la mutación.

## Errores normalizados

`STUDENT_NOT_FOUND`, `ACTION_NOT_ALLOWED`, `INVALID_RECORD_ENTRY`,
`HISTORY_VERSION_CONFLICT`, `INVALID_CONSENT_TRANSITION`, `CONSENT_VERSION_CONFLICT`.

## Criterios

- No se mezcla historia entre estudiantes.
- Reintentos idempotentes no duplican entradas/transiciones.
- Una corrección concurrente detecta versión obsoleta.
- Logs contienen IDs técnicos y acción, nunca descriptor clínico, dosis ni referencia de evidencia.
