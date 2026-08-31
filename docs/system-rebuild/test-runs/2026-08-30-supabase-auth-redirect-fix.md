# Corrección de redirect de recuperación en Supabase Auth

Fecha: 2026-08-30  
Proyecto: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Alcance: configuración remota de Auth autorizada expresamente

## Hallazgo reproducido

- El vínculo de recuperación enviado por correo redirigía a `http://localhost:3000`.
- En Authentication → URL Configuration, `Site URL` estaba configurada como
  `http://localhost:3000`.
- La lista de `Redirect URLs` estaba vacía.
- El frontend publicado enviaba correctamente como `redirectTo` la ruta del origen vigente más
  `/recuperar-contrasena`.

## Mutación autorizada y aplicada

| Campo | Valor aplicado |
| --- | --- |
| Site URL | `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site` |
| Redirect URL | `https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site/recuperar-contrasena` |

Ambos valores fueron observados nuevamente después de recargar el Dashboard de Supabase.

## Límites

- No se modificaron usuarios, contraseñas, plantillas de correo, proveedores, schema, RLS, RPC,
  Storage ni datos.
- No se registraron correos, enlaces completos de recuperación, tokens ni sesiones.
- La persistencia de la configuración no demuestra todavía entrega de un vínculo nuevo, evento
  `PASSWORD_RECOVERY`, actualización de contraseña ni inicio de sesión posterior.
- Los vínculos emitidos antes de este cambio conservan el redirect anterior y no sirven como
  retest.

## Retest mínimo

Solicitar un vínculo nuevo desde `/recuperar-acceso`, abrir únicamente el correo nuevo y confirmar
que llega a `/recuperar-contrasena`. La persona responsable introduce la nueva contraseña sin
compartirla ni registrarla.

