# Spec de crecimiento: API NestJS

## Estado

Planificada y diferida. No forma parte de Slice 02 ni autoriza crear `apps/api`, infraestructura o credenciales.

## Propósito

Introducir una capa API NestJS cuando el crecimiento del producto haga insuficiente la arquitectura React → Supabase Auth/Data API/RPC. Su incorporación debe preservar las pantallas y contratos de dominio mediante el patrón `ClientsRepository`.

## Disparadores de adopción

Se abre una nueva slice NestJS únicamente cuando se cumpla al menos uno de estos criterios y exista evidencia:

1. Más de un consumidor estable: web, móvil, integraciones o API de terceros.
2. Integraciones externas que requieren secretos, webhooks o firma de solicitudes.
3. Procesos prolongados: generación masiva de informes, colas o trabajos programados.
4. API pública/versionada con cuotas, rate limiting y compatibilidad contractual.
5. Reglas de dominio transaccionales que ya no son mantenibles con RPC y RLS.
6. Requisitos de observabilidad, auditoría o cumplimiento que exijan un límite de servicio centralizado.

No se adopta NestJS sólo para ocultar una clave publicable o por preferencia tecnológica.

## Arquitectura futura

```text
React → ClientsRepository HTTP → NestJS → Supabase con JWT del usuario → RLS
                                   └── workers/colas/integraciones autorizadas
```

- NestJS valida JWT mediante JWKS y conserva el contexto del usuario.
- Operaciones ordinarias no usan `service_role`.
- RLS permanece activa como defensa en profundidad.
- Procesos privilegiados requieren una spec, identidad técnica, alcance y pruebas independientes.

## Estrategia de migración

1. Mantener modelos de UI separados del transporte.
2. Congelar contratos de dominio y casos de error actuales.
3. Implementar un adaptador HTTP junto al adaptador Supabase.
4. Ejecutar las mismas contract tests contra ambos adaptadores.
5. Migrar una operación idempotente primero.
6. Migrar escrituras sólo después de equivalencia de autorización y auditoría.
7. Retirar un adaptador únicamente mediante deprecación documentada; no borrar archivos o datos.

## Módulos previstos

- `auth-context`
- `clients`
- `audit`
- `reports`
- `integrations`
- `health`

## Controles mínimos

- ValidationPipe estricto y OpenAPI versionado.
- CORS por allowlist exacta.
- Logs sin datos clínicos ni payloads.
- Correlation ID, rate limiting y health checks.
- Pruebas de aislamiento equivalentes a RLS.
- Dependencias fijadas y secretos sólo en runtime seguro.

## Fuera de alcance actual

- Scaffold de `apps/api`.
- Hosting Node.
- Service role o conexión directa privilegiada.
- Reemplazar Supabase Auth, Postgres o RLS.

## Definition of ready futura

- Disparador documentado con evidencia.
- ADR que compare RPC/Edge Functions/NestJS.
- Contratos y consumidores identificados.
- Presupuesto operativo y proveedor autorizados.
- Plan TDD y migración reversible aprobados.

