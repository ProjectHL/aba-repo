# Slice 15 / Backend

## Estado y decisión propuesta

**APROBADA EL 2026-08-29.** NestJS, Edge Functions y cualquier servicio de generación continúan diferidos.

La opción propuesta para D15-05 es composición local efímera. El frontend utiliza sólo puertos de
lectura ya existentes:

| Fuente | Puerto existente | Uso propuesto |
| --- | --- | --- |
| cliente | `ClientsRepository.list/getById` | encabezado mínimo y validación de acceso existente |
| evaluaciones | `AssessmentRepository.listByClient` | RPT-02 y sección de RPT-03 |
| programas/metas/planes | `ClinicalPlansRepository` | estructura y estados vigentes |
| sesiones/mediciones/ensayos | `ClinicalReportRepository.readByClient` | RPT-01 y progreso de RPT-03 |

## Reglas de contrato

- Todas las respuestas se validan y pertenecen al `clientId` solicitado.
- Un `clientId` discordante invalida el informe completo; no se descarta silenciosamente.
- Los payloads de evaluación se discriminan por `kind` y versión conocida.
- No se expone JSON crudo, error de proveedor ni detalle interno.
- El PDF recibe un modelo de informe ya minimizado; no consulta repositorios ni DOM clínico
  adicional durante la exportación.
- La generación no crea identificadores, registros de auditoría ni URLs compartibles.

## No autorizado

- endpoint de informes o exportación;
- credencial privilegiada o `service_role`;
- job asíncrono, cola, correo o webhook;
- caché de informes, archivo temporal remoto o firma digital;
- nueva interpretación clínica en un mapper.

## Condición para ampliar la frontera

Si el PDF local no satisface el formato aprobado o se solicita persistencia/entrega, detener y crear
una spec separada con amenaza, autorización, retención, revocación, auditoría, contrato de descarga
y pruebas de aislamiento.
