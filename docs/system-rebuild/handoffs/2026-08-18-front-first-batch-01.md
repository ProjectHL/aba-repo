# Handoff interno — Front-first / Lote 01

Fecha: 2026-08-18

## Decisión operativa

El QA integral sale del loop de construcción y queda reservado para el cierre. Durante los lotes se
mantienen únicamente gates de desarrollo y contrato: TypeScript, compilación puntual, shape de datos
y consultas read-only de Supabase.

## Entregado

- Slice 09 separada en frontend, backend, Supabase y publicación.
- Matriz pantalla ↔ conexión remota.
- Inventario real de staging: seis tablas, cinco migraciones y RLS activa.
- Contrato `ClientDetail` con convivencia, tutores y hermanos.
- Consulta anidada Supabase desde `clients` hacia `guardians` y `siblings`.
- Contexto familiar conectado en la vista Información.
- Formularios clínicos habilitados como borradores locales.
- Tipos compartidos para entrevista, preferencias, evaluación funcional, adquisición, reducción,
  sesiones y reportes.
- Registro de estado por módulo: conectado, contrato listo o esquema pendiente.

## Validación acotada

- TypeScript: PASS.
- Contrato cliente/familia: 4/4 pruebas puntuales PASS.
- Staging: 5 clientes, 3 tutores y 1 hermano sintéticos; ambas claves foráneas disponibles.
- No se ejecutó regresión, E2E, responsive ni QA visual.
- No se modificó Supabase ni se publicó Sites.

## Siguiente lote

Diseñar y crear en staging el esquema clínico compartido, con grants explícitos, RLS por cliente y
sin operaciones de borrado. Después se implementarán los repositorios Supabase detrás de los puertos
frontend ya definidos.
