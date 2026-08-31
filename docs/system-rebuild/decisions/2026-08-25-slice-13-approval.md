# Decisión pendiente — aprobación Slice 13

Fecha: 2026-08-25  
Propietario aprobador: usuario responsable del proyecto  
Estado global: **aprobado para implementación local y Supabase staging**

## Decisiones propuestas

1. Medición:
   - frecuencia = ocurrencias enteras;
   - duración/latencia = segundos con dos decimales;
   - intervalo = observados/total con porcentaje derivado;
   - guardar snapshot de unidad en cada medición.
   - sesiones legacy conservan snapshot `null`; no se reescriben ni se infiere la unidad actual.
2. Formularios:
   - contexto de hogar/colegio y entradas estructuradas de historia clínica;
   - consentimiento/acceso quedan pendientes hasta aprobar sus estados y autorización;
   - entrevista dinámica persiste en `assessments.payload`.
3. Evaluación:
   - incluir `draft` y `completed`, excluir `archived`;
   - filtrar por `occurred_on`; registros sin fecha se excluyen sólo cuando hay rango.
4. Informe/PDF:
   - orden y campos permitidos definidos en `specs/slice-13/frontend.md`;
   - excluir DOB, tutores, convivencia, nombres, correos, RUT, notas libres, prescriptor y adjuntos;
   - PDF local, determinista y sin solicitudes de red.

## Estado por capa

| Capa | Estado | Aprobador | Fecha |
| --- | --- | --- | --- |
| Frontend | aprobado | propietario del proyecto | 2026-08-25 |
| Backend | aprobado | propietario del proyecto | 2026-08-25 |
| Supabase | aprobado sólo para staging | propietario del proyecto | 2026-08-25 |
| Publicación | spec aprobada; despliegue no autorizado | propietario del proyecto | 2026-08-25 |

## Efecto

Esta aprobación habilita TDD/BDD de 13A y cambios aditivos en `ABA_staging`. No autoriza despliegue,
datos reales, Storage, producción ni corrección retroactiva de sesiones legacy.
