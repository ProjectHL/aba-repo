# Slice 02 / Supabase: Auth, esquema y RLS

## Estado

Implementada y verificada el 2026-08-18 en `ABA_staging` (`arfwuctpwnnuhdgjtxaa`) mediante MCP y E2E real. Existen dos organizaciones activas, tres identidades automatizadas y una identidad manual sintética; el proyecto anterior quedó intacto.

Test remoto vigente: `eeeeeeee-2026-4818-8818-eeeeeeeeeeee`. Los dos clientes creados durante el recorrido quedaron `archived`; no se eliminó ningún registro.

## Objetivo

Definir una base reproducible para autenticación y Clientes multi-organización, protegida por grants mínimos y RLS verificable.

## Modelo propuesto

| Tabla | Columnas relevantes | Restricciones/índices |
| --- | --- | --- |
| `organizations` | `id`, `name`, timestamps | PK `id` |
| `memberships` | `organization_id`, `user_id`, `role` | PK/unique compuesto; índice por usuario |
| `clients` | `id`, `organization_id`, `clinical_id`, `initials`, `primary_language`, `birth_date`, `status`, timestamps | unique propuesto por organización/ID; índice organización/estado |
| `guardians` | `id`, `client_id`, `initials`, `birth_date` opcional, `position` | índice FK `client_id` |
| `siblings` | `id`, `client_id`, datos mínimos opcionales, `position` | índice FK `client_id` |
| `audit_events` | actor, organización, entidad, acción, timestamp | índices por organización/fecha y entidad |

P-01 a P-06 están aprobadas. Los cuatro campos básicos de Cliente serán no nulos; las relaciones familiares permanecen opcionales. Longitudes y normalización se fijarán mediante pruebas de contrato antes de escribir la migración.

## Superficie de API

- Usar tablas y RPC en `public`, ya expuesto por Data API, con grants explícitos mínimos; mantener helpers internos en `private`.
- RLS en cada tabla expuesta, aunque los grants estén restringidos.
- Grants y RLS se tratan como capas distintas y se prueban de forma independiente.
- Las tablas nuevas no se consideran expuestas automáticamente; todo acceso se concede explícitamente.
- No depender de GraphQL ni de OpenAPI obtenible con clave pública.

## Matriz RLS propuesta

| Recurso | `SELECT` | `INSERT` | `UPDATE` | `DELETE` |
| --- | --- | --- | --- | --- |
| organizaciones | membresía propia | ninguno desde cliente | ninguno en Slice 02 | ninguno |
| memberships | membresía propia | ninguno en Slice 02 | ninguno en Slice 02 | ninguno |
| clients | misma organización | misma organización + rol permitido | misma organización + rol permitido | ninguno |
| guardians/siblings | organización del cliente padre | misma organización + rol permitido | misma organización + rol permitido | ninguno |
| audit_events | ninguno desde cliente en Slice 02 | inserción controlada por triggers privados | ninguno | ninguno |

## Reglas de políticas

- Usar `TO authenticated` junto con predicado de autorización; nunca como control único.
- Usar `(select auth.uid())` donde sea estable por sentencia.
- Indexar columnas usadas por políticas y claves foráneas consultadas.
- `UPDATE` requiere política `SELECT`, `USING` y `WITH CHECK`.
- No usar `raw_user_meta_data` para autorización.
- Evitar `SECURITY DEFINER`; si se autoriza una excepción, ubicarla fuera de esquemas expuestos, revocar ejecución pública y probarla.
- Toda vista expuesta debe respetar RLS con `security_invoker = true` cuando corresponda.

## Migraciones

1. Confirmar versión de CLI con `--version` y descubrir comandos con `--help`.
2. Crear cada archivo con `supabase migration new`; no inventar nombres.
3. Iterar únicamente en entorno local/staging autorizado.
4. Ejecutar advisors y pruebas RLS.
5. Generar y revisar una migración limpia.
6. Versionar migraciones y tipos dentro del workspace.

## Operación atómica requerida por Frontend

- Exponer una única operación `public.create_client` con seguridad de invocador.
- Recibir el contrato aprobado de alta y derivar la organización desde la membresía del usuario; no aceptar un `organization_id` autoritativo enviado por el cliente.
- Insertar cliente, tutores —incluida su fecha de nacimiento opcional— y hermanos en la misma transacción; triggers privados incorporan los eventos de alta, actualización y archivado sin payload clínico.
- Mantener `public.create_client` como `SECURITY INVOKER`. La única excepción `SECURITY DEFINER` permitida es el trigger privado de auditoría, con `search_path` vacío y sin ejecución pública.
- Traducir la restricción organización/ID clínico a un conflicto estable sin revelar filas ajenas.
- La firma exacta se congela junto con los tipos generados antes de iniciar integración Frontend.

## Pruebas obligatorias

1. Miembro A crea y lista dentro de su organización.
2. Miembro B no lee, actualiza ni infiere registros de A.
3. Usuario autenticado sin membresía no accede.
4. Rol anónimo no accede a tablas de dominio.
5. `organization_id` no puede reasignarse mediante update.
6. Grants ausentes bloquean objetos aunque una política RLS exista.
7. RLS bloquea filas aunque el rol tenga grant sobre la tabla.
8. Las consultas críticas se revisan con `EXPLAIN` antes de optimizar índices adicionales.
9. Un fallo de familiar o auditoría revierte toda la creación atómica.

## Criterios de aceptación

- Migraciones reproducibles, advisors sin hallazgos críticos y pruebas de aislamiento verdes.
- Sin política de borrado ni SQL destructivo.
- Sin secretos o datos reales en fixtures, logs o archivos.
- Cambios recientes de Data API documentados en la evidencia de prueba.
