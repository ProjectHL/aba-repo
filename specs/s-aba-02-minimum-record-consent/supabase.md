# S-ABA-02 / Supabase y PostgreSQL

Estado: **schema/RLS/RPC implementados y verificados en `ABA_staging`; producción bloqueada**

## Estado actual

`clients`, `guardians` y `siblings` persisten la ficha base. Motivo de consulta vive en
`assessments.payload`. Contexto hogar/colegio e historia estructurada no tienen persistencia
aprobada; consentimiento tampoco. S-ABA-02 no modifica ese estado por sí sola.

## Modelo candidato

- `client_context_profiles`: una versión por estudiante para contexto opcional.
- `clinical_history_entries`: entrada tipada, descriptor, fechas, estado, versión y
  `supersedes_id`; columnas específicas de medicación minimizadas.
- `consent_records`: estudiante, finalidad, versión del aviso, otorgante descrito, canal, referencia
  opaca, vigencia y estado.
- `consent_events`: transiciones append-only con actor y timestamp.

Todas incluyen `organization_id`, `client_id`, auditoría temporal y `test_run_id`. No incluyen
nombre, RUT, domicilio, teléfono, correo, archivo o firma.

## RLS candidata

- Requiere membresía y asignación activas de S-ABA-01.
- Supervisor: SELECT/INSERT y corrección versionada.
- Coordinador: SELECT; escritura sólo con grant `student.edit` que cubra la sección.
- Terapeuta: SELECT de expediente mínimo; consentimiento sólo como estado aplicable, sin referencia.
- Familia y `anon`: cero acceso directo a estas tablas.
- Sin UPDATE destructivo ni DELETE ordinario sobre historia/consentimiento.
- Las transiciones sensibles pasan por una frontera transaccional auditada.

## Pruebas futuras obligatorias

1. Miembro no asignado obtiene cero filas.
2. Grant de estudiante A no escribe en B.
3. Terapeuta no lee referencia/otorgante de consentimiento.
4. Familia obtiene cero filas crudas.
5. Corrección conserva versión previa.
6. Revocación conserva consentimiento previo y cambia sólo uso futuro de esa finalidad.
7. Membresía inactiva corta acceso con token vigente.
8. No hay grants/policies DELETE ordinarios ni Storage creado.
