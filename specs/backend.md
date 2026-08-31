# Especificación de backend NestJS

## Estado

Diferida como arquitectura de crecimiento desde 2026-08-18. No se implementa en Slice 02. La spec vigente está en `specs/growth/nestjs-api.md`.

## Objetivo

Proveer una API autenticada y auditable para clientes y relaciones familiares, manteniendo las reglas de dominio fuera de la interfaz y preservando RLS de Supabase.

## Arquitectura

- Ubicación futura: `apps/api`.
- NestJS modular: `auth`, `clients`, `family-members`, `health` y `audit`.
- DTOs derivados de esquemas compartidos en `packages/contracts`.
- La API valida el JWT de Supabase y crea un cliente Supabase por solicitud con el token del usuario; las consultas de dominio conservan el contexto RLS.
- No utilizar `service_role` para operaciones normales de usuario.
- Cualquier proceso privilegiado futuro requiere una especificación, rol y prueba separados.

## API del primer corte

| Método | Ruta | Resultado | Autorización |
|---|---|---|---|
| `GET` | `/health` | Estado sin datos sensibles | pública, sin detalles internos |
| `GET` | `/v1/clients` | Clientes visibles para el usuario | autenticada + RLS |
| `POST` | `/v1/clients` | Crea cliente y familiares de forma atómica | autenticada + RLS |
| `GET` | `/v1/clients/:id` | Cliente visible | autenticada + RLS; pendiente de pantalla |

No se implementan `DELETE` ni borrado físico. Una eventual baja será un cambio de estado aprobado y auditado.

## Contrato de creación

- `clientInitials`, `clinicalId`, `primaryLanguage`, `birthDate`.
- `age` no se acepta como dato autoritativo: se calcula para visualización y puede recalcularse.
- `guardians[]`, `siblings[]` y `livingArrangement` permanecen opcionales hasta confirmar reglas.
- Respuestas de error no revelan existencia de registros fuera del alcance del usuario.

## Reglas operativas

- Validación estricta y rechazo de propiedades desconocidas.
- OpenAPI generado y comparado contra los esquemas compartidos.
- CORS limitado al origen de staging/producción configurado.
- Logs estructurados sin iniciales, fechas de nacimiento, IDs clínicos ni payloads completos.
- Correlation ID por solicitud; auditoría de creación y actualización con identificadores internos.
- Límites de tamaño y rate limiting antes de publicación.

## TDD y pruebas

1. Unitarias para cálculo/reglas puras y mapeo de DTOs.
2. Integración para transacción cliente + familiares.
3. E2E autenticada para creación y listado.
4. Prueba negativa: usuario de otra organización no puede consultar ni inferir un registro.
5. Prueba de contrato frontend/API.
6. Prueba de logs para garantizar ausencia de datos sensibles.

## Definition of done

Pruebas verdes, contrato versionado, RLS verificada, OpenAPI generado, ausencia de secretos en cliente y smoke test desde el frontend de staging.
