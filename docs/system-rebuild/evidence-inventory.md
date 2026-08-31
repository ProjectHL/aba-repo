# Inventario de evidencia visual

## Fuente

- Video: `https://www.youtube.com/watch?v=MlN1hqR8rBg&t=4s`
- Título: `Tutorial App de programación y registro de datos de ABA en casa`
- Duración observada: 17:09.
- Transcripción/subtítulos: no disponibles en YouTube durante la revisión.
- Método: muestreo visual del inicio y de distintos puntos entre 01:00 y 16:30. Los valores visibles se describen de forma genérica y no se reutilizan como fixtures.

## Evidencias

| ID | Tiempo | Pantalla | Observación | Tipo | Confianza | Implicación | Pregunta abierta |
|---|---:|---|---|---|---|---|---|
| E-001 | 00:00 | Login | Tarjeta centrada con acceso Google, email, contraseña y acción de inicio de sesión. | screen/auth | observed | Existe autenticación previa al sistema. | ¿Qué proveedores y recuperación de cuenta siguen vigentes? |
| E-002 | 00:04–00:31 | Alta de cliente | Modal sobre Gestión de Clientes con iniciales, ID de cliente, idioma, fecha de nacimiento y edad calculada. | field/UI | observed | El perfil básico forma parte del alta. | ¿Qué campos son obligatorios y cómo se garantiza unicidad? |
| E-003 | 00:04–01:00 | Alta de cliente | Padres/tutores y hermanos son bloques repetibles con iniciales, fecha de nacimiento y edad calculada. | field/action | observed | Hay relaciones familiares repetibles. | ¿Se guardan como personas reutilizables o sólo dentro del cliente? |
| E-004 | 01:00 | Alta de cliente | Convivencia, adaptaciones del hogar, escolarización y adaptaciones del colegio. | field/UI | observed | El perfil incluye contexto familiar y educativo. | ¿Son campos libres, catálogos o ambos? |
| E-005 | 01:00–01:43 | Historia clínica | Secciones para diagnósticos, evaluaciones, operaciones y medicamentos/suplementos. | section/action | observed | El alta reúne antecedentes clínicos estructurados. | ¿Deben estar en el MVP inicial o en una edición posterior? |
| E-006 | 01:30 | Historia clínica | Evaluación con nombre, fecha y dos campos adicionales; medicamento con nombre, dosis, prescriptor, fecha inicial y final opcional. | field/UI | observed | Evaluaciones y medicación tienen registros repetibles. | El significado exacto de los dos campos adicionales de evaluación no es legible. |
| E-007 | 03:26 | Detalle del cliente | Resumen con iniciales, edad, ID, nacimiento, idioma y estado de consentimiento; resumen familiar y convivencia. | screen/state | observed | Existe una ficha consolidada del cliente. | ¿Qué controla el estado de consentimiento? |
| E-008 | 03:26 | Acceso de usuarios | Usuario creador, usuarios asignados, entrada por email y acción Añadir. | authorization/UI | observed | El acceso se administra por cliente. | ¿Los usuarios pertenecen además a una organización? |
| E-009 | 04:11 | Entrevista | Matrices editables de fortalezas y debilidades con columnas Madre, Padre y Cliente; acciones para agregar campo y columna. | screen/action | observed | Las entrevistas soportan estructura dinámica por informante. | ¿Qué otras secciones configurables tiene la entrevista? |
| E-010 | 05:09 | Evaluación de preferencias | Fecha, tipo, más preferidos, menos preferidos, topografía, documento, cancelar y guardar. | modal/form | observed | Hay evaluaciones fechadas con adjuntos. | ¿Los campos de preferencia son texto libre o listas? |
| E-011 | 05:49 | Evaluación funcional | Formulario de evaluación funcional con fecha, tipo, hipótesis/topografía y carga de documento parcialmente visibles. | modal/form | probable | Existe evaluación funcional con adjunto. | Los nombres completos de campos requieren otro fotograma. |
| E-012 | 06:52 | Informe de evaluación | Documento exportado con entrevistas, jerarquía de objetivos, fortalezas y debilidades. | export/report | observed | La aplicación genera un informe editable/descargable. | ¿Formato DOCX obligatorio o sólo ejemplo? |
| E-013 | 07:32–08:35 | Programa de adquisición | Formulario extenso con procedimiento de enseñanza, desvanecimiento de ayudas, respuesta correcta, generalización y mantenimiento. | modal/form | observed | Los programas contienen protocolo clínico detallado. | ¿Qué campos son plantillas y cuáles son obligatorios? |
| E-014 | 08:35 | Metas de adquisición | Metas repetibles con nombre, línea base, fechas y acción Guardar Programa. | field/action | observed | Un programa agrupa metas medibles. | ¿Las dimensiones disponibles son porcentaje, duración y otras? |
| E-015 | 09:25–11:08 | Reducción de conductas | Pestaña con Añadir Conducta/Añadir Función; conducta con topografía, definición operacional, dimensión, línea base, fuente, nivel actual e intensidades. | screen/form | observed | Conductas objetivo y programas por función son conceptos distintos. | ¿Cómo se relacionan múltiples conductas con una función? |
| E-016 | 11:08 | Exportación de conducta | Acción para descargar programas y conductas; tarjetas con estado activo y dimensión. | action/state | observed | Existe exportación específica de reducción. | ¿Qué formato se descarga? |
| E-017 | 12:01 | Sesión | Conductas a disminuir con contadores menos/más. | screen/action | observed | La sesión permite registro rápido de frecuencia. | ¿Se admite corrección retroactiva y quién puede hacerla? |
| E-018 | 12:01–13:44 | Sesión | Programas de adquisición con metas, porcentaje, botones Correcto/Incorrecto y metas de duración. | action/measurement | observed | La UI cambia según dimensión de medición. | ¿Cómo se inicia, pausa y finaliza la sesión? |
| E-019 | 15:27 | Gráficos | Gráficos por programa/meta con eje de sesión y exportación JPG; se muestran total y promedio por instancia. | report/chart | observed | Existe análisis longitudinal y exportación gráfica. | ¿Qué filtros y rangos temporales existen? |
| E-020 | 16:30 | Informe completo | Documento con resumen y detalle de programas de adquisición, objetivo, dimensión, línea base, fechas, criterio, nivel, estado, generalización y mantenimiento. | export/report | observed | El informe completo agrega múltiples módulos. | ¿Se genera sincrónicamente y qué formato final usa? |
| E-021 | varias | Navegación | Cabecera ABA Data Hub con Clientes e Informes; detalle con pestañas Información, Evaluación Conductual, Programas de Adquisición, Reducción de Conductas y Sesiones. | navigation | observed | El detalle del cliente es el centro de los flujos. | ¿Existen roles con pestañas ocultas? |

## Alcance confirmado para el primer MVP

- Login visual sin proveedor real inicialmente.
- Gestión/listado de clientes con estado vacío.
- Alta de cliente: información básica, tutores, hermanos y convivencia.
- Ficha del cliente con pestañas visibles en estado de placeholder.

## Diferido

Historia clínica completa, evaluaciones, programas, reducción de conductas, sesiones, gráficos, exportaciones, adjuntos y gestión real de permisos. Cada módulo requiere su propio slice y especificación aprobada.
