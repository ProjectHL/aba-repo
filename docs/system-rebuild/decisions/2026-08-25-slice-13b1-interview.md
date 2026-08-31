# Decisión — Slice 13B.1 entrevista dinámica

Fecha: 2026-08-25  
Aprobador: propietario del proyecto  
Origen: instrucción `continua con Formularios clínicos`  
Estado: aprobado para implementación local y uso del contrato existente en Supabase staging

## Alcance aprobado

- Sustituir fortalezas/necesidades globales por filas ordenadas de informantes.
- Cada fila guarda `informant`, `strengths` y `needs` dentro de `assessments.payload`.
- Payload versionado con `schema_version: 1`.
- Mínimo una fila, sin nombres ni identificadores directos.
- TDD/BDD con datos sintéticos; E2E autenticado queda para QA final.

## Bloqueos conservados

- Contexto hogar/colegio necesita decisión de almacenamiento y RPC.
- Historia clínica necesita modelo relacional, auditoría y decisión sobre prescriptor.
- Consentimiento/acceso necesita spec legal y de permisos.
- No se autoriza migración, Storage, producción, Sites ni datos reales.
