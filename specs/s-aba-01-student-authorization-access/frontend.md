# S-ABA-01 / Frontend

Estado: **implementado localmente; publicación y smoke de navegador pendientes**

## Responsabilidad

Representar las capacidades devueltas por la capa autoritativa, sin derivarlas del rol guardado en
el navegador ni usar la visibilidad de controles como medida de seguridad.

## Estados de pantalla

- `loading`: no mostrar contenido clínico previo ni destellos de acciones.
- `not-found`: respuesta común para estudiante inexistente o no asignado.
- `restricted`: recurso visible, acción no concedida.
- `request-pending`: alcance solicitado legible y edición deshabilitada.
- `authorized`: sólo aparecen habilitadas las acciones incluidas en capabilities.
- `denied`, `expired`, `revoked`: vuelven a modo restringido con mensaje seguro.
- `error`: no revela organización, estudiantes, usuarios, políticas ni IDs ajenos.

## Contrato de presentación candidato

~~~ts
type StudentCapability =
  | "student.view" | "student.edit"
  | "program.view" | "program.create" | "program.edit"
  | "record_config.view" | "record_config.create" | "record_config.edit"
  | "record.view" | "record.capture" | "record.submit"
  | "chart.view" | "chart.configure" | "result.download"
  | "authorization.request" | "authorization.decide" | "authorization.revoke"

type StudentAccessView = {
  studentId: string
  role: "supervisor" | "coordinator" | "therapist" | "family"
  capabilities: StudentCapability[]
  pendingRequests: Array<{
    id: string
    resource: "student" | "program" | "record_config" | "chart"
    actions: StudentCapability[]
    status: "pending"
  }>
}
~~~

Los textos explicativos pueden describir “sin permiso” o “solicitud pendiente”, pero no exponen el
nombre del aprobador, otros miembros del equipo ni detalles internos de políticas.

## Flujos

### Coordinador solicita edición

1. Abre un recurso que puede ver por asignación.
2. La acción restringida ofrece “Solicitar autorización”.
3. Confirma recurso, acciones y motivo no clínico breve.
4. Tras una respuesta exitosa, la UI muestra `request-pending` y evita duplicados.
5. La aprobación posterior habilita exactamente las capabilities concedidas tras refrescar.

### Supervisor decide

1. Ve solicitudes pendientes sólo de estudiantes donde es supervisor principal.
2. Revisa solicitante, recurso, acciones, motivo y fecha de vencimiento propuesta.
3. Aprueba el conjunto completo o deniega; aprobación parcial exige una decisión explícita nueva.
4. Puede revocar un grant vigente sin borrar su historial.

### Familia

La navegación familiar es una proyección separada. No reutiliza la pantalla profesional ocultando
secciones. Sólo recibe campos ya minimizados y publicados según D06; mientras S-ABA-02 no cierre el
contrato de campos, la vista familiar permanece bloqueada.

## Accesibilidad y seguridad

- Foco vuelve al encabezado del estado tras solicitar o decidir.
- Cambios se anuncian mediante región `aria-live` sin incluir contenido clínico.
- Acciones restringidas no dependen sólo de color, hover o tooltip.
- Deep links y refresh repiten la evaluación autoritativa antes de renderizar datos.
- Caché por usuario/estudiante se invalida tras revocación, vencimiento, logout o cambio de sesión.

## Criterios de aceptación frontend

1. No hay flash de datos ni controles privilegiados durante carga.
2. Un deep link no revela si existe un estudiante no asignado.
3. Un grant para `program.edit` no habilita `student.edit` ni `chart.configure`.
4. Estado pendiente impide solicitudes duplicadas.
5. Revocación observada en refresh retira controles y datos no permitidos.
6. La familia nunca recibe la interfaz profesional completa.
