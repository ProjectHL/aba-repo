# Mapa histórico de especificaciones — antes de Slice 10

Fecha de captura: 2026-08-24  
Motivo: el E2E autenticado confirmó persistencia del núcleo clínico, pero encontró un falso error
visual post-escritura y huecos explícitos de formularios/exportación. Se conserva esta fotografía
antes de reorganizar el cierre en Slice 10.

## Mapa vigente antes de la reorganización

| Grupo | Estado declarado antes de Slice 10 | Papel en el proyecto |
| --- | --- | --- |
| Specs raíz (`frontend`, `backend`, `supabase`, `web-publication`) | arquitectura y primer corte histórico | referencia de decisiones iniciales; no era el plan operativo de cierre |
| Slice 02 | completado | Auth y persistencia básica de clientes |
| Slice 03–07 | completados o de preparación | cumplimiento, piloto, Google, registro y recuperación |
| Slice 08 | completado | cartografía de las vistas clínicas S-04–S-13 |
| Slice 09 | lotes 3, 4, 5A y 5B completados | persistencia clínica, sesión atómica, informe derivado, responsive e impresión |
| QA/publicación de Slice 09 | pendiente | QA autenticado final y publicación agrupada |

## Brújula previa

La última Brújula ponderada reportó 77%. Sus categorías clave declaraban: Auth 95%, gestión/ficha
85%, evaluaciones 75%, adquisición/reducción 78%, sesiones 72%, informes 65%, Supabase/RLS 90%,
publicación 55% y QA/cumplimiento 70%.

## Evidencia que motivó el cambio

- El recorrido real autenticado completó alta, tres evaluaciones, programa, meta, plan, sesión
  atómica e informe de un adulto ficticio.
- Las escrituras remotas respondieron 201 y persistieron bajo RLS.
- Evaluación, programa, meta y plan comunicaron un error visual falso después de escribir; F5
  mostró el conteo correcto. Este problema no estaba representado como P0 en Slice 09.
- El catálogo conserva 2 pantallas ausentes (S-08, S-13), 6 formularios parciales y ninguna
  exportación descargable, aunque sí hay impresión local.

## Decisión registrada

No se reescriben ni se consideran fallidos los lotes 02–09. Se crean specs sucesoras en Slice 10
para separar: 10A confiabilidad de guardado, 10B paridad de formularios, 10C exportaciones y 10D
QA/publicación. El mapa activo pasa a `specs/slice-10/`; este archivo permanece como referencia de
la decisión y no se modifica para reflejar resultados posteriores.
