# Slice 14 / Supabase staging

## Regla principal

**Sin cambios de esquema.** No crear tablas, columnas, funciones, policies, buckets ni migraciones.
No ejecutar escrituras remotas como parte de la implementación TDD; el E2E sintético se reserva al
QA final.

## Matriz de verdad

| Datos | Tabla actual | Acción Slice 14 |
| --- | --- | --- |
| cliente/familia | `clients`, `guardians`, `siblings` + `create_client` | conservar |
| evaluaciones | `assessments.payload` | payloads v1 autorizados |
| programa/meta/plan | tablas clínicas existentes | conservar contratos |
| sesión/medición | tablas + RPC existentes | conservar contrato 13A |
| contexto hogar/colegio | ninguna | no persistir |
| historia estructurada | ninguna | no persistir |
| consentimiento/acceso clínico | ninguna aprobada | no persistir |
| adjuntos | sin bucket aprobado | no subir |

## Seguridad

- RLS/membresía existentes siguen autoritativas para módulos remotos.
- No usar `user_metadata` para autorización ni exponer service role.
- No crear una tabla “temporal” para evitar el contrato legal.
- Si una spec futura crea tablas públicas, debe declarar grants explícitos además de RLS por el
  cambio de Data API de 2026; no corresponde ejecutarlo aquí.

## Gate de no mutación

- `supabase/schema/` y `supabase/tests/` no cambian durante CF-01–CF-08.
- `database.types.ts` no cambia.
- Advisors sólo se vuelven a ejecutar si accidentalmente aparece una modificación remota; ese caso
  bloquea el lote.
