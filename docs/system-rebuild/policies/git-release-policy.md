# Política académica de Git y releases

Fecha de adopción: 2026-08-31  
Estado: obligatoria para ABA Data Hub

## Principio

`aba-repo` es el monorepo privado y fuente de verdad de código, especificaciones, evidencia de
pruebas y configuración declarativa de despliegue. Un servidor nunca es fuente de verdad ni compila
una versión por sí mismo.

## Contenido versionado

- Código fuente, lockfiles y configuración de build reproducible.
- `specs/`, `docs/` y políticas de continuidad, sin datos reales ni secretos.
- Plantillas de infraestructura, scripts de verificación y `.env.example` sin valores sensibles.

## Contenido prohibido en Git

- `node_modules`, stores/cachés, builds temporales o releases compilados ordinarios.
- `.env` reales, contraseñas, tokens, claves SSH, certificados o credenciales de servicios.
- Datos clínicos, identificadores reales, fixtures persistidos, exports o logs sensibles.

## Flujo de cambios

1. El trabajo comienza en una rama corta desde `main`.
2. Un Pull Request documenta alcance, specs afectadas, pruebas y riesgos.
3. `main` se protege: no force-push, no borrado, checks de pruebas, tipos, lint y build requeridos.
4. Un cambio aprobado se fusiona conservando trazabilidad de revisión.
5. Una versión candidata se marca con tag semántico inmutable, por ejemplo
   `v0.1.0-staging`.

## Artefactos y despliegue

- El CI construye el paquete VPS desde el commit/tag exacto y registra commit, checksum y resultado
  de verificaciones.
- El artefacto se conserva fuera del árbol fuente como adjunto de release o repositorio de
  artefactos con retención definida; no se recompila manualmente en el VPS.
- Un despliegue privado requiere aprobación separada y usa sólo el artefacto correspondiente al tag
  aprobado.
- El VPS conserva la release previa para recuperación no destructiva.

## Evidencia y cumplimiento

Cada release debe enlazar evidencia de pruebas, configuración aplicable, fecha, responsable de
aprobación y resultado del smoke sintético. Esta política no autoriza producción ni datos reales.
