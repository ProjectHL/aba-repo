# Modelo atómico — contrato de visión ABA

Fecha: 2026-08-29  
Estado: **documentación de producto; no autoriza implementación**  
Fuente primaria: APP ABA.docx, entregado por la persona usuaria para esta revisión. El original permanece fuera del workspace y no se modifica.

## Propósito y regla de lectura

Este modelo convierte la visión de negocio del documento fuente en unidades trazables para especificación. No reemplaza las especificaciones vigentes ni aprueba cambios de producto, esquema, permisos, Supabase, publicación o datos clínicos reales.

- **Observado:** aparece explícitamente en el documento fuente.
- **Propuesto para spec:** descomposición necesaria para poder especificarlo; requiere aprobación antes de implementar.
- **Decisión pendiente:** el documento formula una pregunta, presenta alternativas o deja el alcance indeterminado.

## Resumen ejecutivo

La visión es una aplicación ABA con un expediente organizado por estudiante. El supervisor principal configura el equipo, el acceso, los programas y las plantillas de registro; terapeutas registran datos mediante una interfaz previamente configurada; el sistema genera gráficos por programa; y los familiares reciben una vista limitada de resultados. Un coordinador o supervisor secundario puede solicitar autorización para editar.

El núcleo funcional observado es: autenticación por rol, expediente del estudiante, programas de adquisición y de manejo de conducta, sesiones y registros configurables, gráficos automáticos, autorizaciones y chat interno. El documento también propone exportaciones, un mapa de flujo basado en el procedimiento escrito y, a futuro, informes de avance.

El alcance contiene información clínica sensible. Este contrato no aprueba uso de datos reales, ni regula cumplimiento, retención, consentimiento, auditoría, acceso familiar detallado, sincronización offline o exportaciones; cada uno requiere una spec y decisión explícita.

## Mapa mental del sistema

~~~mermaid
mindmap
  root((ABA Data Hub))
    Identidad y acceso
      Supervisor principal
      Coordinador o supervisor secundario
      Terapeuta
      Familia
      Solicitudes de autorización
    Expediente del estudiante
      Datos básicos
      Contactos familiares
      Consentimiento PDF o enlace
      Diagnóstico y medicación histórica
      Motivo de consulta
    Programación
      Adquisición de habilidades
        Objetivo y procedimiento
        Sets y ayudas
        Corrección de error
        Criterio de logro
      Manejo de conducta
        Definición operacional
        Función y reemplazos
        Prevención y reacción
        Plan de crisis opcional
      Estados: activo logrado pausa discontinuado
    Sesión y registros
      Inicio y finalización
      Porcentaje por ensayos
      Frecuencia y tasa
      Duración latencia TER
      Intervalos
      Guardar y enviar
    Gráficos y salidas
      Líneas, fases y leyendas
      Filtros por tipo de respuesta
      PDF
      Word PDF de programas
      Mapa de flujo del procedimiento
    Colaboración
      Chat por estudiante
      Mensajería de autorizaciones
    Futuro
      Informes de avance automáticos
      Offline y sincronización
~~~

## Modelo atómico observado

| Dominio | Átomos de negocio observados | Relaciones observadas |
| --- | --- | --- |
| Cuenta y perfil | usuario, foto, nombre, profesión, título, descripción | un usuario tiene un rol; el supervisor administra perfiles |
| Rol y acceso | supervisor, coordinador, terapeuta, familia; ver, editar, registrar, enviar, solicitar | el acceso se concede por estudiante; el coordinador solicita autorización; familia sólo visualiza resultados |
| Estudiante | identidad, nacimiento, familia/contactos, diagnóstico, medicación/dosis/estado/historial, motivo, consentimiento | un estudiante tiene programas, equipo autorizado, registros y gráficos |
| Programa | tipo, nombre, estado, diseño, registro, gráfico | pertenece a un estudiante y es de adquisición o conducta |
| Adquisición | objetivo, antecedente, pasos, procedimiento, sets, ayudas, corrección de error, logro, generalización/mantención | un set contiene ítems; una plantilla define ensayos por ítem |
| Conducta | topografía, definición operacional, función, precursoras, reemplazo, medida, tratamiento, prevención, reacción, crisis, logro | puede registrar conducta a aumentar o disminuir |
| Sesión | abierta/cerrada, inicio, finalización | se debe iniciar antes de registrar; una sesión contiene registros |
| Plantilla | dimensión, códigos, ayudas, fases, ensayos, ítems/conductas, intervalos, tiempo | se configura antes de que el terapeuta capture datos |
| Registro | ensayo, código, ocurrencia, conteo, tiempo, intervalo, guardar/enviar/finalizar | puede haber más de uno por programa; cada uno genera un gráfico según la fuente |
| Gráfico | medida, ejes, rango, tiempo, puntos, fases, leyenda, filtros, actual/histórico | se genera tras finalizar un registro; supervisor edita su configuración |
| Colaboración | solicitud, aprobación/denegación, mensaje, destinatario/equipo | las solicitudes van al supervisor principal; el chat se asocia al estudiante |
| Salida | programa Word/PDF, gráfico PDF, mapa de flujo, informe futuro | el mapa se plantea desde el procedimiento escrito; no hay contrato técnico aprobado |

## Matriz de roles observada

| Capacidad | Supervisor principal | Coordinador/secundario | Terapeuta | Familia |
| --- | --- | --- | --- | --- |
| Perfil propio | ver/editar | ver | ver | no descrito |
| Equipo | ver/editar | ver | ver | no descrito |
| Estudiantes autorizados | ver/editar | ver; editar con autorización | ver | ver limitado |
| Programas | ver/editar | ver; editar con autorización | ver | lista/resultados limitados |
| Configurar/editar registros | sí | con autorización | no | no |
| Capturar y enviar datos | sí | sí | sí | no |
| Gráficos | ver/editar | ver; editar con autorización | ver | ver limitado |
| Autorizaciones | recibe/gestiona | solicita | no descrito | no |
| Chat por estudiante | equipo/directo | equipo/directo | equipo/supervisora | no |

**Decisión pendiente:** la fuente mezcla “autorizado por supervisor” con “solicitar edición” para el coordinador. Falta definir el recurso, duración, alcance y revocación de una autorización.

## Medidas y plantillas de registro observadas

| Familia de medida | Configuración observada | Captura observada | Salida esperada |
| --- | --- | --- | --- |
| Porcentaje | sets, ítems, fase, 3–10 ensayos, códigos y ayudas | código por ensayo: independiente, ayuda, error o no responde | gráfico por registro |
| Frecuencia | conducta, fase, códigos; cronómetro opcional para tasa | contador por ocurrencia | frecuencia/número de respuestas y tasa |
| Duración/latencia/TER | conducta, fase, códigos y ayudas | cronómetro de inicio/fin; tiempos parciales sugeridos | duración total/parcial, latencia o TER |
| Intervalos | total, parcial o momentáneo; número y duración | ocurrencia/no ocurrencia por intervalo | se solicita registro y gráfico, pero falta regla de cálculo y visualización |

## Fronteras y decisiones pendientes

| ID | Decisión pendiente | Por qué no se infiere |
| --- | --- | --- |
| DEC-ABA-01 | Matriz exacta de permisos, alcance y revocación | hay roles, pero no operaciones atómicas ni conflictos |
| DEC-ABA-02 | Qué resultados ve una familia y con qué aprobación | sólo indica resultados, no periodicidad ni visibilidad de programas |
| DEC-ABA-03 | Ciclo de consentimiento: repositorio, enlace o firma | menciona PDF/enlace, sin validez, acceso ni retención |
| DEC-ABA-04 | Fórmulas y reglas de gráficos de intervalos, tasa, porcentaje, latencia y TER | enumera medidas, pero no define cálculo, faltantes ni correcciones |
| DEC-ABA-05 | Edición de registros y auditoría | permite edición, pero no define inmutabilidad, corrección o historial |
| DEC-ABA-06 | Sesión: concurrencia, reanudación, abandono y envío | sólo declara inicio/finalización y guardar |
| DEC-ABA-07 | Mapa de flujo: IA, revisión humana, privacidad, formato y descarga | se pide generación automática, sin contrato de seguridad o aceptación |
| DEC-ABA-08 | Offline y sincronización | aparece como respuesta a un análisis, no como flujo aprobado |
| DEC-ABA-09 | Exportaciones Word/PDF e informes futuros | se solicitan salidas, sin contenido, persistencia ni controles |
| DEC-ABA-10 | Chat: contenido, visibilidad, retención y moderación | existe como capacidad, sin modelo de privacidad o seguridad |

## Checklist para convertir el contrato en specs

- [ ] Aprobar este modelo como fuente de visión, sin reemplazar specs vigentes.
- [ ] Aprobar DEC-ABA-01 y DEC-ABA-02 antes de tocar roles, RLS o UI de familia.
- [ ] Aprobar DEC-ABA-03 y el mínimo de datos por rol antes de persistencia del expediente.
- [ ] Definir estados, transiciones y edición/versionado de ambos tipos de programa.
- [ ] Aprobar DEC-ABA-06 y la relación entre sesión, programa y registro.
- [ ] Aprobar DEC-ABA-04 para cada dimensión antes de cálculos o gráficos.
- [ ] Aprobar DEC-ABA-05 antes de habilitar edición o reenvío de datos.
- [ ] Definir fuente, puntos, filtros, escalas, fases y estados vacíos de gráficos.
- [ ] Aprobar DEC-ABA-10 y el ciclo de solicitudes.
- [ ] Aprobar DEC-ABA-07 y DEC-ABA-09 de forma separada.
- [ ] Aprobar DEC-ABA-08 antes de almacenamiento local o sincronización.
- [ ] Para cada slice aprobado, actualizar frontend, backend, Supabase y publicación, más BDD cuando corresponda.
- [ ] Usar TDD y QA con fixtures anonimizados; al cierre registrar evidencia, handoff y Brújula.

## Backlog de specs atómicas propuesto

Las siguientes son **tareas de documentación**, no tickets de implementación. Se ejecutan una por una mediante aba-sdd-spec-first y sólo después de una aprobación explícita de cada slice.

### S-ABA-01 — autorización y acceso por estudiante

1. Inventariar cada recurso y operación: ver, crear, editar, registrar, enviar, descargar y chatear.
2. Escribir la matriz de rol × recurso × operación para supervisor, coordinador, terapeuta y familia.
3. Definir solicitud, aprobación, expiración, denegación, revocación y notificación.
4. Separar permisos de expediente, programa, registro, gráfico y chat.
5. Redactar reglas de UI, puertos backend, RLS y publicación en las cuatro capas.
6. Escribir BDD con un estudiante y usuarios sintéticos.

### S-ABA-02 — expediente mínimo y consentimiento

1. Clasificar cada campo del estudiante como obligatorio, opcional o no incluido en MVP.
2. Definir qué rol puede ver y editar cada campo.
3. Definir el historial de medicación sin asumir borrado ni sobrescritura.
4. Resolver si el consentimiento es referencia, archivo o integración de firma.
5. Definir estados vacío, incompleto, sin permiso y error.
6. Escribir pruebas de contrato y BDD sin datos identificatorios reales.

### S-ABA-03 — programas y ciclo de vida

1. Definir identificador, tipo y propietario de un programa.
2. Definir campos de adquisición y conducta, obligatoriedad y validación.
3. Definir transiciones entre activo, logrado, pausado y discontinuado.
4. Decidir si editar cambia el mismo diseño o crea una versión.
5. Definir lista, filtros, estados vacíos y acciones por rol.
6. Escribir BDD para crear, pausar, reactivar y consultar un programa sintético.

### S-ABA-04 — sesión y plantilla de porcentaje

1. Definir cuándo una sesión puede abrirse, reanudarse y cerrarse.
2. Definir sets, ítems, 3–10 ensayos, fase, códigos y ayudas permitidas.
3. Definir qué significa guardar, enviar y finalizar.
4. Definir ensayos incompletos y cambios de programa durante sesión.
5. Definir el cálculo de porcentaje y los datos que recibe el gráfico.
6. Escribir BDD de captura, salida y reingreso con fixtures sintéticos.

### S-ABA-05 — frecuencia, duración, latencia y TER

1. Definir unidad y fórmula de cada medida.
2. Definir cronómetro, contador, inicio/fin, pausas y tiempos parciales.
3. Definir códigos y ayudas aplicables por tipo de medida.
4. Definir faltantes, cancelación y datos inválidos.
5. Definir puntos derivados para cada gráfico.
6. Escribir pruebas deterministas de cálculo y BDD de captura.

### S-ABA-06 — medición por intervalos

1. Separar intervalo total, parcial y muestreo de tiempo momentáneo.
2. Definir duración de observación, cantidad de intervalos y punto de muestreo.
3. Definir ocurrencia/no ocurrencia y fórmula de resultado.
4. Definir gráfico, escala y leyenda de cada modalidad.
5. Definir configuración inválida o intervalos incompletos.
6. Escribir ejemplos de cálculo y BDD con fixtures anonimizados.

### S-ABA-07 — gráficos clínicos derivados

1. Establecer la fuente canónica de cada punto y relación registro–gráfico.
2. Definir ejes, rangos, fecha vs. número de sesión, fases y leyendas.
3. Definir filtros de independiente, ayuda, error y no responde.
4. Definir edición del gráfico, actual/histórico y comportamiento sin datos.
5. Definir permisos de ver, editar y descargar.
6. Alinear cualquier PDF con las decisiones ya aprobadas para Informes, sin ampliar alcance.

### S-ABA-08 — solicitudes y chat por estudiante

1. Definir modelo de solicitud de edición y sus estados.
2. Definir destinatarios, notificaciones y trazabilidad de decisión.
3. Definir participantes permitidos de chat y mensajes directos/equipo.
4. Definir campos, visibilidad, errores y estados vacíos.
5. Obtener decisión de privacidad, retención y contenido permitido antes de persistencia.
6. Escribir BDD de permiso, solicitud y conversación sintética.

### S-ABA-09 — salidas y mapa de flujo

1. Separar exportación de programa, gráfico, informe y mapa de flujo en contratos distintos.
2. Definir contenido mínimo, formato, acción manual, errores y permisos de cada salida.
3. Para el mapa de flujo, definir revisión humana obligatoria antes de cualquier uso clínico.
4. Evaluar privacidad, proveedor, retención y datos permitidos antes de incorporar IA.
5. Definir descarga local, persistencia o compartición; no asumir ninguna.
6. Añadir pruebas de compatibilidad de payload y privacidad para cada salida aprobada.

### S-ABA-10 — resiliencia offline

1. Confirmar que offline es una decisión de producto aprobada y delimitar qué datos cubre.
2. Definir almacenamiento local, cifrado, recuperación ante corte y borrado controlado.
3. Definir cola de sincronización, conflictos, reintentos e indicadores de estado.
4. Definir qué ocurre si una sesión queda abierta sin conexión.
5. Revisar impacto en las cuatro capas y seguridad antes de código.
6. Construir BDD de pérdida de conexión con fixtures sintéticos.

## Loop documentado de especificación y continuidad

1. Registrar evidencia y etiquetar cada afirmación como observada, propuesta o pendiente.
2. Actualizar este modelo sólo para conservar trazabilidad, sin convertir pendientes en hechos.
3. Elegir **un** slice pequeño y resolver primero sus decisiones bloqueantes.
4. Cargar aba-sdd-spec-first y redactar las cuatro capas del slice más BDD.
5. Esperar aprobación explícita de la spec completa.
6. Cargar aba-tdd-validation; ejecutar rojo → verde → refactor con fixtures anonimizados.
7. Cargar aba-mvp-qa-release-loop para evidencia local y preflight del cambio aprobado.
8. Guardar evidencia, emitir handoff y actualizar Brújula; tras cinco specs o un checkpoint, cargar aba-spec-reorganization-loop.

## Relación con el estado actual

Este contrato no cambia el estado del Slice 15: sigue como candidato local con smoke visual/autenticado y PDF físico pendientes de autorización separada. Tampoco actualiza specs/index.md, que está desfasado frente a los slices 13–15; esa corrección exige una tarea de gobernanza deliberada.

## Stop conditions

Detener y pedir autorización antes de: implementar cualquier slice anterior; tocar Supabase, Auth, RLS, Storage o schema; usar datos reales; habilitar IA; descargar o persistir archivos; desplegar; ampliar acceso familiar; o convertir reglas clínicas pendientes en comportamiento de producto.

