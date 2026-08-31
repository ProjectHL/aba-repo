# Revisión de spec — S-ABA-01: autorización y acceso por estudiante

Fecha: 2026-08-29  
Estado: **bloqueada para aprobación; no autoriza implementación**

## Objetivo

Definir de manera verificable quién puede acceder a cada recurso de un estudiante y cómo el supervisor principal concede, deniega, revoca o deja vencer una autorización para un coordinador/supervisor secundario.

## Evidencia y clasificación

| Fuente | Clasificación | Evidencia |
| --- | --- | --- |
| Modelo atómico | observada | supervisor administra, coordinador solicita autorización, terapeuta registra y familia visualiza resultados limitados |
| S-ABA-01 | propuesta | convertir esos enunciados a operaciones atómicas, estados y criterios verificables |
| Slice 02 | existente histórico | roles admin/clinician/viewer y acceso por organización no resuelven permisos clínicos por estudiante |
| Slice 15 | existente aprobado | lecturas existentes deben respetar membresía/RLS; no autoriza cambio de Auth, RLS ni schema |
| DEC-ABA-01 y DEC-ABA-02 | pendientes | permiso del coordinador y contenido visible por familia no están definidos en la fuente |

## Alcance propuesto

- Autorización explícita por estudiante para el rol coordinador/supervisor secundario.
- Matriz de acciones para expediente, programas, registros, gráficos, solicitudes y chat.
- Solicitud de autorización, decisión del supervisor, revocación y estados de acceso.
- Regla visible y auditable de por qué la interfaz permite, bloquea o solicita una operación.
- Fixtures únicamente sintéticos.

## No objetivos

- No cambiar Auth, Supabase, RLS, schema, Storage, backend ni publicación.
- No definir consentimiento, retención, auditoría clínica, exportaciones, IA u offline.
- No permitir a familia registrar, editar, chatear ni acceder a procedimientos o registros.
- No implementar UI o código hasta aprobar la spec de cuatro capas.

## Viaje de usuario propuesto

1. Un coordinador ya asignado a un estudiante abre un recurso restringido.
2. Si no tiene permiso de edición vigente, ve el modo equivalente a terapeuta y puede solicitar edición.
3. La solicitud identifica estudiante, recurso y alcance de acción solicitado.
4. El supervisor principal aprueba o deniega.
5. Si aprueba, el coordinador recibe acceso sólo dentro del alcance y vigencia definidos.
6. El supervisor puede revocar el acceso; el coordinador vuelve inmediatamente al modo restringido.

Las transiciones 3–6 son **inferred** hasta que se aprueben las decisiones siguientes.

## Decisiones requeridas

| ID | Decisión | Opción conservadora propuesta | Estado |
| --- | --- | --- | --- |
| D-ABA01-01 | Unidad de autorización | por estudiante + recurso + acciones | pendiente |
| D-ABA01-02 | Recursos editables por coordinador | expediente, programa, configuración de registro y gráfico se autorizan por separado; captura de datos ya está permitida | pendiente |
| D-ABA01-03 | Vigencia | autorización sin fecha de vencimiento, revocable manualmente | pendiente |
| D-ABA01-04 | Decisión de la solicitud | sólo supervisor principal puede aprobar/denegar | pendiente |
| D-ABA01-05 | Familia | ve únicamente resultados publicados/permitidos por el supervisor; nunca registros, procedimientos, consentimientos, chat, datos familiares ni medicación | pendiente |
| D-ABA01-06 | Auditoría | dejar una decisión de autorización y su estado es obligatorio antes de persistir el flujo; el formato y retención requieren slice separado | pendiente |
| D-ABA01-07 | Alcance técnico inicial | documentar e implementar primero sin cambios de Supabase; cualquier persistencia de autorización activa requiere una spec Supabase aprobada | pendiente |

## Matriz propuesta para aprobación

| Recurso / acción | Supervisor principal | Coordinador sin autorización | Coordinador autorizado | Terapeuta | Familia |
| --- | --- | --- | --- | --- | --- |
| Expediente: ver | sí | sí, si ya tiene acceso al estudiante | sí | sí, si autorizado | sólo vista familiar aprobada |
| Expediente: editar | sí | no; solicitar | sí, si D-ABA01-02 lo incluye | no | no |
| Programas: ver | sí | sí, si tiene acceso al estudiante | sí | sí | sólo resultados permitidos |
| Programas: editar | sí | no; solicitar | sí, si D-ABA01-02 lo incluye | no | no |
| Registro: capturar/enviar | sí | sí | sí | sí | no |
| Registro: editar/configurar | sí | no; solicitar | sí, si D-ABA01-02 lo incluye | no | no |
| Gráfico: ver | sí | sí | sí | sí | sólo resultados permitidos |
| Gráfico: editar | sí | no; solicitar | sí, si D-ABA01-02 lo incluye | no | no |
| Chat | equipo/directo | equipo/directo | equipo/directo | equipo/supervisora | no |
| Solicitud de edición | recibe/decide | crea | no necesaria para el alcance vigente | no definido | no |

## Estados propuestos

| Estado | Condición | UI esperada | Operación permitida |
| --- | --- | --- | --- |
| no-asignado | usuario no pertenece al equipo del estudiante | estudiante no visible | ninguna |
| asignado-restringido | coordinador/terapeuta con acceso base | vista permitida por rol | ver y, cuando aplique, capturar/enviar |
| solicitud-pendiente | una solicitud abierta cubre recurso/acción | estado “pendiente” y sin duplicar solicitud | cancelar sólo si se aprueba esa regla |
| autorizado | supervisor concedió permiso vigente | controles de edición en alcance aprobado | sólo acciones concedidas |
| denegado | supervisor denegó la solicitud | modo restringido con razón segura | nueva solicitud sólo si se permite |
| revocado | supervisor retiró permiso | modo restringido inmediato | ninguna acción de edición |

## Contrato de datos mínimo propuesto

El siguiente modelo es un contrato de documentación. No autoriza persistencia ni cambio de base de datos.

~~~ts
type StudentAuthorizationScope =
  | "student_profile_edit"
  | "program_edit"
  | "record_configuration_edit"
  | "record_edit"
  | "chart_edit"

type StudentAuthorizationRequest = {
  studentId: string
  requesterUserId: string
  requestedScopes: StudentAuthorizationScope[]
  status: "pending" | "approved" | "denied" | "revoked"
  decidedByUserId?: string
  decidedAt?: string
  expiresAt?: string | null
}
~~~

Reglas propuestas:

- La lista requestedScopes no puede estar vacía.
- Una decisión aprobada sólo habilita los scopes aprobados; nunca presume scopes hermanos.
- El cliente no puede autorizarse a sí mismo ni elegir al aprobador.
- El servidor o la capa de políticas debe validar identidad, organización, estudiante y decisión vigente antes de cualquier mutación.
- Hasta que D-ABA01-07 sea aprobado, este contrato queda como modelo de prueba en memoria y no como tabla, RLS o endpoint.

## Propiedad por capa

| Capa | Debe definir si se aprueba | Prohibido asumir |
| --- | --- | --- |
| Frontend | visibilidad de acciones, estados, solicitud y error accesible | que ocultar un botón equivale a autorización |
| Backend | puerto de evaluación de acceso y validación de scope | una elevación privilegiada o service role |
| Supabase | fuente de autorización, RLS y pertenencia por estudiante, si se aprueba persistencia | que las políticas actuales cubran los nuevos scopes |
| Publicación | fixtures, pruebas locales y ausencia de datos sensibles | despliegue o pruebas con datos reales |

## Criterios de aceptación verificables tras aprobación

1. Un usuario no asignado no puede listar ni abrir un estudiante.
2. Un terapeuta asignado puede ver sólo los recursos permitidos y capturar/enviar sólo donde el contrato lo indique.
3. Un coordinador asignado sin scope de edición no ve una edición habilitada y puede crear una única solicitud pendiente por recurso/acción.
4. Una aprobación habilita exactamente los scopes otorgados y no modifica otros estudiantes.
5. Una denegación o revocación elimina el acceso de edición y conserva sólo el modo restringido.
6. Una familia no puede consultar ni inferir registros, procedimientos, información de familia, medicación, consentimiento o chat.
7. La UI muestra estados de carga, sin acceso, pendiente, denegado, autorizado y error sin exponer detalle interno.
8. Todas las pruebas usan organizaciones, estudiantes y usuarios sintéticos.

## Riesgos y stop conditions

- El permiso por estudiante es una frontera de seguridad: no se considera resuelto sólo con controles de interfaz.
- Cualquier tabla, RLS, RPC, política, token, auth claim o consulta remota requiere cargar las skills de Supabase y aprobar una capa Supabase.
- Acceso familiar, auditoría y consentimiento involucran decisiones clínicas/legales adicionales; detener ante cualquier expansión.
- No se implementa ni se prueba contra staging/producción hasta una autorización separada.

## Definition of Ready

No está lista. Para alcanzar readiness, la persona usuaria debe aprobar o modificar D-ABA01-01 a D-ABA01-07. Después, se redactan las cuatro specs ejecutables y BDD como un conjunto; sólo entonces puede comenzar una tarea TDD acotada.

## Siguiente tarea exacta

Solicitar la decisión de producto para D-ABA01-01 a D-ABA01-07. No entregar una tarea de implementación todavía.

