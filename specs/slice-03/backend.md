# Slice 03 / Límite de servicio y gobierno

## Estado arquitectónico

NestJS sigue diferido, pero Slice 03 activa su evaluación. Un backend propio será obligatorio si RLS/RPC/Edge Functions no permiten demostrar políticas centralizadas de consentimiento, relación asistencial, exportación, retención, cifrado y auditoría sin exponer complejidad al navegador.

## Capacidades requeridas, independientemente de tecnología

- motor de autorización por organización, paciente, relación asistencial, rol, propósito y estado de consentimiento;
- registro de consentimientos y representación versionado;
- ledger de acceso y cambios sin payload clínico;
- exportación/portabilidad asíncrona, cifrada, expirable y auditada;
- workflow de solicitudes del titular con SLA y evidencia;
- calendario de retención, `legal_hold` y eliminación gobernada;
- respuesta a incidentes, revocación de sesiones y rotación de credenciales;
- claves de idempotencia, correlation IDs no sensibles y límites de abuso;
- separación estricta entre configuración de staging y producción.

## Reglas

- Nunca confiar autorización al frontend.
- No usar `service_role` en navegación ordinaria.
- Todo acceso clínico se evalúa en servidor/base con contexto verificable.
- Los logs no incluyen RUT, nombres, fechas de nacimiento, notas, tokens ni exportaciones.
- Operaciones administrativas privilegiadas requieren identidad individual, MFA y auditoría.
- Correcciones preservan procedencia e historial; no se reescribe silenciosamente una entrada clínica firmada.

## Pruebas de aceptación

1. Miembro de la organización sin relación asistencial recibe respuesta indistinguible de inexistencia.
2. Rol revocado pierde acceso con sesión ya iniciada.
3. Exportación vencida o reutilizada falla.
4. Una solicitud de derechos produce inventario completo de tablas, archivos, backups y encargados.
5. Una retención legal impide purga y registra la causa; vencido el plazo, la eliminación sigue doble autorización y acta.
6. Fallo de auditoría revierte la operación sensible cuando corresponda.

