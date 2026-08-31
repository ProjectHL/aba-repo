# Slice 09 / Frontend

## Reglas

- Mantener React, Vite, Tailwind y componentes shadcn existentes.
- Producir formularios utilizables como borrador aunque todavía no persistan.
- Mostrar el estado de conexión: `Conectado`, `Contrato listo` o `Esquema pendiente`.
- Centralizar la definición de campos y evitar duplicar formularios entre alta, edición y sesión.
- Separar carga de datos del render mediante repositorios tipados.

## Pantallas del lote

| Área | Pantalla | Estado esperado |
| --- | --- | --- |
| Información | resumen, convivencia, tutores, hermanos, historia clínica | familia conectada |
| Evaluación | entrevista inicial | borrador frontend |
| Evaluación | preferencias | borrador frontend |
| Evaluación | evaluación funcional / ABC | borrador frontend |
| Adquisición | programas, metas y protocolo | borrador frontend |
| Reducción | conductas, función e intervención | borrador frontend |
| Sesiones | captura simultánea de reducción y adquisición | conectada mediante RPC atómica |
| Informes | gráficos, evaluación y completo | composición visual |

## Gate de desarrollo por lote

- Contratos TypeScript coherentes con `database.types.ts`.
- Compilación sin errores.
- No se ejecuta el paquete completo de QA hasta el lote final.

## Lote 03 — adquisición y reducción conectadas

- La ficha carga programas, metas y planes de conducta del cliente activo mediante un repositorio tipado.
- La profesional puede crear primero un programa y luego asociar una meta al programa seleccionado.
- Una meta exige área de habilidad, nombre, criterio de dominio y procedimiento de enseñanza.
- Un plan de conducta reúne definición operacional, unidad de medición, función hipotética,
  estrategia antecedente, conducta de reemplazo y estrategia de respuesta.
- Los formularios muestran estados de guardado, error y conteos actualizados sin recargar la página.
- Sólo se aceptan datos sintéticos durante staging; ningún formulario promete una conexión inexistente.

## Lote 04 — captura atómica de sesión

- La pantalla carga las metas y planes del cliente; no usa objetivos sintéticos codificados.
- Permite registrar fecha, notas, un valor no negativo por plan y ensayos correctos/incorrectos por meta.
- `Guardar sesión` envía cabecera, mediciones y ensayos mediante una única operación tipada.
- El éxito muestra la sesión persistida y reinicia contadores; el error conserva los valores para reintentar.
- No permite guardar si el cliente no tiene al menos una meta o un plan configurable.
- La interfaz informa explícitamente que la operación es atómica y está conectada a staging.

## Estado del lote 04

Implementado y verificado el 2026-08-18. El siguiente lote debe consumir estas sesiones para
presentar evolución temporal y un resumen profesional; no debe inventar series ni mezclar clientes.

## Lote 05A — informes clínicos derivados

- La ruta privada `/informes` permite seleccionar un único cliente visible para la membresía activa.
- Al seleccionar un cliente, la vista obtiene sesiones no archivadas, mediciones y ensayos del mismo
  `client_id`; el rango por defecto es todo el historial y puede limitarse con fechas inclusivas.
- La evolución por plan muestra sólo sesiones que tengan una medición para ese plan, ordenadas por
  fecha ascendente; no se rellenan huecos ni se inventan puntos.
- Cada meta con ensayos muestra `correctos / (correctos + incorrectos) * 100`, redondeado a un
  decimal; si no hay ensayos, se muestra `Sin ensayos` y no un porcentaje ficticio.
- La pantalla tiene estados explícitos de carga, vacío, error recuperable con reintento y datos.
- El resumen imprimible contiene las iniciales e ID clínico ya visibles a la profesional, el rango,
  métricas derivadas y una nota de uso sintético. No incluye fecha de nacimiento, tutores, notas de
  sesión ni otros identificadores innecesarios.
- La composición se resuelve con componentes React y CSS de impresión; no genera, persiste ni
  descarga archivos en este lote.

## Criterios de aceptación del lote 05A

1. Un informe no puede incluir filas de otro cliente, incluso si el repositorio recibe resultados
   mal formados.
2. El filtro de fechas no mezcla ni reordena series y comunica un rango inválido (`desde > hasta`).
3. Los gráficos de progreso muestran valores reales de `session_behavior_measurements`.
4. Los porcentajes de adquisición proceden de `session_acquisition_trials` y son verificables.
5. La interfaz se puede imprimir con un resumen legible y sin controles de navegación.

Estado: implementado y cubierto por pruebas el 2026-08-24. El siguiente lote es 05B, dedicado al
pulido visual, responsive e impresión manual antes de la publicación agrupada.

## Lote 05B — pulido, responsive e impresión

- El selector de periodo y las métricas deben adaptarse desde móvil sin desbordamiento horizontal.
- Cada tarjeta de evolución debe conservar etiqueta, valor y fecha legibles aunque la serie tenga
  múltiples puntos; la información numérica sigue siendo accesible sin depender del gráfico.
- En impresión se ocultan controles, navegación y el botón de imprimir; el resumen conserva las
  iniciales, ID clínico, rango, métricas derivadas y leyenda de datos sintéticos.
- La hoja impresa no muestra fecha de nacimiento, notas, tutores, hermanos, sesión ni otro dato
  no necesario para el resumen.
- Los controles conservan nombre accesible, foco visible y contraste adecuado. No se añade una
  biblioteca de gráficos ni se modifica el contrato de datos.

## Criterios de aceptación del lote 05B

1. La vista no excede el ancho de un viewport móvil de 320 px.
2. El resumen de impresión se identifica como tal y no incluye controles interactivos.
3. Las series incluyen una alternativa textual accesible con fecha y valor.
4. La política global de no-caché y no-indexación se conserva sin cambios.

Estado: implementado y cubierto por pruebas automatizadas el 2026-08-24. La comprobación visual
manual de impresión y viewport pequeño queda dentro del QA final autenticado previo a publicar.

## Corrección de contrato observada en staging (2026-08-24)

- Los repositorios que reciben filas clínicas aceptan la representación `timestamptz` de PostgREST
  (`YYYY-MM-DD HH:MM:SS.ssssss+00`) además de la representación ISO con `T`. La validación exige
  que el valor sea una fecha interpretable, sin transformar el valor ni inventar una zona horaria.
- El detalle del cliente solicita las relaciones de convivencia y familia que valida su contrato
  (`living_arrangement`, `guardians`, `siblings`) en la misma consulta de detalle.
