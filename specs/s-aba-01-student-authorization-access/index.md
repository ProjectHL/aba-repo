# S-ABA-01 — autorización y acceso por estudiante

Estado: **implementada en local y Supabase `ABA_staging`; publicación web pendiente**  
Fecha: 2026-08-30

## Objetivo

Definir quién puede descubrir, ver y operar sobre cada recurso de un estudiante sintético, y cómo
se solicita, decide, vence o revoca una autorización adicional. La membresía de organización es
necesaria, pero no suficiente, para acceder a un estudiante.

## Evidencia y límites

| Clasificación | Evidencia |
| --- | --- |
| Observado | Existen supervisor principal, coordinador/secundario, terapeuta y familia; el acceso se concede por estudiante. |
| Observado | El supervisor administra; el coordinador puede solicitar edición; el terapeuta registra; la familia ve resultados limitados. |
| Existente | `memberships` controla organización, rol y estado; las RLS actuales abren lectura a toda membresía activa de la organización. |
| Propuesto | Separar membresía, asignación al estudiante y capacidades atómicas. |
| Pendiente | Matriz exacta, vigencia de grants y contenido familiar: DEC-ABA-01/02. |

Este slice usa únicamente fixtures sintéticos. No autoriza datos reales, cambios de Auth, schema,
RLS, RPC, backend, Sites ni despliegues.

## Modelo de decisión propuesto

Una operación se permite sólo cuando todas estas condiciones son verdaderas:

1. identidad autenticada;
2. membresía activa en la organización del estudiante;
3. asignación activa al estudiante;
4. rol base compatible con la operación;
5. cuando corresponda, grant vigente para el recurso y la acción;
6. ninguna revocación o estado incompatible.

La respuesta para un estudiante no asignado debe ser indistinguible de “no encontrado”. La UI no
es una frontera de autorización.

## Recursos y operaciones atómicas

| Recurso | Operaciones en S-ABA-01 |
| --- | --- |
| Expediente | descubrir, ver, editar |
| Programa | listar, ver, crear, editar |
| Configuración de registro | ver, crear, editar |
| Registro de sesión | ver, capturar, enviar; corregir queda fuera de S-ABA-01 |
| Gráfico/resultado | ver, editar configuración, descargar |
| Autorización | solicitar, aprobar, denegar, revocar, consultar estado |
| Chat | sólo reservar la capacidad; contenido y uso quedan bloqueados por DEC-ABA-10 |

## Matriz candidata

`A` = permitido por rol base y asignación; `G` = requiere grant explícito; `L` = vista familiar
limitada; `—` = denegado; `F` = fuera de alcance/bloqueado.

| Recurso / operación | Supervisor principal | Coordinador | Terapeuta | Familia |
| --- | :---: | :---: | :---: | :---: |
| Expediente: ver | A | A | A | — |
| Expediente: editar | A | G | — | — |
| Programa: listar/ver | A | A | A | L |
| Programa: crear/editar | A | G | — | — |
| Configuración de registro: ver | A | A | A | — |
| Configuración de registro: crear/editar | A | G | — | — |
| Registro: ver | A | A | A | — |
| Registro: capturar/enviar | A | A | A | — |
| Registro: corregir | F | F | F | F |
| Gráfico/resultado: ver | A | A | A | L |
| Gráfico: editar configuración | A | G | — | — |
| Resultado: descargar | A | A | A | — |
| Autorización: solicitar | — | A | — | — |
| Autorización: decidir/revocar | A | — | — | — |
| Chat | F | F | F | — |

La tabla es una propuesta para resolver DEC-ABA-01/02, no una autorización vigente.

## Estados y transiciones candidatos

| Estado | Entrada | Salida permitida |
| --- | --- | --- |
| `unassigned` | sin asignación activa | asignación administrativa fuera de este flujo |
| `assigned` | asignación activa y rol base | solicitar grant cuando el rol lo permita |
| `pending` | solicitud única abierta por estudiante + recurso + acciones | aprobar o denegar |
| `approved` | decisión del supervisor principal | vencer o revocar |
| `denied` | decisión del supervisor principal | nueva solicitud sólo como evento nuevo |
| `expired` | `expires_at <= now()` | nueva solicitud |
| `revoked` | revocación explícita | nueva solicitud |

Denegar, vencer o revocar no elimina filas. Toda transición conserva historial append-only y surte
efecto en la siguiente evaluación autoritativa.

## Decisiones aprobadas

| ID | Propuesta conservadora | Estado |
| --- | --- | --- |
| D01 | unidad = estudiante + recurso + conjunto de acciones | aprobada 2026-08-30 |
| D02 | roles canónicos = supervisor, coordinator, therapist, family | aprobada 2026-08-30 |
| D03 | supervisor principal es el único aprobador y no puede aprobar una solicitud propia | aprobada 2026-08-30 |
| D04 | todo grant aprobado vence a los 90 días; el supervisor puede fijar una fecha anterior | aprobada 2026-08-30 |
| D05 | una solicitud pendiente no se duplica; denegación permite una nueva solicitud con nuevo motivo | aprobada 2026-08-30 |
| D06 | familia ve sólo programa publicado, estado y resumen derivado aprobado; nunca datos crudos ni expediente clínico | aprobada 2026-08-30 |
| D07 | descarga familiar queda denegada; descarga profesional conserva autorización por estudiante | aprobada 2026-08-30 |
| D08 | `admin/clinician/viewer` no se reinterpretan silenciosamente; requieren migración/mapeo explícito | aprobada 2026-08-30 |
| D09 | notificación inicial sólo dentro de la aplicación; correo y chat quedan fuera de alcance | aprobada 2026-08-30 |

Aprobación explícita y autorización de implementación local/Supabase staging registradas el
2026-08-30. La implementación se verificó con identidades sintéticas; Auth, Sites, producción,
publicación y datos reales continúan fuera de alcance.

## Entregables por capa

- [frontend.md](frontend.md): estados, acciones visibles y respuestas accesibles.
- [backend.md](backend.md): decisión autoritativa y contratos de puertos.
- [supabase.md](supabase.md): modelo, RLS y auditoría aplicados en `ABA_staging`.
- [web-publication.md](web-publication.md): gates para candidato y publicación.
- [bdd.md](bdd.md): escenarios Given–When–Then con usuarios y estudiante sintéticos.

## Definition of Ready

S-ABA-01 quedó implementada mediante TDD local y verificación autenticada sintética en Supabase
staging. DEC-ABA-10 mantiene chat bloqueado; la familia continúa sin expediente profesional ni
tablas crudas. La publicación del candidato web requiere autorización separada.
