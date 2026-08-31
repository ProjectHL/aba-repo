# Slice 13 / Supabase staging

- No añadir tablas ni columnas para el informe derivado.
- Mantener RLS y aislamiento por `client_id`.
- Sólo ampliar esquema para dimensiones de sesión si el modelo actual no puede representarlas;
  primero documentar la migración y sus grants.
- No crear Storage para adjuntos sin aprobación explícita de política de retención y acceso.
- Ejecutar contratos SQL sólo contra `ABA_staging` (`arfwuctpwnnuhdgjtxaa`).

## Contrato 13A

Antes de migrar, comprobar si `session_behavior_measurements.value` y el contrato RPC pueden
representar las cuatro dimensiones sin perder unidad. Si no pueden, proponer una migración aditiva
con unidad explícita y actualizar `database.types.ts`; nunca reutilizar una columna con semántica
ambigua. La migración debe incluir RLS, grants, índices justificados y prueba SQL versionada.

### Diagnóstico actual

- `behavior_plans.measurement_unit` define cuatro valores, pero puede cambiar por UPDATE.
- `session_behavior_measurements.value numeric(12,2)` representa enteros y decimales exactos, pero
  no conserva snapshot de unidad ni numerador/denominador de intervalos.
- La RPC sólo recibe `{behavior_plan_id, value}`.

Por tanto, el modelo actual basta para frecuencia/duración/latencia sólo si la unidad se deriva del
plan, pero no preserva semántica histórica. No basta para intervalos observados/totales.

### Migración aditiva aplicada en staging

- `measurement_unit text null` en `session_behavior_measurements` con los mismos cuatro valores.
  Las filas nuevas creadas por la RPC lo reciben siempre; `null` queda reservado para sesiones
  legacy anteriores a Slice 13.
- `interval_observed integer null`, `interval_total integer null`.
- Checks por dimensión: frecuencia entera; duración/latencia `value >= 0`; intervalo con ambos
  conteos, `0 <= observed <= total`, y `value` como porcentaje derivado para compatibilidad.
- RPC valida que `measurement_unit` coincida con el plan y guarda snapshot.
- Mantener `SECURITY INVOKER`, revocar `PUBLIC`/`anon`, conceder sólo `authenticated` y conservar
  RLS/foreign keys actuales.
- No hacer backfill ni reescribir sesiones existentes. El lector muestra `Unidad histórica no
  registrada` cuando el snapshot es `null`; no infiere silenciosamente la unidad actual del plan.

Implementación versionada: `supabase/schema/009_session_measurement_dimensions.sql`. Aplicada sólo
a `ABA_staging` como `slice_13a_session_measurement_dimensions`; contrato SQL 004 en verde. Los
advisors no detectaron una vulnerabilidad nueva por la migración.

## Contrato 13C/13D

Los informes se derivan de `assessments`, `clinical_sessions`, mediciones, ensayos, programas, metas
y planes existentes. No se duplican filas para exportar. Consultas deben filtrar por cliente y
respetar membresía activa. No se agrega Storage para adjuntos en este slice.

## Contrato 13B

- **13B.1:** no requiere migración. Persiste el payload versionado de entrevista en
  `assessments.payload`; conserva RLS, grants e INSERT actuales.
- **13B.2:** bloqueado; falta decidir columnas nullable versus tabla contextual uno-a-uno y ampliar
  `create_client` de forma atómica.
- **13B.3:** bloqueado; no almacenar historia clínica estructurada en JSON genérico hasta aprobar
  tablas, auditoría y política de campos sensibles.
- Consentimiento y acceso no se implementan dentro de 13B.

El gate 13B.1 verifica por metadata/contrato que `assessments` tenga RLS y que `authenticated`
conserve SELECT/INSERT sólo bajo políticas de membresía. No crea datos persistentes durante TDD.

## Gate Supabase

El subagente debe entregar SQL de contrato, resultado de advisors, prueba de aislamiento y lista de
registros sintéticos creados. No puede borrar ni archivar datos para limpiar una prueba; debe usar
fixtures nuevos y dejar constancia de cualquier dato persistente.
