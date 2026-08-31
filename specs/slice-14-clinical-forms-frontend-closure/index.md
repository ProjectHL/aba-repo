# Slice 14 — cierre frontend de todos los formularios clínicos

## Estado

**Aprobada por el usuario el 2026-08-25 para implementación frontend. No autoriza migración ni despliegue.**

Esta es una sola spec paraguas. Los cuatro archivos de capa son partes obligatorias del mismo
contrato y no specs independientes:

- `frontend.md` — pantallas, campos, estados y navegación;
- `backend.md` — puertos y payloads sin NestJS;
- `supabase.md` — frontera entre persistido y sólo frontend;
- `web-publication.md` — gates de candidato, sin publicar;
- `bdd.md` — recorridos Given/When/Then.

## Objetivo

Cerrar en React todas las pantallas y acciones de formularios clínicos observadas entre S-03 y
S-11, aunque algunos módulos funcionen únicamente como borradores frontend. El usuario debe poder
recorrer alta, ficha, contexto, historia, evaluaciones, adquisición, reducción y sesión sin botones
decorativos, campos inconexos ni falsas confirmaciones de persistencia.

## Evidencia y clasificación

| Grupo | Evidencia | Clasificación |
| --- | --- | --- |
| alta, familia, escolarización, historia | E-002–E-006 | campos observed; guardado completo inferred |
| ficha, consentimiento, usuarios | E-007–E-008 | pantallas observed; permisos/estados inferred |
| entrevista dinámica | E-009 | matriz observed; payload implementado propuesto |
| preferencias/funcional | E-010–E-011 | campos/modal observed; obligatoriedad inferred |
| adquisición | E-013–E-014 | formulario/protocolo observed |
| reducción | E-015–E-016 | formulario/función observed |
| sesión | E-017–E-018 | captura observed; cierre/corrección inferred |

La implementación existente y sus pruebas no reclasifican como `observed` una transición ausente
del video.

## Alcance funcional

1. CF-01: base común de formularios y máquina de estados.
2. CF-02: contexto hogar/colegio y resumen de ficha, sólo memoria.
3. CF-03: historia clínica estructurada, sólo memoria.
4. CF-04: entrevista dinámica v1 — ya implementada y persistida en `assessments.payload`.
5. CF-05: preferencias y evaluación funcional con payloads tipados.
6. CF-06: programas/metas y planes de conducta con formularios tipados.
7. CF-07: registro de sesión por cuatro dimensiones — ya implementado y persistido.
8. CF-08: brújula de expediente y acciones `Continuar` entre módulos.

## Regla de verdad de persistencia

Cada módulo muestra una de estas etiquetas autoritativas:

| Estado | Texto permitido | Significado |
| --- | --- | --- |
| `remote` | `Guardado en staging con RLS` | repositorio confirmó escritura |
| `frontend-draft` | `Borrador temporal · no guardado` | sólo memoria React; se pierde al recargar |
| `blocked` | `Contrato pendiente · no editable` | sin formulario activo |
| `non-persistent-file` | `Archivo seleccionado · no cargado` | nombre local efímero; binario descartado |

Prohibido usar `Guardado`, `Completado` o un check verde para `frontend-draft`.

## Seguridad y privacidad

- Exclusivamente datos sintéticos; todos los formularios rechazan RUT y correos en texto libre.
- Los borradores frontend viven sólo en memoria: sin localStorage, sessionStorage, IndexedDB, URL,
  logs, analytics ni service worker.
- Al cerrar/reload se pierden y la UI debe advertirlo.
- Adjuntos no se leen, suben ni convierten a base64; sólo se puede mostrar el nombre efímero.
- Consentimiento y usuarios asignados permanecen `blocked`; no se inventan permisos clínicos.
- No se incorpora nombre completo, RUT, correo de paciente ni datos reales.

## No objetivos

Persistir contexto/historia, Storage, corrección retroactiva de sesiones, consentimiento real,
gestión de accesos, firma, auditoría legal completa, NestJS, producción, Sites, informe de evaluación
13C o PDF completo 13D.

## Orden TDD obligatorio

Cada lote sigue: spec aprobada → prueba roja → implementación mínima → refactor → prueba focalizada
→ regresión → BDD. No se abren nuevas specs entre CF-01 y CF-08: todo se ejecuta dentro de esta
spec paraguas y se registra en `docs/system-rebuild/test-runs/`.

## Definition of Done

- Cada formulario del inventario tiene campos, validación, vacío, error, éxito o revisión temporal.
- Añadir/quitar filas conserva las demás y funciona con teclado.
- Los módulos remotos conservan valores ante error y distinguen escritura de refresco fallido.
- Los módulos sólo frontend sobreviven a cambios de pestaña dentro del expediente, pero no a reload.
- Ningún módulo afirma persistencia que no ocurrió.
- Un progreso visible enlaza alta → ficha → evaluaciones → programas → reducción → sesión → informes.
- 0 P0/P1 abiertos en frontend, full Vitest/typecheck/lint/build verdes y BDD sintético documentado.

## Stop conditions

Detener y pedir aprobación antes de crear tablas/columnas, cambiar RLS/RPC, persistir un borrador
temporal, habilitar Storage, modificar consentimiento/acceso, usar datos reales o desplegar.
