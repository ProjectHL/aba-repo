# Pruebas Supabase staging

Estas pruebas son aditivas o de sólo lectura y se ejecutan exclusivamente contra `ABA_staging`. Nunca contienen `DELETE`, `TRUNCATE`, `DROP` ni restauraciones destructivas.

- `001_staging_integrity.sql`: verifica tablas esperadas, RLS, ausencia de políticas DELETE, integridad referencial lógica, trazabilidad de altas y tagging de fixtures.
- `002_membership_revocation.sql`: verifica revocación reversible de membresías, políticas y auditoría.
- `003_atomic_clinical_session.sql`: verifica modo invocador, permisos de ejecución y rechazo de cargas vacías o malformadas sin persistir filas.
- Las pruebas de autorización se ejecutan con usuarios y organizaciones sintéticas, y cada alta persistente queda marcada por `test_run_id` y finalmente `archived`.

Antes de ejecutar, confirmar el project ref `arfwuctpwnnuhdgjtxaa` y registrar la corrida en `docs/system-rebuild/test-runs/`.
