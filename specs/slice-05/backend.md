# Slice 05 / Backend y operaciones privilegiadas

## Decisión

NestJS continúa diferido. El onboarding no justifica una API propia: Supabase Auth, PostgreSQL/RLS y Sites cubren el piloto.

## Límite administrativo

- Crear usuario, confirmar correo, banear/desbanear y gestionar membresías son operaciones privilegiadas.
- Se realizan sólo mediante herramientas administrativas autorizadas; nunca desde el navegador público.
- `service_role`, claves secretas y contraseñas no entran al repositorio, bundle, logs o Markdown.
- La autorización de dominio proviene de `public.memberships`, no de `user_metadata`.

## Credencial

- Generar una contraseña aleatoria individual de alta entropía; no reutilizar la contraseña estándar de fixtures.
- Entregarla por un canal privado separado de la invitación al Site.
- No imprimirla en handoff, capturas, terminales compartidas ni documentación.
- El usuario no comparte cuenta con el propietario ni con otros evaluadores.

## Cierre reversible

1. Cambiar membresía a `inactive` para cortar RLS inmediatamente.
2. Banear la identidad y revocar refresh tokens cuando el mecanismo disponible lo permita.
3. Retirar el correo de la allowlist de Sites sólo con confirmación explícita.
4. No borrar usuario, membresía, organización, fixtures ni evidencia.

Los access tokens de Supabase no pueden revocarse antes de expirar; por eso la membresía inactiva es el control autoritativo inmediato.

