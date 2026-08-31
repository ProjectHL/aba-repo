# Brújula — S-ABA-03 v14 publicada; E2E listo para continuar

Fecha: 2026-08-31

## Estado ejecutivo

S-ABA-03 está implementada localmente, tiene schema/contrato verde en `ABA_staging` y fue publicada
como Sites versión 14. El acceso privado y el login visible funcionan. La slice no está cerrada:
el E2E se pausó deliberadamente antes de crear el primer fixture sintético persistente.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| D03-01–D03-08 | aprobadas | verde |
| Código local | commit `8daed58`; 147/147 + tipos + lint | verde |
| Supabase | 018/019 + contrato 006 | verde schema |
| Sites | versión 14 en URL staging | verde |
| Acceso | privado; una cuenta; sin grupos/externos | verde |
| Auth visible | login ChatGPT → `/clientes` | verde |
| Fixture `UV` | formulario preparado, no enviado | pendiente confirmación |
| BDD-03-01–12 | no ejecutado | P1 abierto |
| S-ABA-04–10 | no iniciadas | pendiente |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-sites-v14-auth-handoff.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-staging-schema.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-local-tdd.md`
- `specs/s-aba-03-program-lifecycle/`

## P0/P1/P2

- P0: ninguno demostrado en los gates local, schema o publicación; no extrapolar al E2E.
- P1 abierto: BDD autenticado y matriz RLS BDD-03-01–12 no ejecutados.
- P2: `PERF-14-001`; chunk principal 1,024.44 kB minificado / 304.30 kB gzip.
- Preexistentes fuera del cambio: advisors de funciones `SECURITY DEFINER` anteriores y protección
  de contraseñas filtradas deshabilitada; no modificados.

## Límites y stop conditions

- Sólo `ABA_staging`, identidades y datos ficticios adultos; nunca producción ni datos reales.
- No borrar, archivar, truncar, mover ni limpiar fixtures o artefactos.
- Confirmar en el navegador justo antes de persistir el formulario preparado.
- No inspeccionar ni revelar contraseñas, tokens, correos o IDs de usuario.
- No iniciar S-ABA-04, VPS, Storage, IA, chat, exportación u offline en este gate.

## Siguiente norte

**Único objetivo:** obtener confirmación puntual, persistir el expediente ficticio `UV /
E2E-SABA03-20260831` y completar BDD-03-01–12 en la versión 14.

**Autorización requerida:** confirmar el envío del formulario que creará el expediente sintético y
sus registros posteriores persistentes en `ABA_staging`. La publicación ya está autorizada y hecha.

**No objetivos:** cambios de schema adicionales, producción, borrado, S-ABA-04–10 o ampliación de
audiencia.

## Skills y agentes

1. `browser:control-in-app-browser` antes de recuperar/reabrir la sesión y operar la UI.
2. `aba-authenticated-e2e-evidence` antes de persistir y documentar el flujo.
3. `supabase:supabase` sólo para verificaciones remotas de lectura; no usar credenciales service role.
4. `aba-bdd-flow-validation` para clasificar BDD-03-01–12 y brechas.
5. `aba-mvp-qa-release-loop` si aparece un defecto que requiera código; `brujula` al cierre.

Agente primario activo; sin subagentes. No delegar salvo solicitud explícita; cualquier agente debe
heredar workspace único, no borrado, datos sintéticos y prohibición de producción.

## Mensaje inicial listo para el nuevo chat

> Continúa desde `docs/system-rebuild/handoffs/2026-08-31-new-chat-continuity-s-aba-03-v14-e2e.md`.
> S-ABA-03 está publicada como versión 14 y autenticada. Reanuda el formulario sintético preparado
> en `/clientes/nuevo`, pide confirmación puntual antes de pulsar `Continuar con datos sintéticos`,
> y completa BDD-03-01–12 sin borrar fixtures ni usar datos reales.
