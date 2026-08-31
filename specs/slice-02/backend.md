# Slice 02 / Backend: API NestJS de Clientes

## Estado

Diferida el 2026-08-18. Se conserva como registro histórico; no forma parte de la implementación de Slice 02. La versión de crecimiento está en `specs/growth/nestjs-api.md`.

## Objetivo

Proveer una API pequeña y auditable que valide la sesión Supabase y ejecute el dominio de Clientes preservando el aislamiento por organización.

## Módulos

- `health`: disponibilidad sin detalles internos.
- `auth-context`: validación de token y contexto de usuario.
- `clients`: listado, alta y detalle.
- `audit`: eventos sin payload clínico.
- Contratos compartidos versionados en `packages/contracts`.

## Arquitectura de solicitud

```text
React → Bearer JWT → NestJS Guard → ClientsService → ClientsRepository
      → cliente Supabase con access token del usuario → esquema API → RLS
```

- Controladores: HTTP, códigos y serialización; sin reglas de negocio.
- Servicios: autorización de capacidad y orquestación.
- Repositorios: único límite de acceso a Supabase.
- Contratos: esquemas compartidos autoritativos; los DTO concretos de Nest los aplican en runtime.
- La creación atómica se resolverá mediante una operación PostgreSQL `SECURITY INVOKER` probada con RLS, no mediante varios inserts HTTP independientes.

## Endpoints

| Método | Ruta | Éxito | Errores previstos |
| --- | --- | --- | --- |
| `GET` | `/health` | `200` | `503` |
| `GET` | `/v1/clients` | `200` | `401`, `403` |
| `POST` | `/v1/clients` | `201` | `400`, `401`, `403`, `409` |
| `GET` | `/v1/clients/:id` | `200` | `401`, `403`, `404` genérico |

### Respuestas

```ts
type ClientSummary = {
  id: string
  clientInitials: string
  clinicalId: string
  primaryLanguage: string
  birthDate: string
  status: "active" | "archived"
}

type ClientsListResponse = {
  data: ClientSummary[]
  meta: { total: number }
}

type CreateClientResponse = {
  data: ClientSummary
}

type ApiError = {
  code: string
  message: string
  correlationId: string
  fieldErrors?: Record<string, string[]>
}
```

- Fechas de dominio viajan como `YYYY-MM-DD`; timestamps, cuando existan, usan ISO 8601 UTC.
- El detalle no incluye campos fuera del contrato aprobado.
- Un recurso inexistente o fuera del alcance del usuario produce el mismo `404` genérico.
- El listado inicial no pagina; se añadirá paginación antes de superar el volumen fijado por una spec posterior.

## Seguridad

- Requerir claves de firma asimétricas en staging y validar JWT con el JWKS oficial del proyecto; no implementar criptografía propia.
- Verificar firma, `iss`, `aud`, `exp`, `sub` y algoritmo permitido. El `role` de Postgres no sustituye la membresía de dominio.
- Cachear JWKS mediante una biblioteca mantenida y contemplar rotación de `kid`; nunca almacenar claves privadas.
- Propagar el contexto del usuario a las consultas que dependan de RLS.
- No usar `service_role` para solicitudes ordinarias.
- Aplicar `ValidationPipe` global con whitelist, rechazo de propiedades adicionales y errores sin eco del payload.
- CORS sólo para los orígenes aprobados.
- Logs: correlation ID, ruta, estado y duración; nunca iniciales, ID clínico, fecha de nacimiento o body completo.
- Las respuestas no permiten inferir registros de otra organización.

## Autorización

| Acción | admin | clinician | viewer |
| --- | --- | --- | --- |
| listar clientes visibles | sí | sí | sí |
| consultar detalle visible | sí | sí | sí |
| crear cliente | sí | sí | no |

- El guard autentica; la capacidad de rol se valida en el servicio y RLS vuelve a validar el alcance de filas.
- Un usuario autenticado sin membresía válida recibe `403`.
- No se confía en `raw_user_meta_data`; la membresía proviene del modelo controlado.

## Consistencia

- Cliente, tutores, hermanos y auditoría se crean atómicamente.
- La edad se deriva de `birthDate` y no es autoritativa.
- No existe endpoint `DELETE`; una baja futura será archivado especificado y auditado.

## Validación del alta

| Campo | Regla contractual |
| --- | --- |
| `clientInitials` | requerido, string normalizado; longitud exacta se congela con contrato Supabase |
| `clinicalId` | requerido; único por organización |
| `primaryLanguage` | requerido; valor del catálogo compartido |
| `birthDate` | requerido; fecha ISO válida, no futura |
| `guardians`, `siblings` | opcionales; arrays con límite definido por contrato |
| `livingArrangement` | opcional; texto con límite definido por contrato |

Las propiedades desconocidas producen `400`; la API no las elimina silenciosamente.

## Auditoría

- Registrar creación exitosa con actor interno, organización, entidad, acción y timestamp.
- No registrar el DTO, valores anteriores/completos ni campos clínicos.
- Si falla la auditoría dentro de la operación atómica, falla la creación completa.
- `correlationId` enlaza log de aplicación y respuesta, pero no se persiste como dato clínico.

## TDD

1. Contratos puros: casos válidos, fecha futura, campos ausentes y propiedades desconocidas.
2. Guard: `401` para token ausente, firma inválida, issuer/audience incorrectos o expiración.
3. Rotación: un `kid` nuevo provoca refresco JWKS controlado.
4. Roles: viewer recibe `403` al crear; admin y clinician avanzan.
5. Repositorio: transmite el access token del usuario y nunca una clave privilegiada.
6. Creación atómica con auditoría y rollback lógico ante cualquier fallo.
7. Conflicto de ID acotado a organización produce `409 CLINICAL_ID_CONFLICT`.
8. Detalle ajeno e inexistente producen el mismo `404 CLIENT_NOT_FOUND`.
9. Captura de logs demuestra ausencia de datos sensibles.
10. OpenAPI coincide con los contratos compartidos.

## Orden de implementación

1. Crear contratos y pruebas rojas en `packages/contracts`.
2. Scaffold mínimo de `apps/api` con health check.
3. ValidationPipe y formato común de errores.
4. Guard JWT/JWKS y pruebas unitarias.
5. Adaptador de repositorio simulado y controladores.
6. Integración con el contrato Supabase verificado.
7. E2E autenticada y comparación OpenAPI.

## Fuera de alcance

- Login con Google, recuperación de contraseña o MFA.
- Edición, archivado, borrado y asignación individual por cliente.
- Historia clínica, evaluaciones, sesiones e informes.
- `service_role`, procesos batch o funciones `SECURITY DEFINER`.

## Criterios de aceptación

- Pruebas unitarias, integración y E2E aprobadas.
- Build reproducible y health check funcional.
- OpenAPI versionado dentro del workspace.
- API sin secretos hardcodeados ni permisos privilegiados ordinarios.
- Dependencias fijadas a versiones exactas con lockfile.
- Evidencia de prueba guardada dentro del workspace.
