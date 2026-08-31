# Slice 09 / Supabase staging

## Inventario validado el 2026-08-18

| Recurso | Estado | Uso frontend |
| --- | --- | --- |
| `clients` | conectado, RLS, SELECT/INSERT/UPDATE autenticado | ficha y listado |
| `guardians` | conectado, RLS, SELECT/INSERT/UPDATE autenticado | contexto familiar |
| `siblings` | conectado, RLS, SELECT/INSERT/UPDATE autenticado | contexto familiar |
| `organizations` | conectado, RLS, SELECT autenticado | contexto de tenant |
| `memberships` | conectado, RLS, SELECT propio | autorización |
| `audit_events` | interno, sin grants cliente | auditoría |
| evaluaciones | conectado con RLS | repositorio activo |
| programas/metas | conectado con RLS | repositorio activo |
| conductas/intervenciones | conectado con RLS | repositorio activo |
| sesiones/mediciones | conectado con RLS y RPC atómica | repositorio activo |
| reportes | derivado, sin tabla en esta fase | composición frontend |

## Reglas para tablas nuevas

- Crear sólo en `ABA_staging` (`arfwuctpwnnuhdgjtxaa`).
- RLS obligatoria y grants explícitos; no depender de exposición automática del Data API.
- Aislamiento por organización derivado mediante el cliente padre.
- `SELECT` para miembros activos; escritura sólo `admin` y `clinician` activos.
- Sin `DELETE`; archivado o versionado no destructivo.
- `UPDATE` debe tener política SELECT, `USING` y `WITH CHECK`.
- No usar metadata editable del usuario para autorización.
- Mantener auditoría sin payload clínico.

## Hallazgo de plataforma

Supabase dejará de exponer automáticamente tablas nuevas al Data API. Cada migración debe incluir
sus `GRANT` mínimos además de RLS y políticas.

## Estado de implementación

- `clinical_workspace_foundation` aplicada en staging el 2026-08-18.
- `clinical_fk_covering_indexes` aplicada después de revisar Performance Advisor.
- Ocho tablas nuevas con RLS; `anon` sin lectura y auditoría clínica sin grants de cliente.
- Conexión RLS verificada mediante un borrador sintético posteriormente archivado.
- Auditoría verificada: evento `created`, evento `archived` y actor autenticado.
- Repositorios frontend de evaluaciones, programas, metas, planes y sesiones conectados.
- `create_clinical_session` verificada como `SECURITY INVOKER`, sin ejecución para `PUBLIC` ni
  `anon`, y con ejecución exclusiva para `authenticated`.
- El contrato SQL repetible está versionado en `supabase/tests/003_atomic_clinical_session.sql`.

## Contrato del lote 03

- `acquisition_programs`: SELECT e INSERT desde el repositorio clínico autenticado.
- `acquisition_goals`: SELECT e INSERT; `program_id` debe pertenecer al mismo `client_id`.
- `behavior_plans`: SELECT e INSERT con unidad de medición controlada por el frontend.
- Todas las respuestas remotas se validan antes de convertirse al modelo de dominio.
- Un error de sesión invalida el estado Auth global; los demás errores permanecen genéricos en UI.
- No se añade DELETE ni se modifica el esquema remoto en este lote.

## Contrato del lote 04

- RPC única `create_clinical_session` con `SECURITY INVOKER` para conservar RLS.
- Revocar `EXECUTE` a `PUBLIC` y `anon`; concederlo sólo a `authenticated`.
- Insertar `clinical_sessions`, `session_behavior_measurements` y `session_acquisition_trials`
  dentro de la misma transacción implícita de la función.
- Rechazar arreglos mal formados, IDs duplicados, valores negativos y payload completamente vacío.
- Las claves compuestas existentes deben impedir mezclar sesión, plan, meta o cliente de otro tenant.
- Cualquier excepción debe revertir la cabecera y todos sus registros hijos.
- No se añade DELETE; la sesión queda `completed` y sólo puede archivarse mediante UPDATE futuro.

## Contrato del lote 05A

- No hay migración: `reportes` sigue siendo derivado y sin tabla.
- El repositorio puede hacer `SELECT` sobre `clinical_sessions`,
  `session_behavior_measurements` y `session_acquisition_trials`, todos ya sujetos a RLS por
  `client_id` y membresía activa.
- Cada consulta fija `client_id`, excluye sesiones archivadas y filtra por `occurred_on` de forma
  inclusiva cuando se proporciona un rango.
- Las respuestas se validan con esquemas de dominio antes de agregarse. Una fila cuyo `client_id`
  no coincida se descarta y provoca error de contrato en vez de aparecer en un informe.
- No se agregan grants, políticas, funciones ni recursos remotos nuevos.

## Compatibilidad de respuesta (2026-08-24)

- El Data API de staging devolvió `updated_at` como `timestamptz` PostgreSQL con separador de
  espacio y offset `+00`. Es una respuesta válida del contrato remoto; los consumidores frontend
  deben validarla como timestamp interpretable y no exigir exclusivamente el literal ISO con `T`.
- No se cambió el esquema, las políticas, grants, funciones ni datos existentes para esta
  compatibilidad.
