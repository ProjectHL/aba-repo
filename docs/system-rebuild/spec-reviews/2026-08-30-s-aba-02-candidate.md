# Revisión de spec — S-ABA-02 expediente mínimo y consentimiento

Fecha: 2026-08-30  
Estado: **implementada en local y `ABA_staging`; producción/publicación bloqueadas**

Gate posterior resuelto: S-ABA-01 se implementó primero y las tablas clínicas nuevas operan bajo
asignación y capacidades por estudiante.

## Alcance y evidencia

El contrato clasifica los campos de E-002–E-007, conserva la verdad de persistencia de Slice 14 y
aplica la frontera de acceso aprobada en S-ABA-01. Identificación y familia base ya persisten;
contexto/historia siguen como drafts; consentimiento continúa bloqueado.

## Viaje y estados

Una supervisora asignada completa secciones opcionales, registra historia mediante nuevas
versiones y representa consentimiento por finalidad como referencia. Estados de sección:
`empty`, `incomplete`, `ready`, `no-permission`, `error`. Estados de consentimiento:
`not_recorded`, `pending_review`, `valid`, `revoked`, `expired`, `superseded`.

## Contratos y seguridad

Los contratos candidatos están en `specs/s-aba-02-minimum-record-consent/`. No incluyen nombre,
RUT, domicilio, teléfono, correo, binario ni firma. Historia y consentimiento son append-only;
S-ABA-01 gobierna toda capacidad y familia recibe cero tablas crudas.

## Criterios verificables

El BDD cubre campos requeridos/opcionales, filas repetibles, lectura de terapeuta, corrección y
término no destructivos, consentimiento por finalidad, revocación histórica, ausencia de upload,
bloqueo familiar y no inferencia de estudiantes.

## Decisiones resueltas

D02-01–D02-09 fueron aprobadas explícitamente el 2026-08-30. También se autorizó implementación y
Supabase, limitados a local y `ABA_staging`, con datos sintéticos.

## No objetivos y dependencias

No hay código, migraciones, RLS, RPC, Storage, firma, datos reales, validación jurídica ni
publicación. Producción conserva todos los gates rojos de Slice 03.

## Evidencia posterior

La ejecución TDD, migraciones, regresión y flujos autenticados sintéticos se documentan en
`docs/system-rebuild/test-runs/2026-08-30-s-aba-01-02-local-staging.md`. No se desplegó Sites ni se
usó producción.
