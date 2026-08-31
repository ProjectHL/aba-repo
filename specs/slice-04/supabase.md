# Slice 04 / Supabase staging

## Alcance

Usar exclusivamente el proyecto de staging ya validado, sin cambios de producción ni datos clínicos reales.

## Criterios

- Seis tablas públicas con RLS habilitada.
- Cero políticas DELETE; los fixtures se archivan y conservan por `test_run_id`.
- Viewer no crea; otra organización no puede leer ni inferir registros ajenos.
- Auditoría de create, update y archive sin payload clínico.
- Las cuentas de prueba son individuales y sintéticas; no compartir una contraseña entre evaluadores.
- La advertencia de leaked-password protection del plan Free permanece documentada.
- Antes y después de la prueba se ejecuta el harness no destructivo `supabase/tests/001_staging_integrity.sql`.

