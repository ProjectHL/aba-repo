# Slice 07 / Supabase

## Contrato

- Auth por correo habilitado.
- Creación pública de identidades habilitada.
- Confirmación de correo obligatoria (`mailer_autoconfirm=false`).
- `signUp({ email, password, options: { emailRedirectTo } })` usa sólo una URL permitida del Site.
- Una identidad nueva no obtiene filas en `memberships` automáticamente.
- RLS continúa autorizando datos por membresía activa, nunca por email ni metadata editable.

## Recuperación de contraseña

- `resetPasswordForEmail(email, { redirectTo })` usa una URL de redirección autorizada que apunta
  al Site y ruta `/recuperar-contrasena`.
- El navegador habilita el cambio sólo tras el evento Auth `PASSWORD_RECOVERY`.
- `updateUser({ password })` se invoca desde la sesión temporal de recuperación; no se usa
  `auth.admin`, `service_role` ni SQL para cambiar contraseñas.
- Supabase almacena hashes de contraseña; el proyecto no puede leer ni recuperar una contraseña.

## Estado staging verificado 2026-08-18

- Email: habilitado.
- Signup: habilitado.
- Confirmación automática: deshabilitada.
- Google: pendiente de configuración externa.
