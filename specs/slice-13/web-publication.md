# Slice 13 / Publicación web

## Contrato SDD

No se publica durante la implementación. Antes de cualquier despliegue se requiere candidato local
en `apps/web/verification/`, preflight, revisión de tamaños, smoke privado y autorización explícita
de hosting. El PDF local no sube contenido a ningún servicio.

## Gates

- `no-store`, `noindex`, CSP, HSTS y fallback SPA deben conservarse.
- El candidato debe incluir las rutas `/informes`, `/informes/evaluacion` y `/informes/completo`.
- No se considera evidencia de publicación una prueba local.
- El subagente de publicación no modifica Redirect URLs, proveedores OAuth ni Sites sin autorización
  explícita.

## 13B.1

La entrevista dinámica no añade rutas ni dependencias y no autoriza publicación. El build candidato
debe mantener `/clientes/:id`, navegación por teclado del diálogo y bundle inicial sin aumento mayor
a 10%. 13B.2/13B.3 no se representan como persistidos mientras sus contratos estén bloqueados.

## Preflight verificable

- Candidato nuevo: `apps/web/verification/release-YYYYMMDD-slice13/`.
- Build no destructivo: `vite build --mode staging --outDir <candidato> --emptyOutDir false` usando
  el binario local.
- Preflight desde `apps/web`: `node scripts/verify-staging-build.mjs <candidato>`; el script vigente
  está en `apps/web/scripts/verify-staging-build.mjs`.
- Comparar JS inicial contra `release-20260825-pdf-lazy`; aumento mayor a 10% abre P2.
- El preflight verifica noindex, no-store, CSP, HSTS, fallback SPA, configuración staging y ausencia
  de service role/secret/JWT.
- Una prueba del PDF debe bloquear `fetch`/XHR y confirmar cero solicitudes de red durante la
  generación.
- La autorización de despliegue se registra como una decisión nueva; aprobación de Slice 13 no es
  autorización de Sites.
