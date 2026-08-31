# Slice 05: onboarding individual de evaluadora profesional

Estado: base técnica implementada; onboarding bloqueado sólo por identidad, rol e invitación aprobados.  
Objetivo: incorporar a una psicóloga al Site privado y Supabase staging con una cuenta individual, acceso reversible y un protocolo exclusivamente sintético.

| Orden | Spec | Entregable | Estado |
| ---: | --- | --- | --- |
| 1 | `supabase.md` | membresía reversible, cuenta y aislamiento | migración y RLS verdes; cuenta pendiente |
| 2 | `web-publication.md` | allowlist privada de una evaluadora | espera correo exacto |
| 3 | `frontend.md` | recorrido y mensajes del piloto | candidato actual aprobado |
| 4 | `backend.md` | operaciones administrativas fuera del navegador | NestJS diferido |
| 5 | `test-protocol.md` | guion profesional de 30–45 minutos | listo |

## Decisiones requeridas

1. Correo exacto de la psicóloga.
2. Rol de aplicación: `clinician` recomendado para probar alta; `viewer` si sólo observará.
3. Confirmación para enviar la invitación externa de Sites.

No se solicita nombre completo, RUT, especialidad, pacientes ni antecedentes clínicos.

## Gate de salida

- Membresía `active/inactive` aplicada por RLS y probada sin DELETE. ✅
- Una organización sintética dedicada y una sola membresía activa para la evaluadora.
- Cuenta Supabase individual confirmada y contraseña única entregada por canal privado.
- Site continúa `custom`: propietario + correo aprobado, sin grupos ni acceso público.
- Login, permisos, aislamiento, alta sintética y desactivación verificados.
- Guion y prohibición de datos reales entregados antes de la sesión.
