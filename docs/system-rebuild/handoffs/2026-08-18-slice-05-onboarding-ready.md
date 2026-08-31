# Handoff: Spec 05 lista para onboarding profesional

Fecha: 2026-08-18  
Estado: **revocación implementada; alta individual pendiente de correo, rol y confirmación de invitación**.

## Entregado

- Specs separadas de frontend, backend, Supabase y publicación.
- Protocolo profesional sintético de 30–45 minutos.
- Diseño de acceso individual con doble barrera: Sites + Supabase Auth.
- Revocación reversible mediante `memberships.status`, sin DELETE.
- Matriz TDD de RLS para membresía activa/inactiva.
- Guion de tareas, métricas, preguntas y stop conditions.
- Migración remota `membership_status_access_control` aplicada en staging.
- Revocación probada con token sintético vigente: 2 clientes → 0 → 2.
- Dos eventos de auditoría generados: desactivación y reactivación.

## Decisiones pendientes

1. correo exacto de la psicóloga;
2. rol `clinician` recomendado o `viewer`;
3. autorización para enviar invitación Sites y crear cuenta staging.

## Orden de implementación

1. ~~test SQL rojo de membresía inactiva~~ ✅
2. ~~migración 005 y actualización de RLS/RPC~~ ✅
3. ~~retest de aislamiento y advisors~~ ✅
4. cuenta/organización/membresía sintéticas;
5. allowlist Sites;
6. smoke de login y permisos;
7. entrega del guion y handoff de acceso.

## Brújula

| Categoría | Avance | Estado |
| --- | ---: | --- |
| Spec 05 | 100% | lista |
| Protocolo profesional | 100% | listo |
| Frontend para piloto | 100% | publicado |
| Revocación reversible | 100% | migrada, auditada y probada |
| Cuenta profesional | 0% | falta correo/rol |
| Allowlist Sites | 0% | falta confirmación |
| MVP técnico para piloto sintético | 98% | falta onboarding individual |

Próximo norte: **recibir el correo exacto, confirmar rol `clinician` y autorizar la invitación para habilitar una sola evaluadora**.
