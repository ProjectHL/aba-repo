# Slice 03: preparación para datos clínicos en Chile

Estado: especificación inicial; implementación y datos reales bloqueados.  
Objetivo: convertir la línea base sintética en un sistema evaluable para información clínica bajo normativa chilena, sin declarar cumplimiento antes de auditoría jurídica y técnica.

| Orden | Spec | Entregable | Estado |
| ---: | --- | --- | --- |
| 1 | `compliance.md` | clasificación, bases de licitud, titulares, retención, DPIA y contratos | por validar con responsable/abogado |
| 2 | `supabase.md` | separación producción, seguridad, RLS por relación asistencial, auditoría y recuperación | bloqueada |
| 3 | `frontend.md` | avisos, consentimiento, derechos, acceso mínimo y UX para menores | bloqueada |
| 4 | `backend.md` | servicio de políticas, exportación, retención e incidentes; decisión NestJS | bloqueada |
| 5 | `web-publication.md` | hosting clínico, transferencias, headers, acceso y observabilidad | bloqueada |

## Gates para permitir el primer dato real

| Gate | Evidencia | Estado |
| --- | --- | --- |
| C-01 responsable | razón social/RUT, representante y prestador custodio definidos | rojo |
| C-02 dictamen | revisión de abogado chileno de finalidad, licitud, menores y ficha clínica | rojo |
| C-03 DPIA | evaluación de impacto aprobada con riesgos residuales aceptados | rojo |
| C-04 proveedores | DPA/contratos, subencargados y transferencia internacional aprobados | rojo |
| C-05 plataforma | producción separada, plan pagado, MFA, backups y restauración probada | rojo |
| C-06 autorización | acceso por relación asistencial, logs de lectura y pruebas negativas | rojo |
| C-07 titulares | aviso, consentimiento, revocación, solicitudes y portabilidad probados | rojo |
| C-08 retención | calendario, bloqueo legal y eliminación gobernada aprobados | rojo |
| C-09 incidentes | tabletop y canales de reporte aprobados | rojo |
| C-10 auditoría | revisión técnica independiente sin hallazgos críticos | rojo |

No existe aceptación parcial: mientras un gate esté rojo, local, staging, demos y pruebas de usuario siguen siendo exclusivamente sintéticos.

## TDD/SDD

Cada capacidad debe seguir: requisito jurídico trazable → spec aprobada → prueba negativa → implementación mínima → revisión de seguridad → prueba de aislamiento/abuso → evidencia → aprobación del gate.

