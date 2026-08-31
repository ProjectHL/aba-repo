# Slice 03 / Supabase para producción clínica

## Regla de entorno

El proyecto `ABA_staging` (`arfwuctpwnnuhdgjtxaa`) permanece sintético. Nunca se convierte en producción ni recibe una copia de pacientes históricos. Producción requiere organización/proyecto separados y autorización explícita.

## Bloqueadores actuales

- plan Free sin backups administrados descargables y sujeto a pausa;
- protección contra contraseñas filtradas no habilitada en el plan actual;
- autorización actual por organización demasiado amplia para ficha clínica;
- la migración `004_audit_client_updates.sql` cubre altas, actualizaciones y archivados; lecturas, exportaciones, consentimientos y permisos continúan pendientes para producción clínica;
- no existe MFA obligatorio para usuarios de aplicación;
- no existe DPIA, DPA aprobado ni mecanismo jurídico aprobado para transferencia a Brasil;
- no existe restauración probada ni calendario legal de retención/eliminación.

## Arquitectura requerida

- Proyecto de producción pagado, separado y con presupuesto/alertas.
- Región y transferencias aprobadas; staging actual usa `sa-east-1` São Paulo.
- SSL enforcement, network restrictions para conexiones PostgreSQL y secretos rotables.
- RLS en toda tabla expuesta, con asignación explícita paciente-profesional y expiración.
- MFA/AAL exigido por políticas para operaciones clínicas y privilegiadas.
- Identificadores directos separados del dominio clínico; evaluar cifrado de aplicación con claves fuera de la base.
- Auditoría append-only de lectura, escritura, exportación, consentimiento, permisos y administración; sin payload clínico.
- Backups automáticos, copia segregada cuando corresponda, restauración periódica y evidencia de RPO/RTO.
- Políticas de retención por tabla/objeto y proceso gobernado de eliminación; no políticas `DELETE` abiertas a usuarios.
- Auth, Database y Platform audit logs con retención y exportación aprobadas.
- Advisors sin hallazgos críticos y prueba de RLS multiusuario, multi-organización y por relación asistencial.

## Proveedores y contrato

Antes de producción se revisan el DPA de Supabase, subencargados, región, notificación de incidentes, devolución/supresión al terminar, asistencia a derechos, auditorías y transferencias. La certificación SOC 2 del proveedor no certifica la aplicación ni sustituye obligaciones chilenas.

## Pruebas obligatorias

1. Acceso directo con publishable key no evade RLS.
2. Profesional A no accede a paciente B dentro de la misma organización.
3. Cambio de asignación o rol revoca acceso activo.
4. Token con AAL insuficiente no exporta ni administra permisos.
5. Logs demuestran quién leyó una ficha sin revelar su contenido.
6. Restauración recupera integridad y auditoría dentro del RPO/RTO.
7. Backups y réplicas respetan región, retención y eliminación aprobadas.
8. Ninguna cuenta compartida tiene acceso a producción.
