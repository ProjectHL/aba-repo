# Brújula — recuperación de acceso publicada

Fecha: 2026-08-30

## Estado ejecutivo

El candidato validado fue versionado y publicado como versión 11 del Site privado de staging. El
defecto observado en la versión anterior —Login sin enlace de recuperación y rutas de recovery
redirigidas a Login— quedó cerrado en el smoke público de navegación. No se ejecutó todavía el
envío de correo ni el cambio real de contraseña.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Git de la aplicación web | historial local/remoto integrado sin force push | vigente |
| Gates automatizados | 137/137, TypeScript, ESLint y preflight | verdes |
| Publicación privada | versión 11 activa | publicada |
| Entrada a recovery | enlace y `/recuperar-acceso` observados en vivo | cerrada |
| Recovery completo | correo, callback, cambio e inicio posterior | pendiente |
| Google OAuth | no revalidado como habilitado | pendiente |
| Slice 15 Informes/PDF | implementación incluida en la versión publicada | falta smoke autenticado/PDF físico |
| Supabase | sin mutaciones en este hito | sin cambio |

## Evidencia enlazada

- `docs/system-rebuild/test-runs/2026-08-30-private-staging-auth-recovery-publication.md` — gates,
  publicación privada y smoke observado.
- `docs/system-rebuild/test-runs/2026-08-25-password-recovery-smoke.md` — antecedente del recovery
  completo validado antes de la publicación desfasada.
- `docs/system-rebuild/test-runs/2026-08-29-slice-15-local-release-loop.md` — candidato local de
  Informes/PDF incorporado en esta publicación.
- `specs/slice-07/web-publication.md` — contrato de Redirect URL para recuperación.
- `specs/slice-15-complete-clinical-reports-pdf/` — contrato vigente de Informes/PDF.

## P0/P1/P2

- P0: ninguno reproducido en este gate limitado.
- P1 cerrado: `AUTH-RECOVERY-PUBLISHED-ROUTES`; el enlace y la ruta pública están disponibles en
  la versión 11.
- P1 pendiente de retest, no confirmado como fallo: entrega del correo, callback
  `PASSWORD_RECOVERY`, cambio de contraseña e inicio posterior.
- P2 abierto: Google OAuth continúa sin evidencia de habilitación operativa.
- P2 abierto: `PERF-14-001`, bundle principal de 296.24 kB gzip.

## Límites vigentes

- Site privado, únicamente fixtures sintéticos y ninguna ampliación de audiencia.
- No registrar ni documentar correos, contraseñas, enlaces completos, tokens o sesiones.
- No modificar Supabase Auth, Redirect URLs, schema, RLS, RPC, Storage o datos sin spec y
  autorización separada.
- No enviar correo de recuperación sin confirmación inmediata del responsable.
- El despliegue de Informes no equivale a smoke autenticado, archivo PDF verificado ni lecturas
  RLS demostradas.

## Siguiente norte

**Único objetivo siguiente:** completar el recovery end-to-end de la cuenta del responsable y
confirmar que permite iniciar sesión.

**Autorización requerida:** confirmación inmediata antes de introducir el correo y pulsar `Enviar
vínculo`; el responsable introduce por sí mismo cualquier contraseña nueva y no la comparte.

**No objetivos:** no habilitar Google OAuth, no cambiar Redirect URLs, no modificar Supabase, no
usar datos clínicos y no iniciar todavía el smoke autenticado de Informes/PDF.

## Skills y agentes del siguiente chat

1. Cargar `browser:control-in-app-browser` o `chrome:control-chrome` antes del retest, según dónde
   esté la sesión del responsable.
2. Cargar `supabase:supabase` sólo si el retest exige diagnosticar o cambiar configuración remota;
   cualquier cambio requiere spec y autorización separada.
3. Cargar `aba-authenticated-e2e-evidence` únicamente después de recuperar el acceso y cuando se
   autorice el smoke sintético de Informes.
4. Cargar `brujula` al cerrar el retest o cambiar nuevamente el estado.
5. Agente primario: conserva trazabilidad. No hay subagentes activos y no se delegó este hito.

