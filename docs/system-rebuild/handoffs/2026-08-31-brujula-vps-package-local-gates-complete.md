# Brújula — paquete VPS limpio: gates locales completos, sin subida

Fecha: 2026-08-31

## Estado ejecutivo

El paquete VPS limpio completó todos los gates que pueden verificarse dentro del workspace: build
estático, ausencia del Worker de Sites, contrato de release, plantilla Nginx y regresión de
aplicación. No se creó ni configuró infraestructura; no hubo subida, DNS, VPS, publicación,
mutación Supabase ni fixture persistido.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Corrección de ID clínico | 148/148, tipos y lint verdes | verde local |
| Release VPS estático | build y verificador propios verdes | verde local |
| Worker/`ASSETS` | ausente del release | verde local |
| Nginx de referencia | HTTPS futuro, headers, SPA y 404 de assets validados estáticamente | verde local |
| VPS, dominio y TLS real | no contratados/configurados | pendiente externo |
| Redirect URL Supabase | no configurada | pendiente externo |
| Fixture `UV` y BDD-03-01–12 | sin persistencia ni ejecución | P1 abierto |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-31-vps-clean-package-local.md`
- `docs/system-rebuild/configuration/2026-08-31-vps-minimum-configuration.md`
- `deployment/vps/releases/s-aba-03-vps-clean-20260831/`
- `deployment/vps/scripts/verify-vps-release.mjs`
- `deployment/vps/scripts/verify-nginx-template.mjs`

## Red flags

- **P1 E2E:** sin fixture persistido ni BDD/RLS autenticado para S-ABA-03.
- **P1 Sites histórico:** el artefacto de Sites sigue fallando su propio contrato; no afecta el
  paquete VPS, pero no debe publicarse por esa ruta.
- **P2 rendimiento:** chunk principal ~1 MB, sin variación material.

## Siguiente norte

**Único objetivo:** esperar la contratación del VPS y, cuando exista, configurar en el orden
documentado dominio, HTTPS, Nginx, origen de Supabase staging y smoke sintético privado.

**Autorizaciones requeridas:** acceso al VPS concreto; autorización para configurar DNS/TLS y la
URL de redirección de `ABA_staging`; autorización separada para desplegar el release. Antes del E2E,
una confirmación puntual para crear el fixture.

**No objetivos:** publicar antes de esas autorizaciones, producción, cambiar Supabase/schema, borrar
artefactos o reintentar el formulario de v14.

## Skills y agentes

1. `supabase:supabase` sólo al configurar/verificar el origen staging autorizado.
2. `browser:control-in-app-browser` y `aba-authenticated-e2e-evidence` sólo tras el despliegue
   privado autorizado.
3. `brujula` en cada gate externo o cambio de estado.

Agente primario activo; sin subagentes. No delegar salvo solicitud explícita; toda delegación debe
respetar workspace único, no borrado, datos sintéticos y prohibición de producción.
