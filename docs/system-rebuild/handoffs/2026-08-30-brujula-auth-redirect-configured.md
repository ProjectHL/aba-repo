# Brújula — redirect de recovery configurado

Fecha: 2026-08-30

## Estado ejecutivo

Se corrigió en Supabase Auth la configuración que enviaba los vínculos de recovery a localhost.
La `Site URL` ahora apunta al staging privado y la ruta exacta `/recuperar-contrasena` quedó en la
allowlist. La configuración fue revalidada tras recargar el Dashboard; el recovery end-to-end aún
requiere un vínculo nuevo.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Frontend recovery | enlace y rutas publicados | verde |
| Site URL de Auth | staging privado persistido | corregida |
| Redirect URL de recovery | ruta exacta persistida | corregida |
| Recovery completo | vínculo nuevo, cambio e inicio posterior | pendiente de retest |
| Supabase | dos mutaciones de configuración Auth autorizadas | cambiado |
| Datos y permisos | sin cambios | preservados |

## Evidencia enlazada

- `docs/system-rebuild/test-runs/2026-08-30-supabase-auth-redirect-fix.md` — hallazgo, cambio y
  revalidación.
- `docs/system-rebuild/test-runs/2026-08-30-private-staging-auth-recovery-publication.md` —
  publicación de las rutas de recovery.
- `specs/slice-07/supabase.md` y `specs/slice-07/web-publication.md` — contrato del redirect exacto.

## P0/P1/P2

- P0: ninguno reproducido en este alcance.
- P1 corregido, pendiente de cierre E2E: redirect de recovery a localhost.
- P2 abierto: Google OAuth sin evidencia operativa.
- P2 abierto: `PERF-14-001`.

## Límites vigentes

- No usar vínculos antiguos para el retest.
- No registrar correo, contraseña, token, enlace completo ni sesión.
- No modificar otras opciones de Supabase Auth, usuarios, schema, RLS, RPC, Storage o datos.
- El cambio de configuración no sustituye el smoke end-to-end.

## Siguiente norte

**Único objetivo siguiente:** solicitar un vínculo nuevo y confirmar que permite cambiar la
contraseña e iniciar sesión en staging.

**Autorización requerida:** ninguna para que la persona responsable complete manualmente el flujo;
si el agente debe escribir el correo o pulsar `Enviar vínculo`, requiere confirmación inmediata.

**No objetivos:** no reutilizar correos antiguos, no habilitar Google OAuth, no cambiar plantillas,
no tocar datos clínicos y no iniciar todavía el smoke de Informes/PDF.

## Skills y agentes

1. Usar `browser:control-in-app-browser` o `chrome:control-chrome` sólo si se solicita asistencia
   durante el retest.
2. Usar `supabase:supabase` si surge otro diagnóstico o cambio remoto.
3. Usar `brujula` al cerrar el recovery end-to-end.
4. Agente primario activo; no hay subagentes y no hubo delegación.

