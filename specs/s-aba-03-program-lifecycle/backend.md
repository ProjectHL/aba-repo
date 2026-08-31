# S-ABA-03 / Backend y contratos de dominio

Estado: **contratos y repositorio implementados localmente; Supabase Data API continúa como frontera**

## Contrato de dominio

```ts
type ProgramType = "acquisition" | "behavior"
type ProgramStatus = "draft" | "active" | "paused" | "achieved" | "discontinued"

type ProgramVersion = {
  id: string
  programId: string
  clientId: string
  version: number
  type: ProgramType
  status: ProgramStatus
  title: string
  design: AcquisitionDesign | BehaviorDesign
  createdAt: string
  activatedAt: string | null
  supersedesVersionId: string | null
}
```

El repositorio expone `list`, `getVersion`, `createDraft`, `updateDraft`, `activate`,
`createSuccessorVersion` y `transitionStatus`. No expone `delete` ni actualización libre de una
versión activada.

## Errores

| Código | Semántica |
| --- | --- |
| `PROGRAM_NOT_FOUND` | 404 equivalente sin revelar otro estudiante |
| `PROGRAM_FORBIDDEN` | sesión sin grant suficiente |
| `PROGRAM_INVALID` | diseño incompleto o payload inválido |
| `PROGRAM_TRANSITION_INVALID` | transición no permitida |
| `PROGRAM_VERSION_CONFLICT` | versión base dejó de ser vigente |
| `PROGRAM_TYPE_IMMUTABLE` | intento de cambiar el tipo |

No se incorpora NestJS, Edge Function ni `service_role`. Una futura API propia deberá conservar
estos contratos y códigos.

## Mapeo implementado

El modelo SQL separa la identidad y estado en `programs` del diseño inmutable en
`program_versions`. La respuesta del repositorio compone ambos recursos en el contrato de dominio;
`version_state` (`draft`, `released`, `superseded`) es interno y no amplía los estados de producto.
