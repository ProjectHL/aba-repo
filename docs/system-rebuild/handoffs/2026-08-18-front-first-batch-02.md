# Handoff interno — Front-first / Lote 02

Fecha: 2026-08-18

## Supabase staging

Se aplicaron dos migraciones no destructivas:

1. `clinical_workspace_foundation`
2. `clinical_fk_covering_indexes`

El esquema incorpora evaluaciones, programas, metas, planes de conducta, sesiones, mediciones,
ensayos y auditoría clínica. Todas las relaciones tienen índices de cobertura; las tablas usan RLS,
grants explícitos para `authenticated` y ningún grant para `anon`. No existe política `DELETE`.

## Frontend

- Tipos Supabase regenerados desde staging.
- Repositorio tipado de evaluaciones.
- Entrevista, preferencias y evaluación funcional leen conteos reales por cliente.
- `Guardar borrador` inserta en `assessments` con sesión Auth y RLS.
- Errores de lectura/escritura permanecen genéricos y una sesión inválida activa el cierre global.

## Verificación de contrato, no QA

- Ocho de ocho tablas con RLS.
- Lectura autenticada concedida para las siete tablas funcionales.
- `anon` bloqueado.
- Auditoría clínica bloqueada para el cliente.
- Inserción y archivado sintéticos mediante rol `authenticated`: PASS.
- Auditoría `created` + `archived` y actor: PASS.
- Performance Advisor sin claves foráneas no indexadas.
- TypeScript: PASS.

No se ejecutó QA integral, E2E de navegador, responsive ni despliegue de Sites.

## Próximo lote

Implementar repositorios de programas/metas y planes de conducta; después crear la operación atómica
de sesiones y mediciones.
