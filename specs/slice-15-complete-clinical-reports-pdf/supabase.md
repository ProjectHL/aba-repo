# Slice 15 / Supabase staging

## Estado

**APROBADA EL 2026-08-29 COMO CONTRATO DE NO MUTACIÓN.** No autoriza inspección remota ni cambios de Supabase.

## Invariante propuesto

Este slice consume únicamente lecturas ya expuestas por los repositorios locales y protegidas por
la membresía/RLS vigente. No crea ni modifica tablas, columnas, vistas, funciones, RPC, grants,
policies, índices, Storage, Auth, Realtime, migraciones ni tipos generados.

## Matriz de fuentes

| Sección | Fuente lógica vigente | Escritura Slice 15 |
| --- | --- | --- |
| encabezado mínimo | cliente accesible | ninguna |
| evaluación | evaluaciones del cliente | ninguna |
| adquisición/reducción | programas, metas y planes del cliente | ninguna |
| progreso | sesiones no archivadas, mediciones y ensayos | ninguna |
| PDF | modelo compuesto en memoria del navegador | ninguna |

La tabla física exacta y la consulta permanecen responsabilidad de los adaptadores existentes; esta
spec no autoriza consultas ad hoc ni bypass de repositorios.

## Seguridad

- El usuario sólo puede leer expedientes autorizados por la política vigente.
- No usar `user_metadata` para autorización ni exponer `service_role`.
- No registrar contenido, nombre de archivo ni evento de descarga.
- No subir PDF a Storage ni guardar base64/Blob/URL en base de datos.
- No usar datos `frontend-draft` como si fueran remotos.
- Una respuesta de otro cliente u organización bloquea composición y exportación.

## Gate de no mutación

Durante una implementación futura de este slice, `supabase/schema/`, `supabase/tests/` y
`database.types.ts` deben permanecer sin cambios. Cualquier necesidad de modificarlos detiene el
slice y requiere una nueva decisión aprobada, además de aplicar las skills Supabase obligatorias.
