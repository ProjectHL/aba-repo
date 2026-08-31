# Slice 09 / Producción acelerada de pantallas

## Objetivo

Generar el frontend clínico en lotes amplios y validar, antes de conectar cada área, que el contrato
necesario existe o está explícitamente planificado en Supabase staging.

## Estrategia aprobada

- El agente QA y los ciclos E2E quedan fuera del loop de construcción.
- Se mantienen comprobaciones de desarrollo: tipos, compilación y contratos de datos.
- El QA integral de flujos, responsive, accesibilidad, seguridad y regresión se ejecuta al final.
- Las pantallas pueden usar borradores locales mientras su tabla figure como `planned`.
- Ninguna vista puede afirmar que guardó datos si la conexión aún no existe.

## Lotes

1. Ficha ampliada conectada: cliente, convivencia, tutores y hermanos.
2. Formularios frontend: entrevista, preferencias y evaluación funcional.
3. Formularios frontend: adquisición y reducción.
4. Captura de sesión y composición de reportes.
5. Esquema clínico staging y conexiones persistentes.
6. QA final y publicación agrupada.

## Estado de lotes

- Lote 3 completado: persistencia y flujo utilizable de programas, metas y planes de conducta.
- Lote 4 completado: captura atómica de sesión y primera fuente persistente para informes.
- Lote 5A completado: informes clínicos derivados y gráficos basados únicamente en sesiones
  persistidas. La composición no crea ni duplica datos clínicos.
- Lote 5B completado: pulido responsive, alternativa accesible a gráficos y composición de
  impresión local. Sigue pendiente la comprobación visual manual dentro del QA autenticado final.

## Transición

El E2E autenticado del 2026-08-24 comprobó la persistencia de punta a punta, pero encontró falsos
errores visuales post-escritura y confirmó huecos frente al catálogo S-01–S-13. El cierre no se
continúa en este slice: está especificado en `specs/slice-10/` para separar correcciones de
confiabilidad, expansión aprobada de formularios, exportación y QA/publicación.
