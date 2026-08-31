# Brújula — S-ABA-01/02 en staging privado v13, autenticación bloqueada

Fecha: 2026-08-31

## Estado ejecutivo

La versión 13 corrigió el empaquetado roto de la versión 12 y está desplegada en el Site staging
privado. El preflight autocontenido fue revalidado. El smoke autenticado no llegó a la aplicación
porque OpenAI Auth devolvió error 500 al seleccionar la cuenta en dos intentos. El slice conserva
sus verificaciones locales/remotas previas, pero el gate visible de esta publicación sigue abierto.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Regresión de implementación | 139/139, TypeScript, lint y SQL previamente verdes | verde previo |
| Corrección de publicación | Worker autocontenido, preflight 18 archivos | verde |
| Despliegue staging | versión 13, `succeeded`, audiencia privada | verde |
| Entrada por Sites | puerta privada visible en `/clientes` | observado |
| OpenAI Auth | error 500 repetido tras seleccionar cuenta | bloqueado externo |
| UI autenticada S-ABA-01/02 v13 | no alcanzada | pendiente |
| Supabase en este paso | sin mutaciones | sin cambio |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-31-s-aba-01-02-version-13-auth-smoke.md`
- `docs/system-rebuild/test-runs/2026-08-30-s-aba-01-02-private-staging-publication.md`
- `docs/system-rebuild/test-runs/2026-08-30-s-aba-01-02-local-staging.md`
- `specs/s-aba-01-student-authorization-access/web-publication.md`
- `specs/s-aba-02-minimum-record-consent/web-publication.md`

## P0/P1/P2

- P0: ninguno nuevo reproducido en S-ABA-01/02.
- P1 de validación: gate visible autenticado pendiente por bloqueo externo; no clasificado como
  defecto funcional de ABA Data Hub.
- P2: bundle principal superior a 500 kB sin comprimir; code splitting pendiente.
- P2 preexistente: protección de contraseñas filtradas de Supabase Auth deshabilitada.

## Límites y stop conditions

- Sólo datos e identidades sintéticos; no datos clínicos reales.
- No Supabase, Storage, producción, VPS ni ampliación de audiencia durante el retest.
- No borrar versiones, artefactos ni registros históricos.
- No declarar el gate autenticado verde a partir del preflight o de la puerta de acceso.

## Siguiente norte

**Único objetivo:** repetir el smoke autenticado de lectura de S-ABA-01/02 en staging v13 cuando
OpenAI Auth deje completar la selección de cuenta.

**Autorización requerida:** seleccionar la cuenta de ChatGPT en el momento del retest, porque
transmite la identidad al Site privado. Si la sesión ya está autenticada, basta autorizar el control
de esa pestaña visible.

**No objetivos:** nueva publicación, cambios en Supabase, creación de registros, VPS, producción,
datos reales o nueva spec.

## Skills y agentes

1. `browser:control-in-app-browser` antes de interactuar con el navegador.
2. `aba-authenticated-e2e-evidence` sólo si el acceso llega a la aplicación y comienza el smoke.
3. `brujula` al cerrar o volver a bloquear el gate.
4. `supabase:supabase` sólo ante un diagnóstico remoto explícitamente autorizado.

Agente primario activo; sin subagentes. La delegación permanece deshabilitada salvo solicitud
explícita y bajo workspace, no borrado, datos sintéticos y sin producción.
