# Slice 15 / Publicación web

## Estado

**APROBADA PARA GATES LOCALES. No autoriza publicación, hosting ni ampliación de audiencia.**

## Gates propuestos de candidato

- suite focalizada y regresión completa verdes;
- TypeScript y ESLint verdes;
- build staging en una carpeta nueva, sin vaciar ni reutilizar artefactos;
- preflight conserva `noindex`, `no-store`, CSP, HSTS, fallback SPA y variables de staging;
- inspección estática sin `service_role`, JWT, correos/RUT, payload clínico ni fixtures
  identificatorios;
- PDF cargado bajo demanda y medición separada de bundle inicial/recurso diferido;
- smoke local 320, 768 y 1440 px, teclado, foco, impresión y fallo de generación;
- PDF verificado sólo dentro de una ruta de evidencia aprobada en el workspace; no descargar al
  directorio personal del sistema.

## Gate de privacidad

La vista HTML, impresión y PDF deben derivarse del mismo modelo minimizado. La inspección verifica
ausencia de fecha de nacimiento, familiares, convivencia, notas, adjuntos, consentimiento,
usuarios asignados, IDs internos, datos de otra organización y borradores frontend.

## Rendimiento

PERF-14-001 permanece fuera del alcance funcional. Este slice sólo registra el tamaño del candidato
y del PDF diferido. Un crecimiento material abre o conserva un P2; no autoriza refactor de code
splitting sin una spec de rendimiento aprobada.

## Stop conditions

Detener antes de publicar, crear un sitio, cambiar Redirect URLs, usar producción, descargar fuera
del workspace, enviar un informe, conectar datos reales o modificar recursos remotos.
