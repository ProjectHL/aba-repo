# S-ABA-01 / Backend y dominio de autorización

Estado: **puertos Supabase implementados; API propia/NestJS continúa diferida**

## Responsabilidad

Centralizar una decisión de acceso reproducible por identidad, organización, estudiante, recurso y
acción. El mismo resultado debe gobernar consultas, mutaciones, descargas y cualquier futuro RPC.
La UI no decide permisos y una `service_role` no participa en navegación ordinaria.

## Entradas de la decisión

~~~ts
type AccessQuery = {
  actorUserId: string
  studentId: string
  resource: "student" | "program" | "record_config" | "record" | "chart" | "result"
  action: "discover" | "view" | "create" | "edit" | "capture" | "submit" | "download"
  resourceId?: string
  evaluatedAt: string
}

type AccessDecision = {
  allowed: boolean
  reason: "allowed" | "not_found" | "inactive_membership" | "not_assigned" |
    "role_denied" | "grant_required" | "grant_expired" | "grant_revoked"
  effectiveGrantId?: string
}
~~~

Los clientes reciben una razón normalizada; `not_found`, `inactive_membership` y `not_assigned` no
deben permitir inferir existencia. Los identificadores de decisión son sólo internos/auditables.

## Invariantes

1. La organización se deriva del estudiante y la membresía; nunca de un valor autoritativo enviado
   por el cliente.
2. Un recurso hijo debe pertenecer al mismo estudiante de la consulta.
3. La asignación activa es necesaria incluso para el supervisor.
4. El rol base nunca obtiene permisos hermanos por tener un grant.
5. El solicitante no elige al aprobador ni puede aprobarse a sí mismo.
6. Sólo el supervisor principal activo del estudiante decide o revoca.
7. Un grant se evalúa por tiempo del servidor y queda inválido al vencer o revocarse.
8. Reintentos usan idempotencia; no producen solicitudes ni decisiones duplicadas.
9. Fallo de auditoría impide persistir solicitud, decisión o revocación.

## Puertos candidatos

~~~ts
interface StudentAccessPolicy {
  decide(query: AccessQuery): Promise<AccessDecision>
  listCapabilities(actorUserId: string, studentId: string): Promise<StudentCapability[]>
}

interface StudentAuthorizationWorkflow {
  request(input: RequestAuthorization): Promise<AuthorizationRequest>
  decide(input: DecideAuthorization): Promise<AuthorizationDecision>
  revoke(input: RevokeAuthorization): Promise<AuthorizationDecision>
}
~~~

No se aprueba todavía si estos puertos viven en repositorios Supabase, RPC, Edge Functions o
NestJS. Cualquier opción debe aplicar la misma política en la frontera de datos.

## Solicitudes y decisiones

- La solicitud contiene estudiante, solicitante, recurso, acciones no vacías y motivo breve sin
  datos clínicos.
- Sólo se admite una solicitud `pending` equivalente.
- La aprobación crea una decisión con `effective_at` y `expires_at`; no modifica la solicitud.
- Denegación, expiración y revocación preservan el historial.
- Una nueva solicitud posterior referencia el intento anterior, sin reabrirlo ni sobrescribirlo.
- Las notificaciones iniciales son estados consultables dentro de la aplicación; no correo/chat.

## Errores externos

| Situación | Respuesta pública candidata |
| --- | --- |
| no autenticado | `401 SESSION_REQUIRED` |
| no asignado/inexistente | `404 STUDENT_NOT_FOUND` |
| asignado sin capacidad | `403 ACTION_NOT_ALLOWED` |
| duplicado pendiente | `409 REQUEST_ALREADY_PENDING` |
| versión/estado obsoleto | `409 AUTHORIZATION_STATE_CHANGED` |
| payload inválido | `422 INVALID_AUTHORIZATION_REQUEST` |

## Criterios de aceptación backend

1. Cada mutación vuelve a evaluar acceso; no confía en capabilities antiguas del cliente.
2. Un grant de estudiante A nunca aplica a B ni a un recurso hijo de B.
3. Revocación y vencimiento bloquean la próxima operación con sesión activa.
4. Solicitudes concurrentes equivalentes producen un solo estado pendiente.
5. No se registran notas clínicas, tokens ni payloads de recursos en logs de autorización.
