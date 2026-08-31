# Comparativo — visión APP ABA vs. proyecto actual

Fecha de comparación: 2026-08-30  
Fuente de visión: APP ABA.docx entregado por la persona usuaria.  
Base comparada: código local, esquema local de Supabase, especificaciones y evidencia de pruebas dentro de este workspace.

## Cómo leer este comparativo

- **Tenemos:** existe código y/o contrato persistente local que cubre el núcleo funcional indicado.
- **Parcial:** existe una parte concreta, pero no satisface el flujo o detalle solicitado en APP ABA.
- **No tenemos:** no se encontró implementación ni contrato aprobado que cubra la capacidad.
- **No verificado en staging:** existe evidencia local, pero falta una verificación autorizada en entorno autenticado o visual.

Esto no afirma producción ni uso de datos reales. El proyecto conserva fixtures sintéticos y los gates de publicación no están autorizados.

## Resumen

| Resultado | Cantidad |
| --- | ---: |
| Tenemos | 9 |
| Parcial | 12 |
| No tenemos | 19 |

La aplicación ya cubre la base de un expediente clínico ABA y los informes derivados. La mayor brecha frente a APP ABA está en el trabajo de sesión guiado para terapeutas, los permisos clínicos granulares por estudiante y los módulos colaborativos/familiares.

## Lo que sí tenemos

| Área de APP ABA | Resultado actual | Evidencia local |
| --- | --- | --- |
| Inicio de sesión, registro y recuperación de contraseña | **Tenemos.** Rutas protegidas, login, registro, recuperación y restablecimiento de contraseña. | apps/web/src/App.tsx; apps/web/src/auth/ |
| Organizaciones, membresías y control de acceso base | **Tenemos.** Membresías activas/inactivas y roles iniciales admin, clinician y viewer; RLS por organización. | supabase/schema/005_membership_status_access_control.sql |
| Expediente de estudiante/cliente | **Tenemos.** Alta, listado y detalle con iniciales, ID clínico, idioma, fecha de nacimiento, convivencia, tutores y hermanos. | apps/web/src/features/clients/; supabase/schema/001_initial_staging.sql |
| Evaluación clínica estructurada | **Tenemos.** Entrevista inicial, evaluación de preferencias y evaluación funcional persistidas. | apps/web/src/features/clinical/assessment-forms-dialog.tsx; supabase/schema/006_clinical_workspace.sql |
| Programas de adquisición básicos | **Tenemos.** Programas, metas, área de habilidad, criterio de dominio y procedimiento de enseñanza. | apps/web/src/features/clinical/clinical-plans-repository-contract.ts; supabase/schema/006_clinical_workspace.sql |
| Planes de reducción de conducta básicos | **Tenemos.** Definición operacional, dimensión, función hipotética, estrategia antecedente, conducta de reemplazo y estrategia de respuesta. | apps/web/src/features/clinical/clinical-plans-repository-contract.ts; supabase/schema/006_clinical_workspace.sql |
| Sesión clínica atómica | **Tenemos.** Una sesión guarda en una operación sus mediciones de conducta y ensayos de adquisición. | apps/web/src/features/clinical/clinical-session-repository-contract.ts; supabase/schema/008_atomic_clinical_session.sql |
| Mediciones y gráficos derivados | **Tenemos.** Frecuencia, duración, latencia e intervalo; informes con series y gráficos derivados. | specs/slice-13/; apps/web/src/features/reports/ |
| Informes y PDF local | **Tenemos, con QA pendiente.** Informes de progreso, evaluación y completo; PDF local minimizado. La lógica local está verde, aunque falta smoke visual/autenticado y revisión física del PDF autorizados. | specs/slice-15-complete-clinical-reports-pdf/; docs/system-rebuild/handoffs/2026-08-29-brujula-slice-15-local-candidate.md |

## Lo que tenemos sólo de forma parcial

| Área propuesta por APP ABA | Cobertura actual | Brecha concreta |
| --- | --- | --- |
| Roles ABA: supervisor, coordinador/secundario, terapeuta y familia | **Parcial.** Hay admin, clinician y viewer por organización. | No existe la equivalencia clínica completa ni permisos por estudiante/recurso. |
| Acceso a estudiantes autorizados | **Parcial.** RLS permite acceso a miembros activos de la organización. | No hay asignación de equipo ni autorización específica por estudiante. |
| Datos del estudiante | **Parcial.** Identificación minimizada, familia, contexto y borradores clínicos. | Diagnóstico, medicación histórica, motivo de consulta y consentimiento no están persistidos como contrato clínico aprobado. |
| Información familiar | **Parcial.** Tutores, hermanos y convivencia existen. | Faltan relaciones detalladas, contactos completos y acceso familiar separado. |
| Programas de adquisición | **Parcial.** Programa, meta, procedimiento y criterio existen. | Faltan antecedente, pasos, sets, niveles de ayuda, corrección de error, generalización/mantención como modelo persistido. |
| Programas de conducta | **Parcial.** Plan de conducta y campos básicos existen. | Faltan topografía explícita, conductas precursoras, plan de crisis informativo y criterio de logro. |
| Estados de programa | **Parcial.** Hay draft, active, mastered/archived. | APP ABA pide activo, logrado, pausado y descontinuado; no hay pausa ni correspondencia exacta de ciclo de vida. |
| Registro de adquisición | **Parcial.** Guarda correctos/incorrectos por meta en una sesión. | No hay plantilla por ensayos, códigos Independiente/Ayuda/Error/No responde, sets ni configuración de ayudas. |
| Registro de conducta | **Parcial.** Guarda valores por plan y soporta frecuencia, duración, latencia e intervalo. | No hay cronómetros/contadores interactivos ni captura de ocurrencias durante una sesión. |
| Registro por intervalo | **Parcial.** La dimensión interval admite observados/total y deriva porcentaje. | No separa intervalo total, parcial y muestreo de tiempo momentáneo. |
| Gráficos | **Parcial.** Series de líneas y datos textuales accesibles en Informes. | No hay editor de ejes, fases, leyendas, filtros de respuesta ni selector actual/histórico por programa. |
| Auditoría clínica | **Parcial.** El esquema contiene eventos de creación, actualización y archivo para entidades clínicas. | No cubre todavía decisiones de autorización, cambios de registro finos, exportaciones ni retención clínica completa. |

## Lo que no tenemos actualmente

| Área propuesta por APP ABA | Ausencia comprobada / alcance pendiente |
| --- | --- |
| Perfiles profesionales editables | No hay módulo de perfil con foto, profesión, título y descripción de supervisor/terapeuta. |
| Directorio TEAM | No existe gestión/visualización de perfiles de terapeutas, coordinadores y supervisores como equipo clínico. |
| Permiso de edición solicitado/aprobado | No existe flujo persistido de solicitud, aprobación, vigencia o revocación por estudiante y recurso. Está identificado como S-ABA-01 bloqueado por decisiones de producto. |
| Bandeja de mensajería de autorizaciones | No existe. |
| Chat interno por estudiante | No existe chat de equipo ni mensajes directos. |
| Portal familiar | No existe un rol, rutas ni una vista familiar separada de resultados. |
| Control de acceso familiar limitado a resultados | No existe una política o pantalla que implemente esa limitación. |
| Consentimiento informado PDF/enlace | Está bloqueado deliberadamente; no hay archivo, enlace, firma, vigencia ni auditoría de consentimiento. |
| Diseño completo de programa de adquisición | No hay editor del contenido detallado solicitado: antecedente, pasos, sets, ayudas, corrección de error, logro, generalización y mantención. |
| Mapa de flujo de procedimiento con IA | No existe integración IA, generación de diagrama ni descarga. |
| Descarga Word/PDF del diseño de un programa | No existe. El PDF actual corresponde a Informes, no al programa individual. |
| Inicio, pausa, reanudación y finalización operativa de sesión | No existe una máquina de sesión en vivo; la operación actual crea una sesión ya completada. |
| Temporizadores, contador y registro táctil durante sesión | No existe. |
| Códigos configurables de ayuda y estímulo | No existe un catálogo ni una plantilla de configuración. |
| Gráficos automáticos al finalizar cada registro | No existe ese evento por registro; se derivan series desde sesiones existentes para Informes. |
| Descarga PDF de cada gráfico | No existe como salida individual. Existe exportación local del informe completo y antecedentes de JPG para series de conducta. |
| Modo offline y sincronización | No existe almacenamiento local, cola de sincronización, resolución de conflictos ni indicador offline. |
| Informes de avance automáticos futuros | Existe un informe bajo demanda local; no existe generación automática, programación ni distribución de informes. |
| Arquitectura de microservicios/eventos | No existe: el proyecto actual es React + Supabase con repositorios locales, no microservicios, Kafka/Kinesis ni API Gateway. |

## Diferencias de modelo que importan antes de implementar

1. **Permisos:** el proyecto autoriza por membresía organizacional; APP ABA requiere acceso por estudiante, rol clínico y acción. No se debe simular esto sólo ocultando botones.
2. **Sesiones:** el modelo actual persiste agregados de una sesión completada; APP ABA propone captura guiada en tiempo real con ensayos, temporizadores, guardados parciales y finalización.
3. **Programas:** los modelos actuales son mínimos y funcionales para informes; no contienen aún toda la configuración clínica del documento fuente.
4. **Familia y chat:** son fronteras de privacidad nuevas, no extensiones visuales de las pantallas existentes.
5. **PDF:** el PDF actual está limitado a Informes y sigue pendiente de QA visual/autenticado; no debe usarse como evidencia de exportación de programas o gráficos individuales.
6. **Offline e IA:** ambos necesitan decisiones de seguridad, retención, sincronización y revisión humana antes de cualquier implementación.

## Prioridad sugerida de cierre de brechas

1. S-ABA-01: permisos y autorización por estudiante.
2. S-ABA-02: expediente mínimo, consentimiento y visibilidad por rol.
3. S-ABA-03: ciclo de vida y diseño completo de programas.
4. S-ABA-04 a S-ABA-06: sesión guiada y medidas ABA.
5. S-ABA-07: gráficos por programa y edición clínica.
6. S-ABA-08: solicitudes y chat.
7. S-ABA-09: exportaciones y mapa de flujo.
8. S-ABA-10: offline y sincronización.

## Límites de este resultado

- Es una comparación documental y de código local, no una auditoría de producción.
- “Tenemos” no implica que una capacidad esté publicada ni validada con datos reales.
- Las capacidades parcialmente cubiertas no deben considerarse equivalentes al flujo de APP ABA hasta que exista una spec aprobada y evidencia de pruebas correspondiente.
