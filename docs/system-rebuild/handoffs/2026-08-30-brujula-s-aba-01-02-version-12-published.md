# Brújula — S-ABA-01/02 publicadas en staging privado

Fecha: 2026-08-30

## Estado ejecutivo

El candidato local verde de S-ABA-01 y S-ABA-02 fue publicado como versión 12 del Site staging
privado. La publicación es verificable; el smoke autenticado de navegador permanece pendiente y
por eso el gate integral aún no se cierra.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Regresión y build | 139/139, TypeScript, lint, preflight y Worker | verde |
| Fuente publicada | commit y archivo de build concordantes | verde |
| Audiencia | propietaria única, sin grupos ni externos | verde/privada |
| Despliegue staging | versión 12 | verde |
| UI autenticada S-ABA-01/02 | no ejecutada aún | pendiente |
| Supabase en este paso | sin mutaciones | sin cambio |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-30-s-aba-01-02-private-staging-publication.md`
- `docs/system-rebuild/test-runs/2026-08-30-s-aba-01-02-local-staging.md`
- `specs/s-aba-01-student-authorization-access/web-publication.md`
- `specs/s-aba-02-minimum-record-consent/web-publication.md`

## P0/P1/P2

- P0: ninguno observado en publicación o gates automatizados.
- P1 de validación: smoke autenticado visible pendiente; no se interpreta como defecto todavía.
- P2: bundle principal superior a 500 kB sin comprimir; code splitting pendiente.
- P2 preexistente: protección de contraseñas filtradas de Supabase Auth deshabilitada.

## Límites vigentes

- Sólo datos e identidades sintéticos; los registros permanecen.
- No datos reales, Storage, firma, producción clínica, VPS ni ampliación de audiencia.
- No borrar artefactos o registros históricos.

## Siguiente norte

**Único objetivo:** ejecutar el smoke autenticado visible de S-ABA-01 y S-ABA-02 sobre la versión
12 y documentar cualquier brecha.

**Autorización requerida:** lectura de
`C:\Users\Moonlabpc\.codex\plugins\cache\openai-bundled\browser\26.825.32147\skills\control-in-app-browser\SKILL.md`
para controlar la sesión autenticada existente.

**No objetivos:** nueva publicación, Supabase, VPS, producción, datos reales o nuevas specs.

## Skills y agentes

1. `browser:control-in-app-browser` antes de interactuar con la sesión visible.
2. `aba-authenticated-e2e-evidence` durante el flujo sintético.
3. `brujula` al cerrar o bloquear el smoke.
4. `supabase:supabase` sólo para diagnóstico remoto read-only si aparece una brecha.

Agente primario activo; sin subagentes. La delegación permanece deshabilitada salvo solicitud
explícita y siempre bajo workspace, no borrado, datos sintéticos y sin producción.

