# Mapa histórico de especificaciones — antes de 10D

Fecha de captura: 2026-08-25  
Motivo: el retest autenticado 10A confirmó que el falso error post-escritura está resuelto para
evaluación, programa, meta y plan. También existe evidencia local aprobada de 10C.1. Se preserva
este mapa antes de centrar el cierre en QA 10D.

## Estado anterior declarado

| Fase | Estado antes del checkpoint |
| --- | --- |
| 10A confiabilidad de guardado | corrección y pruebas locales; E2E pendiente |
| 10B paridad visible | frontend cerrado; decisiones remotas pendientes |
| 10C.1 JPG local | implementación y pruebas locales aprobadas; navegador pendiente |
| 10D QA/publicación | gate futuro, sin publicación autorizada |

## Evidencia usada

- `test-runs/2026-08-25-10a-authenticated-retest.md`: cuatro escrituras sintéticas confirmadas y
  persistentes tras recarga en staging.
- `test-runs/2026-08-25-10c-local-jpg-export.md`: 94/94 pruebas, typecheck y lint; minimización
  del JPG validada localmente.

## Porcentajes históricos conservados

La Brújula ponderada histórica es 77% (Auth 95%, ficha 85%, evaluaciones 75%,
adquisición/reducción 78%, sesiones 72%, informes 65%, Supabase/RLS 90%, publicación 55%,
QA/cumplimiento 70%). No tiene una fórmula por gate que autorice recalcularla a partir de este
checkpoint; conservar 77% evita declarar un porcentaje nuevo sin método aprobado.

## Decisión de transición

10A y 10C.1 pasan a verificados en sus límites respectivos. El único roadmap activo será 10D, con
QA de navegador y sin publicación. Adjunto, correcciones clínicas, exportaciones adicionales,
retención y permisos siguen bloqueados por decisión de producto.
