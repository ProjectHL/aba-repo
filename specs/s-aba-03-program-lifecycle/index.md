# S-ABA-03 — programas ABA y ciclo de vida

Estado: **D03-01–D03-08 aprobadas; versión 14 publicada en staging; E2E autenticado pendiente**

## Objetivo

Completar el diseño versionable de programas de adquisición y conducta por estudiante, con un
ciclo de vida no destructivo y permisos consistentes con S-ABA-01. Esta slice configura programas;
no implementa todavía la sesión guiada ni recalcula gráficos.

## Evidencia y clasificación

| ID | Fuente | Hecho | Clase |
| --- | --- | --- | --- |
| E03-01 | `atomic-model-aba-contract.md` | programa de adquisición o conducta pertenece a estudiante | observado |
| E03-02 | misma | se mencionan activo, logrado, pausado y discontinuado | observado |
| E03-03 | `comparativo-spec.md` | existen programas/metas y planes mínimos persistidos | verificado |
| E03-04 | misma | faltan detalle clínico y correspondencia exacta de estados | verificado |
| I03-01 | esta candidata | borrador editable; versión nueva después de activar | inferido |
| I03-02 | esta candidata | pausa reactiva; logrado/discontinuado son terminales | inferido |

## Decisiones candidatas

| ID | Propuesta para aprobación |
| --- | --- |
| D03-01 | Un programa pertenece a un estudiante y tiene tipo inmutable `acquisition` o `behavior`. |
| D03-02 | Estados: `draft`, `active`, `paused`, `achieved`, `discontinued`; no existe eliminación. |
| D03-03 | Transiciones: draft→active/discontinued; active→paused/achieved/discontinued; paused→active/discontinued. Achieved y discontinued son terminales. |
| D03-04 | El borrador se edita en sitio; modificar diseño clínico activo crea una nueva versión y conserva la anterior. |
| D03-05 | Supervisor principal configura y cambia estados; coordinador sólo con grant `program:edit`; terapeuta ve y registra; familia no ve el diseño. |
| D03-06 | Una versión activada exige todos los campos obligatorios del tipo; un borrador puede estar incompleto. |
| D03-07 | El plan de crisis es texto informativo opcional y no sustituye un protocolo de emergencia. |
| D03-08 | Pausar impide nuevos registros, pero conserva historial; reactivar usa la misma versión. |

## Viaje de usuario

1. La profesional abre el expediente sintético y entra a Programas.
2. Crea un borrador de adquisición o conducta.
3. Completa el diseño y activa una versión válida.
4. Consulta lista filtrable por tipo y estado.
5. Pausa y reactiva sin perder historial.
6. Al cambiar un diseño activo, crea una versión sucesora auditable.
7. Marca logrado o discontinuado sin borrar registros previos.

## Estados y transiciones

| Desde | Acción | Hacia | Permitido a |
| --- | --- | --- | --- |
| draft | activar | active | supervisor / coordinador autorizado |
| draft | discontinuar | discontinued | supervisor / coordinador autorizado |
| active | pausar | paused | supervisor / coordinador autorizado |
| active | lograr | achieved | supervisor / coordinador autorizado |
| active | discontinuar | discontinued | supervisor / coordinador autorizado |
| paused | reactivar | active | supervisor / coordinador autorizado |
| paused | discontinuar | discontinued | supervisor / coordinador autorizado |

No hay transición desde `achieved` o `discontinued`. Una corrección posterior crea otra versión,
sin reescribir el registro terminal.

## Seguridad

La visibilidad y escritura se derivan de asignación activa y grants de S-ABA-01; ocultar botones no
sustituye RLS. Toda escritura valida `client_id`, tipo, versión y transición en la frontera remota.
No se expone contenido del diseño a familia en esta slice.

## No objetivos

- Captura de sesión, temporizadores, fórmulas o gráficos (S-ABA-04–07).
- Exportación, IA, chat u offline (S-ABA-08–10).
- Archivos, firma, Storage, datos reales o producción.
- Edición destructiva de versiones activadas o registros históricos.

## Gate de aprobación

D03-01–D03-08 fueron aprobadas el 2026-08-31. La implementación TDD local quedó verde con 147/147
pruebas, y las migraciones aditivas 018/019 más el contrato 006 quedaron verificadas en
`ABA_staging`. El frontend S-ABA-03 fue publicado como versión 14 con acceso privado y autenticación
visible aprobada. El E2E autenticado por UI continúa pendiente y requiere confirmar la creación de
fixtures sintéticos persistentes.
