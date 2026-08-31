# Slice 14 / Backend

## Decisión

NestJS continúa diferido. Este cierre no añade endpoints, RPC, Edge Functions ni exportaciones
server-side.

## Puertos autorizados

| Módulo | Puerto | Escritura |
| --- | --- | --- |
| alta base | `ClientsRepository.create` | remota |
| entrevista/preferencias/funcional | `AssessmentRepository.create` | remota |
| programa/meta/plan | `ClinicalPlansRepository` | remota |
| sesión | `ClinicalSessionRepository.createAtomic` | remota |
| contexto/historia | `FrontendDraftProvider` | memoria, no repositorio |
| consentimiento/acceso | ninguno | bloqueado |

## Reglas

- Tipos frontend discriminan `remote`, `frontend-draft` y `blocked`.
- Ningún adaptador remoto acepta `ClientContextDraft` o `ClinicalHistoryDraft` en Slice 14.
- El mapper de assessment excluye `File`, nombre de archivo y cualquier binario.
- `occurredOn` se envía en la columna existente y no queda duplicado en JSON.
- Los contratos remotos rechazan respuesta de otro `clientId`.
- Detalles internos se normalizan; no se exponen errores de Supabase.

## Gate

Contract tests verifican payload exacto y que los drafts frontend nunca invocan `getSupabaseClient`,
fetch, XHR ni almacenamiento del navegador.
