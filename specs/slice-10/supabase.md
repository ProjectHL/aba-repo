# Slice 10 / Supabase staging

## Invariante

La fase 10A no requiere cambiar `ABA_staging` (`arfwuctpwnnuhdgjtxaa`): el E2E confirmó que las
escrituras y lecturas clínicas existentes funcionan bajo RLS. El defecto P0 se trata primero como
contrato/estado frontend, con consultas diagnósticas sólo de lectura.

## Contrato de respuesta vigente

- Las respuestas PostgREST pueden expresar `timestamptz` como
  `YYYY-MM-DD HH:MM:SS.ssssss+00`; los consumidores deben aceptarlo como timestamp válido.
- Las filas clínicas se validan antes de entrar al dominio.
- RLS, grants mínimos por `authenticated`, aislamiento por organización y la RPC
  `create_clinical_session` como `SECURITY INVOKER` se conservan sin cambios.

## Cambios futuros bloqueados hasta aprobación

| Necesidad | Posible frontera remota | Decisión requerida antes de implementar |
| --- | --- | --- |
| Adjuntos de evaluación | Supabase Storage + metadatos y políticas | tipo permitido, retención, acceso, límites y relación con evaluación |
| Campos ampliados de evaluación/programa | columnas o JSON validado | nombres, obligatoriedad, versionado y migración retrospectiva |
| Historial/corrección de sesiones | UPDATE versionado o eventos de corrección | autor, auditoría, qué valor prevalece y reglas clínicas |
| Exportación JPG S-12 aprobada | ninguna; composición local efímera | cualquier artefacto persistente requiere propietario, retención y RLS |

Toda decisión aprobada crea migración versionada, grants explícitos, RLS/políticas, contrato
frontend y prueba de aislamiento antes de tocar staging. No se usa `service_role`, no se añaden
funciones `SECURITY DEFINER` para resolver permisos y no se elimina información.
