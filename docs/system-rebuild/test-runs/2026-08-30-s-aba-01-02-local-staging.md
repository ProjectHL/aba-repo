# Evidencia TDD y staging — S-ABA-01 + S-ABA-02

Fecha: 2026-08-30  
Entornos: local y Supabase `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Datos: exclusivamente identidades y descriptores sintéticos

## Resultado ejecutivo

Los contratos de acceso por estudiante, autorizaciones temporales, expediente mínimo, historia no
destructiva y consentimiento de referencia quedaron implementados en local y verificados contra
Supabase staging. No hubo producción, Storage, firma, Sites ni publicación web.

## TDD y regresión local

| Gate | Resultado |
| --- | --- |
| Prueba roja inicial | módulo de repositorio ausente y tablas/RPC nuevas inexistentes |
| Pruebas enfocadas UI | 15/15 verdes |
| Repositorio Supabase | 2/2 verdes |
| Regresión completa | 32 archivos, 139/139 pruebas verdes |
| TypeScript | `tsc --noEmit` verde |
| Lint | ESLint verde |
| Build staging aislado | verde en `apps/web/verification/s-aba-01-02-20260830-2036/` |

El build informa un chunk principal superior a 500 kB; queda como optimización P2, no como falla
funcional ni de autorización.

## Cambios Supabase aplicados

- `010_student_access_and_minimum_record.sql`
- `011_atomic_clinical_history_batch.sql`
- `012_student_capabilities_rpc.sql`
- `013_student_access_audit_ledger.sql`
- `014_student_rls_helper_execution.sql`
- `015_client_context_authorization_error.sql`
- `016_client_context_security_definer.sql`
- `017_student_record_foreign_key_indexes.sql`

Las tablas nuevas tienen RLS; `anon`/`PUBLIC` no ejecutan las RPC privilegiadas y no existe grant
ni policy ordinaria de `DELETE`. El ledger de acceso es append-only y no tiene grants directos a
roles de cliente.

## Contratos SQL

| Archivo | Resultado remoto |
| --- | --- |
| `001_staging_integrity.sql` | pass: 8 clientes, 6 membresías, 12 eventos históricos, 4 archivados |
| `002_membership_revocation.sql` | pass |
| `003_atomic_clinical_session.sql` | pass |
| `004_session_measurement_dimensions.sql` | pass |
| `005_student_access_and_minimum_record.sql` | pass |

## Flujo autenticado sintético S-ABA-01

Test run: `a2010001-0000-4000-8000-000000000001`.

1. La supervisora principal asignó a una identidad sintética como coordinador.
2. La edición previa al grant fue denegada por RLS.
3. El coordinador solicitó `student.edit`; se creó una única solicitud pendiente.
4. La supervisora aprobó temporalmente por 89 días.
5. El coordinador persistió contexto sintético, versión 1.
6. La supervisora revocó el grant.
7. La siguiente edición fue denegada con `42501 student_edit_required`.
8. El ledger conserva `assigned → requested → approved → revoked`; no se borró evidencia.

## Flujo autenticado sintético S-ABA-02

Test run: `a2020001-0000-4000-8000-000000000001`.

- Una terapeuta asignada no pudo añadir historia: `42501 student_edit_required`.
- La supervisora añadió atómicamente diagnóstico reportado y medicación sintéticos.
- Una corrección creó una entrada nueva y marcó la anterior `superseded`.
- El consentimiento de referencia se registró por finalidad y luego se revocó mediante una fila
  nueva; la anterior quedó `superseded` y `consent_events` conserva `recorded → revoked`.
- No se usaron archivos, firmas, URLs públicas ni identificadores directos.

## Asesores Supabase

- Seguridad: sin hallazgo nuevo de RLS ausente en tablas legibles. El ledger sin policy se mantiene
  deliberadamente inaccesible a cliente. Los avisos `SECURITY DEFINER` corresponden a RPC
  intencionales con gates explícitos de identidad, membresía, asignación, rol/capacidad y
  `search_path=''`.
- Rendimiento: tras `017`, no quedan claves foráneas sin índice en las tablas S-ABA. Los índices
  recién creados aparecen como `unused_index`, esperado antes de tráfico significativo.
- Aviso preexistente: protección de contraseñas filtradas deshabilitada; fuera de este alcance.

## Cobertura pendiente

- No se publicó el bundle local ni se ejecutó smoke autenticado de estas pantallas en el Site.
- Los escenarios BDD de navegador, deep link y proyección familiar bloqueada requieren candidato
  publicado; las fronteras RLS y los flujos de persistencia sí fueron revalidados remotamente.

