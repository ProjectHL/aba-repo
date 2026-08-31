# Registro de inicialización Git v-01

Fecha: 2026-08-31  
Estado: preparado para el commit inicial de la fuente de verdad privada.

## Alcance incluido

- Código fuente de `apps/`.
- Especificaciones, decisiones, evidencias y handoffs en `docs/` y `specs/`.
- Migraciones y pruebas de `supabase/`.
- Configuración y verificadores reproducibles de `deployment/vps/`.
- Política académica de Git y releases en `docs/system-rebuild/policies/git-release-policy.md`.

## Exclusiones verificadas

No se agregan al índice dependencias, cachés, árboles Git anidados, variables de entorno locales, artefactos `dist`, directorios de verificación ni releases generados. Esos elementos pueden permanecer localmente, ignorados, y no se eliminan como parte de esta preparación.

## Nota de calidad

La comprobación `git diff --cached --check` identifica espacios finales y líneas vacías finales heredados en documentación y algunos SQL. No se normalizaron en este corte para no introducir una reescritura masiva fuera de alcance. Debe tratarse como una tarea de formato independiente antes de una revisión editorial final.

## Regla operativa

La rama protegida contiene fuente y evidencia. Un release se construirá de un commit o tag inmutable y se verificará de nuevo antes de desplegar el artefacto estático al VPS. No se despliega desde el directorio de trabajo.
