# ABA Data Hub

Monorepo privado y fuente de verdad de ABA Data Hub: código fuente, contratos, evidencia y
configuración reproducible para releases privadas de pruebas.

## Norma de ingeniería

La política obligatoria de Git y releases está en
`docs/system-rebuild/policies/git-release-policy.md`.

Este repositorio no contiene secretos, datos reales, dependencias instaladas, cachés ni artefactos
compilados. Las releases se generan desde un commit/tag exacto y se despliegan sólo con aprobación
explícita.

## Estructura

- `apps/web`: frontend React/Vite.
- `deployment/vps`: paquete estático, Nginx y verificadores VPS.
- `specs` y `docs`: contratos, decisiones y evidencia verificable.
- `supabase`: migraciones y pruebas de contrato.
