# Handoff — recuperación de contraseña

Fecha: 2026-08-24

## Entregado

- Login ofrece `¿Olvidaste tu contraseña?`.
- `/recuperar-acceso` solicita un vínculo mediante Supabase Auth y evita enumerar cuentas.
- `/recuperar-contrasena` no permite cambiar contraseña con una sesión ordinaria; requiere el evento
  `PASSWORD_RECOVERY`.
- La nueva contraseña exige 12 caracteres, confirmación y no expone errores remotos.
- El cambio usa `updateUser({ password })`, nunca `auth.admin`, `service_role`, SQL ni backend propio.
- Tras éxito, se cierra la sesión temporal y se vuelve a Login.
- 87/87 pruebas, TypeScript y ESLint en verde.

## Archivo clave

- `apps/web/src/auth/password-recovery-page.tsx`
- `apps/web/src/auth/reset-password-page.tsx`
- `apps/web/src/lib/supabase/auth-service.ts`
- `docs/system-rebuild/test-runs/2026-08-24-password-recovery.md`

## Brújula del MVP profesional

| Categoría | Avance | Dirección inmediata |
| --- | ---: | --- |
| Auth y navegación | 95% | configurar Redirect URLs y smoke de recuperación |
| Gestión y ficha de clientes | 85% | edición clínica completa |
| Evaluaciones | 75% | historial y presentación |
| Adquisición y reducción | 78% | validación final autenticada |
| Sesiones clínicas | 72% | historial detallado y correcciones controladas |
| Informes y gráficos | 65% | QA visual manual e impresión autenticada |
| Supabase, RLS y auditoría | 90% | mantener contratos y pruebas RLS |
| Publicación y operación | 55% | publicación agrupada tras QA visual |
| QA y cumplimiento piloto | 70% | gate final sólo con datos sintéticos |

**Avance ponderado estimado del MVP profesional: 77%.**

## Siguiente paso

Configurar las Redirect URLs autorizadas de Supabase Auth y ejecutar el smoke de recuperación con
una cuenta sintética. Después, proceder al QA autenticado final y publicación agrupada.
