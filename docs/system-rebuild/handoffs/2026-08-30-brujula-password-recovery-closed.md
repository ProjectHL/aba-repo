# Brújula — recuperación de contraseña cerrada

Fecha: 2026-08-30

## Estado ejecutivo

El recovery publicado quedó operativo. Tras corregir la configuración de URLs en Supabase Auth,
el responsable solicitó un vínculo nuevo y confirmó que recuperó la contraseña. El defecto de
redirect a localhost queda cerrado; no se almacenó información sensible.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Frontend recovery | enlace y rutas publicados | verde |
| Configuración Auth | Site URL y redirect exacto persistidos | verde |
| Recovery end-to-end | completado por el responsable | verde |
| Inicio de sesión posterior | no confirmado en este hito | pendiente mínimo |
| Google OAuth | sin evidencia operativa | pendiente P2 |
| Informes/PDF | publicados; smoke autenticado pendiente | siguiente gate |
| Supabase | sólo configuración Auth autorizada | sin otras mutaciones |

## Evidencia enlazada

- `docs/system-rebuild/test-runs/2026-08-30-password-recovery-published-smoke.md` — confirmación del
  recovery completo.
- `docs/system-rebuild/test-runs/2026-08-30-supabase-auth-redirect-fix.md` — causa y corrección.
- `docs/system-rebuild/test-runs/2026-08-30-private-staging-auth-recovery-publication.md` —
  publicación y smoke de rutas.

## P0/P1/P2

- P0: ninguno reproducido en este flujo.
- P1 cerrado: redirect de recovery a localhost.
- P2 abierto: Google OAuth sin evidencia operativa.
- P2 abierto: `PERF-14-001`.

## Límites vigentes

- No registrar credenciales, correos, tokens, enlaces completos ni sesiones.
- No ampliar audiencia ni usar datos clínicos reales.
- No modificar otras opciones de Auth, schema, RLS, RPC, Storage o datos sin spec y autorización.
- El recovery verde no demuestra todavía el smoke autenticado de Informes/PDF.

## Siguiente norte

**Único objetivo siguiente:** iniciar sesión con la contraseña nueva y, si funciona, ejecutar el
smoke autenticado sintético de Slice 15 en las tres rutas de Informes.

**Autorización requerida:** el responsable introduce personalmente sus credenciales; después debe
autorizar el smoke autenticado con fixtures sintéticos y, por separado, la escritura de un PDF
dentro del workspace.

**No objetivos:** no habilitar Google OAuth, no usar datos reales, no ampliar audiencia y no
modificar Supabase durante el smoke salvo una nueva autorización.

## Skills y agentes

1. Cargar `aba-authenticated-e2e-evidence` antes del smoke autenticado.
2. Cargar `browser:control-in-app-browser` o `chrome:control-chrome` según la sesión disponible.
3. Cargar `pdf:pdf` sólo antes de crear/verificar el PDF autorizado dentro del workspace.
4. Cargar `supabase:supabase` sólo si el smoke requiere diagnóstico remoto.
5. Cargar `brujula` al cerrar el gate.
6. Agente primario activo; no hay subagentes ni delegación.

