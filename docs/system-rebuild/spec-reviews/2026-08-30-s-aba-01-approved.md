# Revisión aprobada — S-ABA-01 autorización por estudiante

Fecha: 2026-08-30  
Estado: **aprobada documentalmente; implementación no autorizada**

## Alcance aprobado

- Acceso compuesto por identidad, membresía activa, asignación al estudiante, rol y capacidad.
- Roles canónicos: supervisor, coordinador, terapeuta y familia.
- Grants por estudiante, recurso y acciones; vencimiento máximo de 90 días.
- Solicitud del coordinador y decisión/revocación exclusiva del supervisor principal.
- Acceso familiar limitado a una futura proyección publicada; sin datos clínicos crudos.
- Notificación in-app; chat, correo y descarga familiar fuera de alcance.

## Evidencia y decisiones

- Fuente observada: `docs/system-rebuild/atomic-model-aba-contract.md`.
- Revisión previa: `docs/system-rebuild/spec-reviews/2026-08-29-s-aba-01-access-authorization.md`.
- Contrato aprobado: `specs/s-aba-01-student-authorization-access/`.
- D01–D09 fueron aprobadas explícitamente por la persona usuaria el 2026-08-30.

## Viaje y estados

El coordinador asignado ve recursos base, solicita una capacidad restringida, el supervisor
principal aprueba o deniega y un grant aprobado queda vigente hasta su vencimiento o revocación.
Estados: `unassigned`, `assigned`, `pending`, `approved`, `denied`, `expired`, `revoked`.

## Seguridad y datos

La UI no autoriza. La frontera de datos deberá comprobar pertenencia de organización, asignación,
rol, recurso, acción, vigencia y coherencia de estudiante. Las decisiones son append-only y las
pruebas usan identidades, organizaciones y estudiantes sintéticos. No se aprobó migración alguna.

## Criterios verificables

El BDD aprobado cubre aislamiento entre estudiantes, capacidades base, solicitudes idempotentes,
aprobación exclusiva, alcance mínimo, denegación, expiración, revocación y bloqueo de datos crudos
para familia. Está en `specs/s-aba-01-student-authorization-access/bdd.md` y no ha sido ejecutado.

## No objetivos y dependencias

No incluye implementación, datos reales, Auth, Supabase remoto, RLS, RPC, Sites, publicación,
chat ni consentimiento. La proyección familiar depende de S-ABA-02; el chat depende de
DEC-ABA-10. Los roles históricos requieren mapeo explícito antes de una futura migración.

## Siguiente tarea exacta

Iniciar `aba-sdd-spec-first` para S-ABA-02 — expediente mínimo y consentimiento — únicamente como
documentación. No entregar aún S-ABA-01 a TDD sin una autorización de implementación separada.

