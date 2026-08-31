# Handoff — Slice 13A, dimensiones de medición (2026-08-25)

## Resultado

13A queda implementada en frontend y `ABA_staging`: frecuencia, duración, latencia e intervalo usan
controles y contratos distintos; la RPC valida la unidad contra el plan y guarda un snapshot; los
informes conservan unidad e intervalos. Las sesiones legacy no se reescriben ni se reinterpretan.

Evidencia: `docs/system-rebuild/test-runs/2026-08-25-slice-13a-tdd-bdd.md`.

## Entregables

- contrato discriminado de mediciones;
- controles accesibles por dimensión y validación previa al guardado;
- migración aditiva 009 y contrato SQL 004;
- adaptador RPC y tipos Supabase actualizados;
- analytics de informe con snapshot e intervalos;
- 99/99 pruebas, typecheck, lint y build candidato verdes.

## Límites y riesgos

- No hubo despliegue web ni datos reales.
- E2E autenticado se ejecutará una sola vez en el loop QA final, no dentro de cada lote.
- La protección de contraseñas filtradas sigue desactivada en Supabase staging.
- El bundle inicial conserva un P2 de tamaño; no bloquea el siguiente lote funcional.

## Siguiente spec

**13B — paridad de alta, ficha e entrevista.** Primero cerrar los contratos frontend/backend/
Supabase existentes para contexto hogar/colegio, historia clínica estructurada e informantes
dinámicos; consentimiento y acceso permanecen bloqueados hasta su contrato específico.

No se eliminó ningún archivo, dato, índice ni recurso remoto.
