# S-ABA-01 / Supabase y PostgreSQL

Estado: **implementado y verificado en Supabase `ABA_staging`; producción bloqueada**

## Brecha existente

Las políticas actuales exigen `memberships.status = 'active'`, pero autorizan lectura por
organización y escritura a `admin|clinician`. No distinguen supervisor, coordinador, terapeuta o
familia, ni una asignación por estudiante, ni un grant por recurso/acción. Por tanto, no satisfacen
S-ABA-01 y no deben reutilizarse como si lo hicieran.

## Modelo relacional candidato

### `student_assignments`

- `id uuid` PK
- `organization_id uuid` y `student_id uuid`
- `user_id uuid`
- `role text`: `supervisor|coordinator|therapist|family`
- `is_primary boolean` sólo aplicable a supervisor
- `status text`: `active|inactive`
- `effective_at timestamptz`, `ended_at timestamptz null`
- `created_at`, `created_by`, `test_run_id`

Invariantes candidatas: una sola asignación primaria activa por estudiante; unicidad de asignación
activa por estudiante/usuario/rol; organización coherente con el estudiante; cierre lógico, nunca
DELETE de uso ordinario.

### `student_authorization_requests`

- `id`, `organization_id`, `student_id`, `requester_assignment_id`
- `resource_type`, `requested_actions text[]`, `reason`
- `status`: `pending|approved|denied`
- timestamps y `test_run_id`

### `student_authorization_decisions`

- `id`, `request_id`, `decider_assignment_id`
- `decision`: `approved|denied|revoked|expired`
- `granted_actions text[]`, `effective_at`, `expires_at`, `created_at`
- `supersedes_decision_id null`, `test_run_id`

Las decisiones son append-only. El estado efectivo se deriva de la última transición válida, no se
sobrescribe un historial. El mecanismo concreto para materializar expiración queda para TDD.

## Política RLS candidata

Toda tabla clínica por estudiante debe verificar, como mínimo:

1. membresía activa en la organización del estudiante;
2. asignación activa al estudiante;
3. acción permitida por rol base o por grant vigente;
4. coherencia `resource.client_id = student_id` para recursos hijos.

Reglas adicionales:

- SELECT de solicitudes/decisiones: solicitante y supervisor principal del mismo estudiante.
- INSERT de solicitud: coordinador activo, sólo por sí mismo y sobre estudiante asignado.
- Decisión/revocación: sólo supervisor principal activo, mediante frontera transaccional auditada.
- Familia no recibe SELECT directo sobre tablas clínicas crudas; consume una proyección minimizada
  que S-ABA-02 deberá definir.
- `anon` obtiene cero acceso; `authenticated` por sí solo nunca es condición suficiente.
- No usar `user_metadata`, claims editables ni `service_role` del navegador.

## Compatibilidad y migración pendiente

Los roles existentes `admin|clinician|viewer` no tienen equivalencia demostrada. Antes de cambiar
RLS se requiere inventario sintético y una tabla de mapeo aprobada. La migración debe introducir la
nueva frontera en modo deny-by-default y demostrar que ningún usuario hereda acceso organizacional
accidental. No se propone hacer ese cambio en este documento.

## Auditoría mínima candidata

Registrar sin payload clínico: actor, estudiante, recurso, acción solicitada, decisión, grant
efectivo, timestamp, correlation ID y resultado. Lecturas clínicas requieren el ledger definido por
Slice 03; esta spec sólo exige auditoría de solicitudes, decisiones y revocaciones.

## Pruebas RLS obligatorias antes de aprobación técnica

1. Mismo usuario, misma organización, estudiante no asignado: cero filas.
2. Usuario asignado a A: cero filas y mutaciones sobre B.
3. Terapeuta asignado: puede capturar/enviar, no configurar ni editar programas.
4. Coordinador sin grant: lee recursos base, no edita.
5. Grant `program.edit`: sólo programa/estudiante concedidos.
6. Grant vencido o revocado con token vigente: mutación denegada.
7. Familia: cero SELECT sobre sesiones, ensayos, mediciones, evaluaciones y notas crudas.
8. Usuario con membresía inactiva: cero acceso aun con asignación/grant activos.
9. Concurrencia: una solicitud pendiente equivalente y una decisión efectiva.
10. No existen políticas DELETE ordinarias para asignaciones, solicitudes o decisiones.
