# Matriz de conexiones pantalla ↔ Supabase

Fecha de corte: 2026-08-18  
Proyecto: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)

## Convención

- **Conectado:** tabla, grants y RLS existen en staging.
- **Contrato listo:** puerto frontend definido; falta persistencia.
- **Esquema pendiente:** todavía no existe objeto remoto.

| Pantalla | Lectura | Escritura | Estado |
| --- | --- | --- | --- |
| Listado de clientes | `clients` | — | Conectado |
| Alta de cliente | `create_client` RPC | cliente + familia atómica | Conectado |
| Información general | `clients` | `clients` update futuro | Lectura conectada |
| Tutores y hermanos | `guardians`, `siblings` | update futuro | Lectura conectada |
| Entrevista inicial | `assessments` | `assessments` | Conectado desde frontend |
| Preferencias | `assessments` | `assessments` | Conectado desde frontend |
| Evaluación funcional / ABC | `assessments` | `assessments` | Conectado desde frontend |
| Programas y metas | `acquisition_programs`, `acquisition_goals` | mismas tablas | Conectado desde frontend |
| Conductas e intervención | `behavior_plans` | `behavior_plans` | Conectado desde frontend |
| Sesiones y mediciones | `clinical_sessions`, mediciones y ensayos | `create_clinical_session` + lectura directa con RLS | Conectado desde frontend; alta atómica verificada |
| Informes | `clinical_sessions`, `session_behavior_measurements`, `session_acquisition_trials` | no aplica | Conectado desde frontend; composición derivada, sin tabla nueva |

## Estado de seguridad observado

Las catorce tablas públicas tienen RLS. `anon` no posee grants. `authenticated` tiene sólo
los permisos necesarios por recurso y las políticas filtran membresía activa/organización. El único
advisor de seguridad vigente es la protección de contraseñas filtradas deshabilitada; no bloquea la
producción de pantallas, pero debe resolverse antes del QA final.
