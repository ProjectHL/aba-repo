# Handoff de continuidad — nuevo chat tras cierre de Slice 14

Fecha: 2026-08-26  
Workspace autorizado: `C:\Users\Moonlabpc\Desktop\aba 2` y descendientes solamente.

## Estado confirmado

Slice 14 (cierre frontend de formularios clínicos) está cerrado. No quedaron P0/P1 reproducibles.

- Gates locales: 130/130 tests, TypeScript, ESLint, build staging aislado y 45/45 escenarios BDD automatizados verdes.
- Smoke privado autenticado: ficha sintética, cinco pestañas, rótulos `remote` / `frontend-draft` / `blocked`, diálogos con `Escape`, escritorio y 320×800 validados.
- Retest de `SYNTH-RETEST-A` y `E2E-SYNTH-ALPHA`: ambas fichas cargaron `Detalle del cliente` tras cuatro segundos; consola sin errores ni advertencias.
- No hubo envíos de formularios, descargas de PDF, cambios de código, migraciones, RLS ni mutaciones remotas durante el smoke/retest.

## Artefactos autoritativos

1. `docs/system-rebuild/test-runs/2026-08-25-slice-14-final-gates-bdd.md` — gates técnicos y BDD automatizado.
2. `docs/system-rebuild/test-runs/2026-08-25-slice-14-authenticated-private-smoke.md` — evidencia visual autenticada y veredicto de cierre.
3. `docs/system-rebuild/test-runs/2026-08-26-slice-14-retest-investigation.md` — clasificación de alertas transitorias y retest de expedientes.
4. `docs/system-rebuild/handoffs/2026-08-26-brujula-slice-14-closed.md` — brújula vigente.
5. `specs/slice-14-clinical-forms-frontend-closure/` — contrato ya ejecutado; no extenderlo para informes/PDF.

## Próximo objetivo autorizado

Abrir una **nueva spec separada** para informes clínicos completos y PDF. No implementar hasta que
la persona usuaria apruebe el contrato de esa nueva spec.

La nueva spec debe decidir explícitamente, sin inventar:

- qué informes existen, su fuente de datos, filtros, estados vacíos/error y permisos;
- qué significa un informe "completo" y qué parte proviene de evidencia observada versus inferida;
- contenido, privacidad, formato y generación del PDF;
- si el PDF es sólo local, se descarga, se persiste o se audita;
- fronteras frontend, backend, Supabase y publicación.

## Límites que continúan vigentes

- No cambiar schema, RLS, RPC, Storage, consentimiento, usuarios asignados ni persistencia de contexto/historia sin una decisión aprobada.
- No usar datos reales, RUT, correos personales, pacientes ni credenciales de producción.
- No desplegar ni publicar.
- Mantener el P2 `PERF-14-001` (code splitting del chunk principal) fuera de la spec funcional de informes/PDF, salvo aprobación explícita de una spec de rendimiento.
- El archivo `specs/index.md` contiene referencias históricas que no sustituyen la brújula de cierre de Slice 14; reconciliarlo sólo dentro de una tarea documental aprobada.

## Skills obligatorias para el nuevo chat

| Momento | Skill | Uso obligatorio |
| --- | --- | --- |
| Antes de cualquier nueva spec o código | `aba-sdd-spec-first` | Leer índice activo y las cuatro capas; separar evidencia observada de inferencias; congelar objetivo, estados, contrato, seguridad, aceptación y stop conditions. |
| Toda tarea que toque Supabase o sus clientes | `supabase:supabase` | Aplicar sus reglas antes de inspeccionar o modificar Auth, RLS, esquema, Storage, RPC o clientes. |
| Consulta/diseño de SQL o schema | `supabase:supabase-postgres-best-practices` | Usar además del skill de Supabase. |
| Después de una spec aprobada y para cambios locales | `aba-tdd-validation` | Ciclo rojo-verde-refactor con pruebas focalizadas, regresión, typecheck, lint y build no destructivo. |
| Después de gates verdes | `aba-bdd-flow-validation` | Evidencia Given-When-Then con fixtures sintéticos, viewport/teclado y brechas explícitas. |
| Cierre de un cambio MVP local aprobado | `aba-mvp-qa-release-loop` | Preflight y evidencia de release; no autoriza despliegue. |
| Si se vuelve a reconstruir desde video/capturas | `video-screenshot-system-map` y después `screen-flow-map` | Extraer evidencia visible y modelar flujos sin convertir inferencias en hechos. |

## Agentes y coordinación

- Agente primario: `/root`. Mantiene el plan, lee las skills requeridas y conserva la trazabilidad de specs, evidencia y handoffs.
- Estado actual de subagentes: ninguno activo. No crear subagentes por defecto.
- Sólo delegar si la persona usuaria pide explícitamente agentes, delegación o trabajo paralelo, o si una skill aplicable lo exige.
- Todo subagente debe recibir: límite absoluto del workspace `C:\Users\Moonlabpc\Desktop\aba 2`, prohibición de borrado/movimiento, datos exclusivamente sintéticos, prohibición de producción/despliegue y el alcance acotado de su subtarea.
- Un subagente no puede aprobar inferencias, cambios de contrato ni una nueva spec; debe devolver evidencia al agente primario para su revisión.

## Primer mensaje sugerido para el nuevo chat

"Retoma desde `docs/system-rebuild/handoffs/2026-08-26-new-chat-continuity.md`. Quiero abrir la especificación separada de informes clínicos completos y PDF. Aplica primero `aba-sdd-spec-first`; no implementes ni cambies Supabase, publicación o datos reales hasta mi aprobación."
