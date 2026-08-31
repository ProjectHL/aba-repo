# Publicación privada y smoke de recuperación de acceso

Fecha: 2026-08-30  
Entorno: ABA Data Hub staging privado  
Datos: no se ingresaron correos, contraseñas ni datos clínicos

## Resultado

La versión 11 fue publicada correctamente en el Site privado existente:
`https://aba-data-hub-staging.hbarrera-dgr.chatgpt.site`.

## Gates previos

| Gate | Resultado |
| --- | --- |
| Vitest | PASS — 31 archivos, 137/137 |
| TypeScript | PASS |
| ESLint | PASS |
| Build staging nuevo | PASS |
| Preflight del candidato | PASS — 17 archivos |
| Worker autocontenido | PASS — 14 archivos, fallback SPA y asset versionado |
| Acceso Sites | owner-only, sin visitantes externos ni grupos |

El código validado quedó versionado en el repositorio Git acotado a `apps/web` y se integró con el
historial remoto sin force push. El empaquetado conservó sus carpetas de preparación dentro de
`apps/web/verification/`; no se borró ni movió ningún artefacto.

## Smoke publicado observado

- `/login` responde y muestra el enlace `¿Olvidaste tu contraseña?` hacia `/recuperar-acceso`.
- `/recuperar-acceso` permanece en esa ruta y muestra correo, `Enviar vínculo` y retorno a Login.
- El fallback SPA publicado ya no redirige esas rutas al Login por ausencia del bundle actualizado.
- No se envió un correo de recuperación y no se inspeccionaron tokens, sesiones ni credenciales.

## Límites

- No hubo mutaciones de Supabase, Auth, Redirect URLs, schema, RLS, RPC, Storage ni datos.
- El smoke no demuestra entrega de correo, evento `PASSWORD_RECOVERY`, cambio de contraseña ni
  inicio de sesión posterior.
- Google OAuth permanece fuera de este gate; no se declara habilitado.
- No se amplió la audiencia del Site y no se usaron datos clínicos reales.

## Retest mínimo pendiente

Con confirmación inmediata del responsable, solicitar un vínculo para su cuenta, completar el
recovery sin registrar correo, token o contraseña y verificar el inicio de sesión posterior.

