# Slice 10 / Cierre de evidencia E2E

## Propósito

Convertir la evidencia autenticada de staging en un cierre verificable del MVP clínico. La fuente
de verdad es `docs/system-rebuild/handoffs/2026-08-24-brujula-e2e-comparison.md`; el flujo base
persistente ya existe y no se reimplementa.

## Secuencia y gates

| Fase | Alcance | Gate de salida |
| --- | --- | --- |
| 10A · Confiabilidad | Falso error visual posterior a una escritura clínica exitosa | Prueba primero roja y luego verde para evaluación, programa, meta y plan; la UI no declara fallo si la operación confirmó persistencia. |
| 10B · Paridad de formularios | Campos y estados visibles de S-05, S-06, S-07, S-09, S-10 y S-11 | Cada campo implementado está enlazado a evidencia o a una aprobación explícita; contrato, migración y pruebas actualizados si hay persistencia nueva. |
| 10C · Exportación | S-08, S-13 y exportaciones observadas de S-10/S-12 | Formato, contenido mínimo, autorización y retención aprobados; no se exportan datos no necesarios. |
| 10D · QA/publicación | Móvil, teclado, impresión, recuperación y smoke privado | E2E autenticado sin defectos P0/P1 abiertos; publicación sólo con autorización separada. |

## Estado de entrada

- Hay un recorrido autenticado de datos comprobado: alta → tres evaluaciones → programa/meta →
  plan → sesión atómica → informe derivado.
- Persistieron bajo RLS, pero los cuatro formularios clínicos de creación mostraron un error visual
  falso después de respuestas REST 201. Es P0 abierto.
- S-08 y S-13 no existen; impresión local no equivale a exportación.
- No se autorizan datos reales, eliminación, cambios productivos ni migraciones remotas por este
  documento.

Consultar `frontend.md`, `supabase.md`, `backend.md` y `web-publication.md` antes de cambiar una
frontera. Una fase no comienza por el simple hecho de estar listada: requiere cumplir su gate previo.

## Continuidad activa

10C.1 y el retest autenticado de 10A se completaron. La siguiente spec es **10D — QA/publicación**
en [`web-publication.md`](web-publication.md): validar en navegador con datos sintéticos el JPG
local, vista móvil, teclado, impresión y recuperación. No autoriza publicación.
