# Slice 14 — smoke visual autenticado de rutas privadas

Fecha: 2026-08-25  
Entorno: frontend local Vite staging (`http://127.0.0.1:5173`)  
Sesión: usuario sintético autenticado manualmente; organización de staging  
Datos: sólo expedientes sintéticos ya existentes; no se crearon, enviaron ni modificaron formularios.  
Supabase: sin mutaciones intencionales durante la inspección.  
PDF: no solicitado ni descargado.

## Resultado ejecutivo

La sesión autenticada permitió completar la inspección privada de la ficha `QA` / ID clínico
`123123`. La ficha, la navegación por pestañas, los estados `frontend-draft`, `remote` y
`blocked`, y el viewport de 320×800 se comportaron como se esperaba. Los diálogos comprobados
cerraron con `Escape`.

La primera lectura inmediata de dos pestañas remotas mostró mensajes de carga fallida. El retest
controlado del 2026-08-26, con espera de 1,2 s por pestaña, no reprodujo ninguna alerta y mantuvo
la consola limpia. Esas observaciones se reclasifican como evidencia transitoria de transición,
no como P1 de panel abierto. El retest separado del 2026-08-26 confirmó además que ambos expedientes del listado cargan correctamente tras cuatro segundos. No se modificó código ni dato alguno.

## Matriz BDD — BDD-14-09

| ID | Given | When | Then observado | Evidencia | Resultado |
| --- | --- | --- | --- | --- | --- |
| BDD-14-09A | usuario sintético autenticado, listado privado con 3 clientes sintéticos | abre `SYNTH-RETEST-A` o `E2E-SYNTH-ALPHA` y espera estado estable | ambos expedientes muestran `Detalle del cliente`, sin alerta de carga ni errores/warnings de consola | retest 2026-08-26, 4 s por ruta | PASS |
| BDD-14-09B | misma sesión, cliente sintético `QA` | abre su ficha | ficha privada visible: iniciales, ID clínico, contexto y brújula | vista de escritorio; consola limpia | PASS |
| BDD-14-09C | ficha `QA` | recorre Información, Evaluación, Adquisición, Reducción y Sesiones | todas las pestañas son navegables y los textos de estado son visibles | DOM accesible y vista de escritorio | PASS tras retest controlado |
| BDD-14-09D | ficha `QA` | abre Contexto hogar/colegio, Entrevista inicial, Nuevo programa y Nuevo plan; pulsa `Escape` | cada diálogo se cierra sin envío de formulario | títulos de diálogo y cierre por teclado | PASS |
| BDD-14-09E | ficha `QA`, 320×800 | inspecciona Información | `scrollWidth = clientWidth = 305`; no hay desbordamiento horizontal; ficha y pestañas siguen legibles | viewport temporal, luego restaurado | PASS |
| BDD-14-09F | ficha `QA` | inspecciona rótulos de persistencia | se muestran `Borrador temporal · no guardado`, `Conectado a staging` y `Contrato pendiente · no editable` con el significado correcto | pestañas Información y Evaluación | PASS |

## Observaciones iniciales y retest

### VIS-14-001 — lectura temprana de programas/metas

- Severidad inicial: P1 candidata; estado final: cerrada, no reproducida.
- Ruta/fixture: ficha `QA` / pestaña `Programas de adquisición`.
- Resultado visible: `No se pudieron cargar los programas y metas.`
- Retest 2026-08-26: tras 5 s y después tras 1,2 s de carga estable, la alerta no apareció y la lista vacía se mostró correctamente.
- Consola: 0 errores y 0 advertencias capturados.
- Estado: cerrado como observación transitoria; no se modificaron datos ni código.

### VIS-14-002 — lectura temprana de objetivos de sesión

- Severidad inicial: P1 candidata; estado final: cerrada, no reproducida.
- Ruta/fixture: ficha `QA` / pestaña `Sesiones`.
- Resultado visible: `No se pudieron cargar los objetivos de la sesión.`
- Retest 2026-08-26: tras 5 s y después tras 1,2 s de carga estable, la alerta no apareció y el estado vacío de planes/metas se mostró correctamente.
- Consola: 0 errores y 0 advertencias capturados.
- Estado: cerrado como observación transitoria; no se enviaron sesiones.

## Límites de la ejecución

- No se enviaron formularios, no se creó información clínica ni se ejecutaron descargas.
- La primera vista de dos expedientes sintéticos mostró error de carga; no se realizaron reintentos destructivos. El expediente `QA` quedó disponible posteriormente sin intervención de escritura.
- Este resultado visual no reclasifica persistencia, permisos ni transiciones no observadas en el video fuente.

## Veredicto y siguiente paso

`GAP-14-AUTH-VISUAL` queda cerrado: la ficha `QA`, las cinco pestañas, los diálogos con teclado, el viewport estrecho y los otros dos expedientes sintéticos no presentan P0/P1 reproducibles. El siguiente trabajo puede abrir la spec separada de informes clínicos completos/PDF, sin mezclar cambios de persistencia de formularios ni el P2 de code splitting.
