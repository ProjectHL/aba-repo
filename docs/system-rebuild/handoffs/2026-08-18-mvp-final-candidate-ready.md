# Handoff: candidato final del MVP listo para redespliegue

Fecha: 2026-08-18  
Estado: **MVP sintético desplegado y GO para onboarding individual**.  
Datos autorizados: exclusivamente sintéticos.

## Incidente detectado por QA

La versión privada activa sirve un bundle construido sin modo `staging`. El documento carga, pero React no monta porque falta la configuración pública de Supabase. El resultado visible es una pantalla en blanco.

## Correcciones

- Build oficial explícito mediante `build:staging`.
- Preflight rechaza bundles que no incorporan la URL pública de Supabase staging.
- Verificador compatible con Worker enlazado o autocontenido.
- Fallback seguro de arranque: muestra indisponibilidad sin secretos ni detalles técnicos.
- Dos pruebas nuevas para el estado `unavailable`.

## Evidencia final

| Gate | Resultado |
| --- | --- |
| Vitest | 43/43 PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Build staging | PASS |
| Preflight | 14 archivos, PASS |
| Worker Sites | PASS |
| Login local | visible, sin errores de consola |
| Guard `/clientes` sin sesión | redirige a `/login` |
| Supabase integridad | PASS |
| Supabase revocación | PASS |

Artefacto: `apps/web/verification/mvp-final-staging-20260818-v3`.  
Paquete Sites: `apps/web/verification/sites-package-v11`.

## Publicación completada

Con autorización explícita se publicó el paquete v11 como Sites versión 7. Se verificó:

1. login visible y hash nuevo; ✅
2. ruta privada directa protegida; ✅
3. credencial sintética inválida produce error genérico; ✅
4. cero errores recientes del Worker; ✅
5. acceso owner-only conservado; ✅
6. login → listado → alta sintética → detalle → logout con cuenta profesional: pendiente del onboarding Slice 05.

El onboarding de la psicóloga continúa separado y requiere correo exacto, rol e invitación aprobados. Los datos reales o históricos continúan prohibidos.

## Brújula

| Categoría | Avance | Estado |
| --- | ---: | --- |
| Código MVP | 100% | verde |
| QA local independiente | 100% | completo |
| Supabase staging | 100% | íntegro y aislado |
| Paquete de publicación | 100% | v11 aprobado |
| Site activo | 100% | versión 7 privada y funcional |
| Smoke publicado | 100% | login, guard y conexión aprobados |
| Onboarding profesional | 0% | falta correo, rol y credencial individual |
| MVP sintético | 100% | listo para onboarding |
