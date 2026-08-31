# Handoff interno — Front-first / Lote 03

Fecha: 2026-08-18

## Resultado

- Programas de adquisición leen e insertan en `acquisition_programs`.
- Las metas exigen un programa existente y persisten en `acquisition_goals`.
- Los planes de conducta integran definición, medición, función y estrategias en `behavior_plans`.
- Las tres áreas actualizan sus conteos o listados después del guardado sin recargar la página.
- Respuestas remotas validadas con Zod y errores de sesión conectados a la invalidación Auth global.

## Gate de desarrollo

- Pruebas focalizadas del detalle de cliente: 6/6 PASS.
- TypeScript: PASS.
- ESLint: PASS.
- Staging read-only: RLS activo, SELECT/INSERT concedidos y políticas presentes en las tres tablas.
- No se ejecutó QA integral, responsive, E2E ni publicación, conforme a Slice 09.

## Límites

- No se modificó el esquema remoto ni se insertaron registros durante la validación.
- Los datos reales siguen prohibidos; los formularios identifican staging y solicitan contenido sintético.
- No existe DELETE desde frontend.

## Siguiente lote

Implementar la operación atómica de sesión clínica: cabecera de sesión, mediciones de reducción y
ensayos de adquisición en una sola transacción, y luego conectar la vista de captura rápida.
