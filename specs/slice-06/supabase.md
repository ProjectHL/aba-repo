# Slice 06 / Supabase

## OAuth Google

- Configurar una aplicación OAuth Web en Google Cloud.
- Callback autorizado: `https://arfwuctpwnnuhdgjtxaa.supabase.co/auth/v1/callback`.
- Configurar Google provider en Supabase Dashboard con Client ID y Client Secret.
- Configurar Site URL y redirects permitidos para `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`.
- El secreto permanece únicamente en Google Cloud/Supabase; nunca entra al repositorio, Sites o frontend.

## Autorización

- `auth.users` prueba identidad; no concede acceso de dominio.
- `memberships` continúa como fuente de autorización.
- Sin membresía: estado `pending`, cero lectura/escritura clínica.
- Membresía `inactive`: estado `inactive`, cero lectura/escritura.
- Membresía `active`: acceso según `role` y organización.
- No usar `user_metadata` para roles.
- No añadir políticas INSERT/UPDATE de membresías al rol `authenticated`.

## Gate

- Proveedor reporta Google habilitado.
- Usuario Google nuevo queda sin membresía.
- RLS devuelve cero organizaciones/clientes para ese usuario.
- Aprobación manual restaura acceso sin regenerar identidad.
- Advisors sin errores nuevos.
