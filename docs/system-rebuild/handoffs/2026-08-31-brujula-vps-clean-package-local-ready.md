# Brújula — paquete VPS limpio validado localmente; sin subida

Fecha: 2026-08-31

## Estado ejecutivo

La ruta VPS ya tiene un release limpio y verificable localmente, separado del Worker de Sites. No
hubo subida, VPS, DNS, cambio de Supabase ni fixture persistido. La versión privada v14 continúa
activa sólo como evidencia histórica: el navegador confirma que aún contiene la validación anterior.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Corrección de ID clínico | 148/148, tipos y lint verdes | verde local |
| Release VPS estático | generado y preflight propio verde | verde local |
| Dependencia `ASSETS` | ausente del release VPS | verde local |
| Nginx real / HTTPS / DNS | plantilla creada, no ejercitada | pendiente |
| Supabase redirect URL VPS | no configurada | pendiente |
| VPS y publicación | no iniciados | pendiente |
| Fixture `UV` y BDD-03-01–12 | sin persistencia ni ejecución | P1 abierto |

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-31-vps-clean-package-local.md`
- `docs/system-rebuild/configuration/2026-08-31-vps-minimum-configuration.md`
- `deployment/vps/releases/s-aba-03-vps-clean-20260831/`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-client-id-validation-local.md`

## Red flags

- **P1 E2E:** no existe el fixture y no hay evidencia remota de BDD/RLS para este recorrido.
- **P1 Sites histórico:** no reutilizar el artefacto de Sites que falla el contrato de Worker; el
  release VPS es una ruta distinta y no lo declara resuelto.
- **P2 rendimiento:** chunk principal de ~1 MB; no bloquea una prueba privada, pero debe vigilarse.

## Límites vigentes

- Sólo datos ficticios adultos y `ABA_staging` si se autoriza un retest futuro.
- No borrar, archivar, truncar, mover ni limpiar releases, fixtures o artefactos.
- Sin producción, credenciales privilegiadas, DNS, VPS, despliegue o publicación sin autorización
  explícita.

## Siguiente norte

**Único objetivo:** validar localmente la plantilla Nginx y el contrato de release VPS (HTTPS,
headers, fallback SPA y 404 de assets), sin crear infraestructura.

**Autorización requerida posterior:** contratar/proveer el VPS y aprobar el dominio, DNS, HTTPS y
la configuración de redirect URL en `ABA_staging`; después, autorización separada de despliegue.

**No objetivos:** subir el release, sustituir v14, reintentar el fixture, modificar Supabase o
eliminar cualquier artefacto.

## Skills y agentes

1. `aba-sdd-spec-first` y `aba-tdd-validation` para cerrar la validación de Nginx/preflight local.
2. `sites:sites-hosting` no aplica a esta ruta VPS; usar sólo si se retoma Sites.
3. `supabase:supabase` sólo después de autorización para configurar/verificar el origen remoto.
4. `browser:control-in-app-browser` y `aba-authenticated-e2e-evidence` sólo tras un despliegue
   privado autorizado y antes de crear el fixture.
5. `brujula` ante cada cambio material de gate.

Agente primario activo; sin subagentes. No delegar salvo solicitud explícita; toda delegación debe
respetar workspace único, no borrado, datos sintéticos y prohibición de producción.
