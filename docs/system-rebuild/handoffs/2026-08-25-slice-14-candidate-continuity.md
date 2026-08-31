# Handoff — Slice 14 candidato de formularios

Fecha: 2026-08-25

## Estado

Slice 14 está en **candidato funcional**:

- 130/130 tests verdes;
- TypeScript y ESLint verdes;
- build aislado verde en `apps/web/verification/release-20260825-slice14-forms-02`;
- 45/45 escenarios BDD seleccionados verdes;
- login responsive validado a 320×800 y 1440×900;
- consola del navegador limpia;
- 0 P0/P1 abiertos.

Se corrigió mediante TDD el P2 `UXP-14-001` de tildes en rótulos clínicos.

## Pendiente exacto

`GAP-14-AUTH-VISUAL`: falta inspeccionar visualmente las rutas privadas con una sesión sintética
autenticada. La pestaña local está en `/login`; no se usaron credenciales almacenadas ni se crearon
datos remotos.

Cuando el usuario inicie sesión manualmente y confirme que está listo:

1. revisar ficha y cada pestaña clínica en escritorio;
2. repetir la ficha a 320 px;
3. abrir/cerrar formularios con teclado y Escape;
4. comprobar textos remote/frontend-draft/blocked;
5. no enviar formularios ni descargar PDF;
6. registrar evidencia y declarar Slice 14 cerrada si no hay P0/P1.

## Próxima spec después del cierre visual

Retomar informes clínicos completos y PDF como una spec separada. No mezclar el P2 de code splitting
ni persistencia adicional de contexto/historia sin aprobación nueva.

Evidencia principal:

`docs/system-rebuild/test-runs/2026-08-25-slice-14-final-gates-bdd.md`

