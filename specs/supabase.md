# Especificación de Supabase

## Estado

Implementación de staging iniciada el 2026-08-18 sobre el proyecto exclusivo `ABA_staging` (`arfwuctpwnnuhdgjtxaa`). Producción permanece fuera de alcance.

## Objetivo

Proveer autenticación y persistencia PostgreSQL multiusuario para datos sintéticos de staging, con RLS verificable y migraciones reproducibles.

## Decisiones de plataforma

- Usar Supabase administrado inicialmente; no asumir self-hosting.
- Usar Node.js 22+ y TypeScript 5+ para evitar deprecaciones anunciadas.
- Exponer al Data API únicamente las tablas necesarias y mediante `GRANT` explícito; las tablas nuevas ya no deben asumirse expuestas automáticamente.
- Activar RLS en cada tabla expuesta.
- Usar clave publicable en clientes y nunca exponer secret/service-role keys.

## Modelo inicial propuesto

| Tabla | Propósito | Claves principales |
|---|---|---|
| `organizations` | Límite de aislamiento del equipo | `id`, `name`, timestamps |
| `memberships` | Relación usuario-organización y rol | `organization_id`, `user_id`, `role` |
| `clients` | Perfil mínimo observado | `id`, `organization_id`, `clinical_id`, `initials`, `primary_language`, `birth_date`, status, timestamps |
| `guardians` | Tutores del cliente | `id`, `client_id`, initials/birth_date opcionales, position |
| `siblings` | Hermanos del cliente | `id`, `client_id`, initials/birth_date opcionales, position |
| `audit_events` | Trazabilidad sin payload clínico | actor, organization, entity type/id, action, timestamp |

Los nombres y campos opcionales son hipótesis hasta confirmar el video. `clinical_id` debe ser único dentro de la organización, no global, sujeto a aprobación.

## RLS

- Políticas con `TO authenticated` y predicado de membresía/organización; `TO authenticated` por sí solo está prohibido.
- `SELECT`, `INSERT`, `UPDATE` se especifican por separado.
- `UPDATE` exige `USING` y `WITH CHECK`, además de una política `SELECT` compatible.
- No usar `raw_user_meta_data` para autorización; los roles viven en tabla controlada o `app_metadata` con consideración de refresco de JWT.
- Evitar `SECURITY DEFINER`; si fuera imprescindible, mantener la función fuera de esquemas expuestos, revocar `EXECUTE` público y agregar prueba de autorización.
- Las vistas expuestas deben usar `security_invoker = true` en PostgreSQL compatible.

## Índices iniciales

- Índices en todas las claves foráneas usadas por políticas y joins.
- Índice compuesto/único `(organization_id, clinical_id)`.
- Índices que soporten `memberships(user_id, organization_id)` y consultas de clientes por organización/estado.
- Verificar con `EXPLAIN` y advisors; no agregar índices especulativos sin consulta asociada.

## Migraciones

1. Crear migraciones con la CLI, nunca inventar nombres manualmente.
2. Iterar primero en entorno local/staging autorizado.
3. Ejecutar advisors, revisar RLS y generar la migración limpia.
4. Versionar migraciones y tipos generados dentro de `aba 2`.
5. No aplicar cambios a producción sin aprobación explícita.

## Datos de prueba

- Sólo fixtures sintéticos, identificados con `test_run_id` y organización de staging.
- Dado que la política del proyecto prohíbe borrar registros, las pruebas no ejecutan `DELETE`; marcan datos como archivados o usan identificadores únicos.
- Ningún entorno público contiene datos reales de clientes, menores o salud.

## Pruebas obligatorias

1. Usuario A puede crear/listar registros de su organización.
2. Usuario B de otra organización obtiene cero filas y no puede actualizar ni insertar para A.
3. Un usuario autenticado sin membresía no accede a clientes.
4. El rol anónimo no puede leer ni escribir tablas de dominio.
5. Las actualizaciones no pueden cambiar `organization_id` o apropiarse de filas.
6. Grants del Data API y políticas RLS se verifican como controles independientes.

## Cambios recientes considerados

- Las tablas nuevas pueden no exponerse automáticamente al Data API, por lo que los grants serán explícitos.
- No depender de GraphQL ni de introspección automática.
- No fijar versiones de extensiones en SQL salvo necesidad documentada.
