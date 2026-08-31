# Handoff — Slice 13B.1 entrevista dinámica (2026-08-25)

## Entregado

- Formulario especializado de entrevista inicial con shadcn/ui y React Hook Form.
- Informantes repetibles, ordenados y accesibles por teclado.
- Contrato Zod y mapper `InitialInterviewPayloadV1`.
- Protección contra correo/RUT y límites por campo.
- Conservación completa tras error y estados guardando/guardado/desactualizado/error.
- Persistencia por `AssessmentRepository` y `assessments.payload` existentes.
- 103/103 pruebas, TypeScript, lint y build candidato verdes.

Evidencia: `docs/system-rebuild/test-runs/2026-08-25-slice-13b1-dynamic-interview.md`.

## No realizado

- No hubo migración, inserciones de QA, publicación ni datos reales.
- Contexto hogar/colegio, historia clínica, consentimiento y acceso no simulan guardado.
- E2E autenticado y móvil permanecen en el QA final acordado.

## Siguiente decisión — 13B.2

Propuesta recomendada para contexto hogar/colegio: tabla uno-a-uno
`client_context_profiles(client_id PK, home_adaptations, schooling, school_adaptations, test_run_id,
timestamps)`, RLS por membresía y extensión atómica de `create_client`. Evita inflar `clients` y no
mezcla contexto con evaluaciones.

Historia clínica debe seguir en 13B.3 con una tabla de entradas tipadas y auditoría; no debe entrar
como JSON genérico. Prescriptor se recomienda excluir del piloto hasta revisar necesidad y
minimización legal.

No se eliminó ningún archivo, dato ni recurso.
