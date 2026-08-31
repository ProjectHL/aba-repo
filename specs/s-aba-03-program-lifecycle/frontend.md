# S-ABA-03 / Frontend

Estado: **implementado y publicado en staging versión 14; smoke autenticado inicial verde; E2E pendiente**

## Superficie

La pestaña Programas del expediente separa `Adquisición` y `Conducta`. Cada lista ofrece filtros por
estado y muestra nombre, tipo, versión, estado y última actualización. Los formularios reutilizan
shadcn/ui y los tokens existentes.

## Campos de adquisición

| Campo | Activación | Regla |
| --- | --- | --- |
| nombre, objetivo, área de habilidad | obligatorio | texto no vacío |
| antecedente, pasos, procedimiento | obligatorio | pasos ordenados, al menos uno |
| sets e ítems | obligatorio | al menos un set y un ítem |
| niveles de ayuda | obligatorio | catálogo ordenado, al menos uno |
| corrección de error | obligatorio | texto no vacío |
| criterio de logro | obligatorio | descripción observable; sin inferir fórmula |
| generalización y mantención | opcional | texto separado |

## Campos de conducta

| Campo | Activación | Regla |
| --- | --- | --- |
| nombre, topografía y definición operacional | obligatorio | texto no vacío |
| función hipotética | obligatorio | selección/texto explícito |
| precursoras | opcional | lista ordenada |
| conducta de reemplazo | obligatorio | texto no vacío |
| dimensión de medida | obligatorio | contrato existente; ampliaciones pertenecen a S-ABA-05/06 |
| prevención y respuesta | obligatorio | textos separados |
| plan de crisis | opcional | aviso informativo visible |
| criterio de logro | obligatorio | descripción; sin cálculo automático en esta slice |

## Estados de interfaz

`loading`, `empty`, `data`, `saving`, `invalid`, `forbidden`, `conflict` y `error-retryable` son
explícitos. Un rol sin `program:edit` ve la lista en lectura y no recibe controles deshabilitados
que revelen acciones no autorizadas.

## Accesibilidad y responsive

- Formularios utilizables por teclado, errores asociados a campos y foco en el primer error.
- Listas sin desbordamiento a 320 px; en móvil se presentan como tarjetas.
- Estado y versión no dependen sólo del color.
- Confirmación antes de transición terminal; no hay acción de eliminar.
