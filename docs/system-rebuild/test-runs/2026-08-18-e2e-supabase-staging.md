# Test run: E2E Supabase staging

Fecha: 2026-08-18  
Proyecto: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Test run: `eeeeeeee-2026-4818-8818-eeeeeeeeeeee`

## Fixtures Auth

- `aba.e2e.clinician.a.20260818@example.com` — organización A, `clinician`.
- `aba.e2e.viewer.a.20260818@example.com` — organización A, `viewer`.
- `aba.e2e.clinician.b.20260818@example.com` — organización B, `clinician`.

Las tres identidades están autoconfirmadas. Sus contraseñas fueron aleatorias, se mantuvieron sólo en memoria durante la ejecución y no se registraron en archivos, logs ni capturas.

## Resultados

1. Clinician A inició sesión, obtuvo listado vacío, creó un cliente y abrió su detalle.
2. Viewer A pudo consultar el detalle de su organización, pero el alta respondió `403` con “No tienes permiso para realizar esta acción”. La base confirmó cero registros para ese intento.
3. Clinician B obtuvo listado vacío y el ID de A respondió “Cliente no encontrado”.
4. El mismo ID clínico se creó correctamente en B.
5. Un duplicado del ID dentro de A respondió `409` y marcó el campo sin perder valores.
6. Tras cerrar sesión, una ruta protegida volvió a `/login`.
7. No se expusieron contraseñas, JWT, claves privadas ni datos reales.

## Recuperación no destructiva

- Cliente A: `9cd91ed5-aca1-4940-863a-eccc8b48eab2` — `archived`.
- Cliente B: `fc686bd0-15dc-421f-b192-391a6080cd0d` — `archived`.
- Cuentas, organizaciones y membresías permanecen activas para repetir pruebas.
- No se ejecutó `DELETE`.

## Advisors

- Seguridad: sólo `auth_leaked_password_protection`; la función está disponible desde plan Pro y `ABA_staging` usa Free. Referencia: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Rendimiento: índice de auditoría aún no usado; informativo. No se elimina porque el volumen de staging no demuestra que sea innecesario.
