# Slice 04 / Backend

## Decisión

No se incorpora NestJS en este piloto. El frontend usa Supabase Auth, Data API y RPC mediante el repositorio existente.

NestJS permanece planificado para crecimiento cuando exista una necesidad aprobada de orquestación, integraciones, trabajos asíncronos, políticas complejas o una API estable para terceros. No es un requisito para publicar ni evaluar este recorrido sintético.

## Criterios

- Ningún secreto o `service_role` entra al navegador.
- No se crea una segunda fuente de verdad ni persistencia paralela.
- Los errores se normalizan en el frontend y no muestran SQL.

