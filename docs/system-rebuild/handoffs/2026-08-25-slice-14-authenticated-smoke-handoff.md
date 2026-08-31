# Handoff — Slice 14 tras smoke visual autenticado

Fecha: 2026-08-25

## Estado

El smoke visual privado ya se ejecutó con sesión sintética autenticada, sin escribir ni descargar datos. La ficha `QA` (ID clínico `123123`) se validó en escritorio y 320×800: sin overflow, diálogos comprobados cierran con `Escape`, y los rótulos `remote`, `frontend-draft` y `blocked` son correctos.

Retest del 2026-08-26: al esperar 1,2 s por cada una de las cinco pestañas, no se reprodujeron las alertas tempranas de Programas ni Sesiones. La consola del navegador no mostró errores ni advertencias. `VIS-14-001` y `VIS-14-002` quedan cerradas como observaciones transitorias de la primera lectura, sin cambios de código ni datos.

Retest final del 2026-08-26: con el servidor local restablecido, `SYNTH-RETEST-A` y `E2E-SYNTH-ALPHA` mostraron `Detalle del cliente` después de cuatro segundos, sin alerta de carga ni errores/warnings de consola. `BDD-14-09A` queda PASS.

## Evidencia

`docs/system-rebuild/test-runs/2026-08-25-slice-14-authenticated-private-smoke.md`

## Próximo paso exacto

Slice 14 queda cerrado. Abrir una spec separada para informes clínicos completos/PDF; no cambiar schema, RLS, consentimiento, acceso ni persistencia adicional de contexto/historia sin aprobación específica.
