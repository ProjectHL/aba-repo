# Slice 11 / Publicación privada

## Candidato

`apps/web/verification/release-20260825-pdf-lazy/`, generado en modo staging y verificado por
`verify-staging-build.mjs` el 2026-08-25. El candidato anterior permanece como evidencia histórica
y no se modifica.

## Preparación aprobada

- Mantener `noindex, nofollow`, `Cache-Control: no-store`, CSP, HSTS y fallback SPA.
- Conservar staging privado, Auth y RLS.
- Registrar la versión/commit y resultados de smoke sin PII.

## Antes de desplegar

1. responsable confirma proveedor, URL privada y audiencia;
2. responsable autoriza crear/usar hosting y configurar Redirect URLs exactas;
3. primera prueba: un smoke falla si la URL no entrega headers, fallback SPA o barrera Auth;
4. desplegar sólo tras autorización explícita y hacer smoke sintético.

## Stop condition

No desplegar ni cambiar recursos remotos sin autorización separada. P0/P1 bloquean la publicación;
el bundle P2 debe quedar aceptado explícitamente o resolverse antes de ampliar audiencia.
