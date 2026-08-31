# Slice 14 — investigación de retest autenticado

Fecha: 2026-08-26

## Hallazgo

Con el expediente sintético `QA` abierto, se repitieron las cinco pestañas privadas con espera de
1,2 s por acción. Información, Evaluación conductual, Programas de adquisición, Reducción de
conductas y Sesiones no mostraron alertas de carga; la consola permaneció sin errores ni
advertencias. Las alertas tempranas de Programas/Sesiones no son reproducibles y se cierran como
observación transitoria.

La primera tentativa de retest de `SYNTH-RETEST-A` y `E2E-SYNTH-ALPHA` coincidió con un
`ERR_CONNECTION_REFUSED` del servidor local. Tras restaurar el servidor, ambos expedientes se
cargaron por navegación visible y mostraron `Detalle del cliente` tras cuatro segundos. No hubo
alerta de carga, errores/warnings de consola, escritura, envío de formularios ni cambios de código.

## Próximo paso

`BDD-14-09A` queda PASS y Slice 14 puede cerrarse. El siguiente conjunto de escenarios pertenece
a la spec independiente de informes clínicos completos/PDF.
