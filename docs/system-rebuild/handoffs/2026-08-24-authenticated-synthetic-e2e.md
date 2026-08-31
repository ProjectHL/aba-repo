# Handoff — E2E clínico autenticado con evidencia sintética

La ejecución manual autenticada de 2026-08-24 completó el flujo de alta, evaluaciones, adquisición,
reducción, sesión atómica e informe en `ABA_staging`. La evidencia detallada está en
`docs/system-rebuild/test-runs/2026-08-24-authenticated-synthetic-e2e.md`.

## Resultado

- Expediente adulto ficticio: `ZX` / `E2E-SYNTH-ALPHA`.
- Informe final: 1 sesión, 1 serie de conducta, 1 meta y 80.0% (8/10 ensayos).
- Persistencia remota confirmada con RLS para las tres evaluaciones, programa, meta, plan y sesión.
- No se ejecutaron borrados, publicación ni cambios de esquema remoto.

## Correcciones aplicadas

- `supabaseClientsRepository.getById` usa la selección de detalle completa.
- Los repositorios de evaluaciones, planes y sesiones validan `timestamptz` devuelto por PostgREST
  como fecha interpretable, en vez de exigir el formato ISO literal con `T`.

## Pendiente prioritario

Los formularios de evaluación, programa, meta y plan persistieron (REST 201), pero mostraron
`No pudimos guardar el borrador` inmediatamente después. Una recarga F5 reflejó los conteos correctos.
Investigar y cubrir con una prueba de integración el camino posterior a `insert().select().single()`;
no tratar el mensaje visual como un fallo RLS ni como un resultado aceptable de UX.
