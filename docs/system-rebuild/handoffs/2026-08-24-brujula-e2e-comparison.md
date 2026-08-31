# Comparativo Brújula ↔ evidencia E2E autenticada

Fecha: 2026-08-24  
Base de comparación: `docs/system-rebuild/screen-catalog.md`,
`docs/system-rebuild/flow-spec.md`, las brújulas de los handoffs del 2026-08-24 y
`test-runs/2026-08-24-authenticated-synthetic-e2e.md`.

## Respuesta ejecutiva

| Pregunta | Resultado | Criterio |
| --- | --- | --- |
| Flujos 100% | **0** | Ninguno cumple aún toda la evidencia observada y UX sin defectos conocidos. |
| Flujo vertical autenticado verificado | **1** | Alta → evaluaciones → programa/meta → plan → sesión atómica → informe derivado. Persistió y el informe fue consistente. |
| Flujos que requieren cierre | **3** | J-01 alta/ficha, J-02 intervención/sesión y J-03 informes/exportación. |
| Pantallas completamente ausentes | **2 de 13** | S-08 Informe de evaluación y S-13 Informe completo. |
| Formularios de captura completamente ausentes | **0** | Los formularios base S-03 y S-05–S-11 existen; no reproducen todavía toda la evidencia original. |
| Formularios que requieren completar campos/comportamiento | **6** | S-05, S-06, S-07, S-09, S-10 y S-11. |
| Exportación de reportes | **No** | Existe impresión local con `window.print()`; no PDF/archivo, JPG, informe de evaluación ni informe completo descargable. |
| Frontend completo | **No** | Hay 11 pantallas base accesibles, pero faltan 2 pantallas, exportaciones, campos observados, edición/historial y QA final. |

## Qué demostró el E2E

El recorrido autenticado con el expediente adulto ficticio `ZX / E2E-SYNTH-ALPHA` verificó el
camino de persistencia y composición: 3 evaluaciones, 1 programa, 1 meta, 1 plan, 1 sesión atómica
y un informe con valor conductual 3 y progreso 80.0% (8 correctos / 2 incorrectos).

Esto aumenta la confianza en el **núcleo vertical de staging**, pero no convierte por sí solo los
journeys en 100%: varios formularios devolvieron un falso error visual tras una inserción REST 201;
una recarga mostró los datos persistidos. Es un defecto UX abierto.

## Comparativo por journey de la Brújula

| Journey | Estado de la Brújula previa | Evidencia nueva | Falta para 100% |
| --- | ---: | --- | --- |
| J-01 Alta y ficha | Gestión/ficha: 85% | Alta y detalle/familia comprobados bajo RLS | Edición clínica completa y cierre de todos los estados de ficha. |
| J-02 Intervención y sesión | Adquisición/reducción: 78%; sesiones: 72% | Programa, meta, plan y sesión atómica comprobados | Protocolo observado completo, duración/controles de sesión, historial detallado, correcciones controladas y resolver falso error de guardado. |
| J-03 Informes | Informes/gráficos: 65% | Informe derivado, series, porcentaje, responsive/impresión local | Exportación JPG/PDF/archivo, S-08, S-13 y QA visual autenticado de impresión. |
| Auth | 95% | Sesión autenticada utilizada | Configurar Redirect URLs y repetir smoke de recuperación. |
| Publicación/operación | 55% | Sin publicación en este ciclo | QA final, publicación agrupada y smoke privado. |

La última Brújula ponderada publicada mantiene **77%**. La prueba E2E cierra incertidumbre de
persistencia para el núcleo clínico, pero no justifica aumentar ese porcentaje hasta resolver el
defecto de guardado y los huecos explícitos de pantallas/exportación.

## Formularios: detalle de los seis incompletos

| Pantalla | Existe hoy | Diferencia frente a la evidencia observada |
| --- | --- | --- |
| S-05 Entrevista | Sí, 4 campos base | faltan jerarquía configurable y fortalezas/debilidades. |
| S-06 Preferencias | Sí, 4 campos base | faltan fecha, preferencias/topografía y adjunto. |
| S-07 Funcional | Sí, 4 campos base | faltan fecha, tipo, topografía y adjunto. |
| S-09 Adquisición | Sí, programa y meta | faltan ayudas, desvanecimiento, respuesta correcta, generalización y mantenimiento. |
| S-10 Reducción | Sí, plan básico | faltan estados/acciones observadas y descarga de programas + conductas. |
| S-11 Sesión | Sí, frecuencia y ensayos | falta duración observada e historial/corrección controlada. |

## Orden recomendado de cierre

1. Corregir y probar el falso error post-escritura de los formularios clínicos.
2. Completar los seis formularios contra los campos evidenciados, aprobando primero los datos que
   no quedaron visibles en el material de origen.
3. Implementar S-08 y S-13 junto con una exportación segura y mínima; incluir JPG sólo para la
   visualización de gráficos si sigue siendo un requisito confirmado.
4. Ejecutar QA autenticado final (móvil, teclado, impresión, recuperación) y recién entonces
   actualizar la Brújula ponderada y considerar publicación.
