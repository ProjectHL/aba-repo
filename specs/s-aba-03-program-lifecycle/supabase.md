# S-ABA-03 / Supabase y PostgreSQL

Estado: **migraciones 018/019 aplicadas a `ABA_staging`; contrato 006 verde**

## Estrategia no destructiva

Se preservan las tablas existentes y sus datos. La implementación propondrá una migración nueva
que añada un modelo común de programa/versiones o una capa compatible equivalente; no renombrará,
borrará ni truncará recursos previos. La elección final debe comprobar compatibilidad con informes
y sesiones existentes mediante una migración de referencia sólo con fixtures sintéticos.

## Reglas mínimas

- `programs`: identidad estable, `client_id`, tipo inmutable y versión vigente.
- `program_versions`: número creciente por programa, diseño tipado, estado y relación sucesora.
- Restricción única `(program_id, version)` y una sola versión vigente.
- RPCs `SECURITY INVOKER` para activar, versionar y transicionar de forma atómica.
- RLS por estudiante usando las funciones/grants de S-ABA-01.
- Supervisor principal o grant `program:edit` para escribir; `program:view` para leer.
- `anon` y familia sin acceso al diseño; `authenticated` sólo con grants mínimos.
- Auditoría sin payload clínico: actor, programa, versión, acción, fecha y estado anterior/nuevo.
- Sin `DELETE`; sin grants directos a tablas de auditoría.

## Compatibilidad

La migración 018 creó el modelo, RLS, triggers, auditoría y RPCs; la 019 cubrió todas las claves
foráneas señaladas por el advisor de rendimiento. El contrato 006 verificó las tres tablas, RLS,
ausencia de DELETE, exposición limitada de RPC e índices requeridos. La compatibilidad funcional
con sesiones históricas y la matriz de identidades siguen siendo parte del E2E autenticado.
