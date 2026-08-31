# Plan PM de mejoras — estado actual vs. contrato ABA

Fecha: 2026-08-30  
Estado: **plan documental para Fase 2; no autoriza código, esquema, Supabase, infraestructura, VPS, despliegue ni publicación**

## Propósito

Este checklist organiza las mejoras que surgen al comparar el desarrollo actual con el contrato atómico APP ABA. No propone una reescritura: conserva la base verificada —expediente, evaluaciones, programas mínimos, sesión atómica, informes y PDF local— y separa lo que puede mejorar su preparación sin modificar estructura de lo que sólo debería cambiar después de resolver una decisión de producto y una spec aprobada.

## Fuentes de evidencia obligatorias

Las referencias en cada ítem usan estas tres fuentes:

- **[Estado]** `docs/system-rebuild/current-development-state.md`: snapshot, QA local, límites y brechas priorizadas.
- **[Contrato]** `docs/system-rebuild/atomic-model-aba-contract.md`: visión observada, átomos de negocio y decisiones DEC-ABA pendientes.
- **[Comparativo]** `docs/system-rebuild/comparativo-spec.md`: cobertura actual, brechas concretas y prioridad sugerida.

## Cómo usar el checklist

- **Prioridad P0 documental:** desbloquea seguridad, privacidad o el orden de las specs; no implica una incidencia de producción.
- **Prioridad P1 documental:** prepara el flujo clínico principal después de los bloqueantes.
- **Prioridad P2 documental:** amplía resultados, colaboración o calidad una vez resueltas las dependencias previas.
- **Completitud documental:** condición para cerrar el ítem de planificación; nunca significa que la capacidad ya esté implementada o publicada.

## 1. Mejoras sin cambio estructural

Estas acciones mejoran trazabilidad, evidencia y preparación del proyecto actual. No requieren proponer una alteración funcional, de base de datos o de infraestructura.

- [ ] **M-01 — Consolidar el mapa de cobertura actual y sus límites.**  
  - **Motivo:** el producto tiene un núcleo ABA verificable, pero varias coberturas son parciales y no deben presentarse como equivalentes al flujo completo del contrato.  
  - **Evidencia:** [Estado] declara que Fase 1 es un snapshot y enumera brechas; [Contrato] separa observado, propuesto y pendiente; [Comparativo] contabiliza 9 capacidades existentes, 12 parciales y 19 ausentes.  
  - **Prioridad:** P0 documental.  
  - **Dependencia/decisión:** ninguna; sólo conservar la separación verificado/inferido/pendiente.  
  - **Completitud documental:** cada futura spec enlaza la brecha del comparativo, el átomo del contrato y el estado actual que preserva.

- [ ] **M-02 — Normalizar una plantilla de spec de cuatro capas y BDD.**  
  - **Motivo:** el contrato exige frontend, backend, Supabase y publicación, además de ejemplos anonimizados; el estado actual exige una spec aprobada antes de TDD.  
  - **Evidencia:** [Estado] fija que cada cambio funcional requiere spec aprobada; [Contrato] prescribe las cuatro capas, BDD, TDD y fixtures anonimizados; [Comparativo] indica que las coberturas parciales no son equivalentes sin spec aprobada y evidencia.  
  - **Prioridad:** P0 documental.  
  - **Dependencia/decisión:** ninguna; no define todavía reglas clínicas.  
  - **Completitud documental:** existe una plantilla revisable con objetivo, límites, roles, estados, validaciones, cuatro capas, BDD, riesgos y stop conditions.

- [ ] **M-03 — Completar el inventario de QA pendiente del candidato local.**  
  - **Motivo:** los informes y PDF tienen pruebas locales verdes, pero aún no existe evidencia de navegador real, lecturas RLS autenticadas ni PDF físico/visual.  
  - **Evidencia:** [Estado] registra 137/137, build/preflight y BDD verdes, pero marca esos tres vacíos; [Contrato] conserva Slice 15 como candidato local y prohíbe inferir publicación; [Comparativo] califica Informes/PDF como existentes con QA pendiente y no verificados en staging.  
  - **Prioridad:** P1 documental.  
  - **Dependencia/decisión:** autorización separada para ejecutar smoke visual/autenticado y producir/inspeccionar el PDF dentro del workspace.  
  - **Completitud documental:** checklist de QA con entrada, fixture sintético, evidencia esperada, responsable y criterio de no-go; sin ejecutar pruebas no autorizadas.

- [ ] **M-04 — Planificar el cierre de PERF-14-001.**  
  - **Motivo:** el único riesgo de calidad abierto identificado es el bundle principal de 296.24 kB gzip; debe evaluarse sin asumir una solución o introducir dependencias.  
  - **Evidencia:** [Estado] identifica PERF-14-001 y su tamaño; [Contrato] exige elegir slices pequeños, pruebas y refactor sólo tras aprobación; [Comparativo] confirma que existe una base React/Supabase y que no se requiere una reescritura/microservicios para las brechas identificadas.  
  - **Prioridad:** P2 documental.  
  - **Dependencia/decisión:** decidir presupuesto de rendimiento, ruta crítica y medición aceptable antes de una spec técnica.  
  - **Completitud documental:** presupuesto acordado, métrica de partida citada, hipótesis de causa, alternativas acotadas y plan de medición posterior.

- [ ] **M-05 — Mantener el registro de decisiones, checkpoints, handoff y Brújula.**  
  - **Motivo:** la Fase 2 contiene decisiones clínicas y de privacidad que no se pueden convertir en hechos por acumulación de documentación.  
  - **Evidencia:** [Estado] pide backlog, tareas, criterios y una ruta controlada de publicación; [Contrato] define el loop spec → aprobación → TDD → QA → handoff → Brújula; [Comparativo] advierte que el resultado no equivale a auditoría ni producción.  
  - **Prioridad:** P0 documental.  
  - **Dependencia/decisión:** ninguna; se activa al cerrar cada checkpoint aprobado.  
  - **Completitud documental:** cada decisión tiene ID, alcance, fuente, aprobador, consecuencia y siguiente spec afectada; cada checkpoint deja handoff y Brújula sólo cuando corresponda.

## 2. Funciones, flujos y validaciones faltantes

Estos son déficits funcionales frente al contrato. Primero se documentan como historias/specs; no se implementan ni se convierten automáticamente en cambios de modelo.

- [ ] **F-01 — Roles ABA y autorización por estudiante, recurso y acción.**  
  - **Motivo:** los roles actuales son organizacionales (admin, clinician, viewer), mientras la visión requiere supervisor, coordinador/secundario, terapeuta y familia, con permisos por estudiante y operación.  
  - **Evidencia:** [Estado] lo prioriza como la primera brecha; [Contrato] define la matriz de roles y DEC-ABA-01; [Comparativo] confirma que sólo existen roles base y RLS organizacional, sin asignación por estudiante.  
  - **Prioridad:** P0 documental.  
  - **Dependencia/decisión:** DEC-ABA-01: recursos, acciones, alcance, aprobación, expiración si aplica y revocación.  
  - **Completitud documental:** matriz rol × estudiante × recurso × acción, transiciones de autorización, errores sin filtración, cuatro capas y BDD sintético aprobables.

- [ ] **F-02 — Visibilidad familiar y expediente clínico mínimo.**  
  - **Motivo:** la visión requiere que la familia vea resultados limitados y solicita datos clínicos/consentimiento; el proyecto sólo contiene familia básica y expediente minimizado.  
  - **Evidencia:** [Estado] prioriza expediente, consentimiento y visibilidad por rol; [Contrato] define el átomo de estudiante y DEC-ABA-02/03; [Comparativo] confirma ausencia de portal/política familiar y persistencia de consentimiento.  
  - **Prioridad:** P0 documental.  
  - **Dependencia/decisión:** DEC-ABA-02 (qué ve familia) y DEC-ABA-03 (referencia, archivo o firma; vigencia y acceso).  
  - **Completitud documental:** catálogo de campos mínimo, clasificación obligatorio/opcional/fuera de MVP, matriz de visibilidad y estados vacío/sin permiso/error, sin datos reales.

- [ ] **F-03 — Diseño completo y ciclo de vida de programas.**  
  - **Motivo:** los programas actuales cubren el mínimo para informes, pero no los pasos, sets, ayudas, corrección de error, generalización/mantención ni los estados completos solicitados.  
  - **Evidencia:** [Estado] identifica el detalle de adquisición/conducta como tercera brecha; [Contrato] enumera los átomos y exige definir transiciones/versionado; [Comparativo] documenta campos faltantes y el desajuste draft/active/mastered/archived vs. activo/logrado/pausado/descontinuado.  
  - **Prioridad:** P1 documental.  
  - **Dependencia/decisión:** definir estados, transiciones, edición directa frente a versión y permisos derivados de F-01.  
  - **Completitud documental:** dos listas de campos (adquisición y conducta), reglas de obligatoriedad, transición de estados, comportamiento de edición/auditoría y BDD sintético.

- [ ] **F-04 — Sesión guiada y plantilla de porcentaje por ensayos.**  
  - **Motivo:** hoy se persiste una sesión atómica completada; el flujo requerido inicia, guarda, registra ensayos, usa códigos/ayudas y finaliza una sesión en vivo.  
  - **Evidencia:** [Estado] prioriza sesión guiada, plantillas, códigos, ayudas y temporizadores; [Contrato] define sesión abierta/cerrada, plantilla, registro y DEC-ABA-06; [Comparativo] confirma que faltan máquina de sesión, ensayos configurables y captura interactiva.  
  - **Prioridad:** P1 documental.  
  - **Dependencia/decisión:** DEC-ABA-06 y F-01/F-03 aprobadas.  
  - **Completitud documental:** estados de sesión, reglas de guardar/enviar/finalizar/reanudar, configuración de ensayos/códigos/ayudas, cálculo de porcentaje, validaciones y BDD.

- [ ] **F-05 — Medidas en vivo: frecuencia, duración, latencia y TER.**  
  - **Motivo:** existen medidas agregadas, pero no están definidos cronómetros/contadores interactivos, pausas, faltantes ni fórmulas de salida para el flujo propuesto.  
  - **Evidencia:** [Estado] pide medidas y sesión en vivo; [Contrato] lista configuración/captura de estas medidas y DEC-ABA-04; [Comparativo] constata que faltan cronómetros, contadores y captura de ocurrencias durante sesión.  
  - **Prioridad:** P1 documental.  
  - **Dependencia/decisión:** DEC-ABA-04 y DEC-ABA-06.  
  - **Completitud documental:** unidades y fórmulas, inicio/pausa/fin, datos inválidos/faltantes, payload derivado y escenarios BDD deterministas.

- [ ] **F-06 — Modalidades de intervalo diferenciadas.**  
  - **Motivo:** el intervalo actual calcula un porcentaje único; la visión distingue total, parcial y muestreo de tiempo momentáneo.  
  - **Evidencia:** [Estado] lista intervalos diferenciados como brecha; [Contrato] enumera las tres modalidades y marca DEC-ABA-04; [Comparativo] confirma que el modelo actual no las separa.  
  - **Prioridad:** P1 documental.  
  - **Dependencia/decisión:** DEC-ABA-04 y las reglas de sesión de F-04.  
  - **Completitud documental:** definición por modalidad, observación/punto de muestreo, fórmula, configuración inválida, puntos de gráfico y BDD sintético.

- [ ] **F-07 — Gráficos por programa y validaciones de edición.**  
  - **Motivo:** las series de informes son una base, pero no sustituyen gráficos configurables por programa, con fases, leyendas, filtros y vista actual/histórica.  
  - **Evidencia:** [Estado] prioriza gráficos clínicos por programa; [Contrato] define gráfico, permisos y DEC-ABA-04/05; [Comparativo] registra que no hay editor de ejes/fases/leyendas/filtros ni selector por programa.  
  - **Prioridad:** P1 documental.  
  - **Dependencia/decisión:** DEC-ABA-04, DEC-ABA-05 y las fuentes de registro definidas en F-04 a F-06.  
  - **Completitud documental:** fuente canónica de puntos, ejes/rangos/fases/leyendas, filtros, estados sin datos, permisos y política de corrección/auditoría.

- [ ] **F-08 — Solicitudes de edición, mensajería y chat por estudiante.**  
  - **Motivo:** la coordinación requiere solicitar autorización y el equipo necesita colaboración por estudiante, pero ambas funciones abren una frontera de privacidad y retención no definida.  
  - **Evidencia:** [Estado] prioriza solicitudes, mensajería y chat; [Contrato] define colaboración y DEC-ABA-10; [Comparativo] confirma que no existen solicitud persistida, bandeja ni chat.  
  - **Prioridad:** P2 documental.  
  - **Dependencia/decisión:** F-01/DEC-ABA-01 y DEC-ABA-10 (participantes, contenido, visibilidad, retención, moderación).  
  - **Completitud documental:** modelos de estados de solicitud y conversación, matriz de participantes, notificaciones, datos prohibidos, errores, trazabilidad y BDD sintético.

- [ ] **F-09 — Salidas separadas: programa, gráfico, informe y mapa de flujo.**  
  - **Motivo:** el PDF actual corresponde a informes; no debe interpretarse como exportación de programas, gráficos individuales o mapas de flujo.  
  - **Evidencia:** [Estado] ubica exportaciones y mapa de flujo después de una decisión específica; [Contrato] separa salidas y DEC-ABA-07/09; [Comparativo] confirma ausencia de Word/PDF de programa, PDF individual de gráfico e integración de mapa/IA.  
  - **Prioridad:** P2 documental.  
  - **Dependencia/decisión:** DEC-ABA-07 (IA/revisión/privacidad) y DEC-ABA-09 (contenido, formato, permisos y persistencia).  
  - **Completitud documental:** contratos separados, revisión humana obligatoria si aplica, datos excluidos, descarga/compartición, errores y criterios de privacidad.

- [ ] **F-10 — Offline y sincronización.**  
  - **Motivo:** no existe almacenamiento local, cola, conflictos ni indicador offline; no se debe asumir que una sesión guiada implica soporte sin conexión.  
  - **Evidencia:** [Estado] marca offline como posterior a decisión específica; [Contrato] identifica DEC-ABA-08 y exige delimitar cifrado/conflictos; [Comparativo] confirma ausencia de los componentes de sincronización.  
  - **Prioridad:** P2 documental.  
  - **Dependencia/decisión:** DEC-ABA-08 y definición final de sesión, permisos y privacidad.  
  - **Completitud documental:** alcance de dispositivos/datos, seguridad local, cola, conflictos, reintentos, indicadores y BDD de pérdida de conexión; sin implementación.

## 3. Cambios estrictamente necesarios por choque de flujo, esquema DB o funcionalidad

Los siguientes cambios no se proponen ahora como tareas técnicas. Se vuelven necesarios **únicamente** si se aprueban las funciones asociadas, porque el modelo actual no puede expresar sus reglas de forma segura. Cada renglón requiere una spec aprobada antes de tocar código o esquema.

- [ ] **E-01 — Permisos persistentes por estudiante y recurso.**  
  - **Motivo:** el control actual por organización no puede representar una autorización clínica granular ni su revocación; ocultar controles de UI no resuelve el choque.  
  - **Evidencia:** [Estado] identifica permisos por estudiante/recurso como brecha nº 1; [Contrato] exige reglas de backend, Supabase/RLS y publicación para S-ABA-01; [Comparativo] señala explícitamente que no se debe simular el permiso sólo ocultando botones.  
  - **Prioridad:** P0 condicionado.  
  - **Dependencia/decisión:** DEC-ABA-01 y aprobación de F-01.  
  - **Completitud documental:** modelo lógico de autorización, invariantes de RLS/backend, migración conceptual sin ejecutarla, matriz de pruebas negativas y plan de reversión no destructiva.

- [ ] **E-02 — Campos clínicos, consentimiento y visibilidad del expediente.**  
  - **Motivo:** diagnóstico, medicación histórica, motivo de consulta y consentimiento no están en un contrato persistido aprobado; añadirlos sin permisos y retención definidos crearía un choque de privacidad.  
  - **Evidencia:** [Estado] prioriza expediente y consentimiento por rol; [Contrato] relaciona esos átomos con DEC-ABA-02/03; [Comparativo] confirma que sólo existe expediente minimizado y que consentimiento está deliberadamente bloqueado.  
  - **Prioridad:** P0 condicionado.  
  - **Dependencia/decisión:** F-01, F-02, DEC-ABA-02 y DEC-ABA-03.  
  - **Completitud documental:** diccionario de datos, clasificación sensible, accesos por campo, regla de historial/no sobrescritura, retención y contrato de error/sin permiso.

- [ ] **E-03 — Modelo detallado y versionable de programas.**  
  - **Motivo:** los campos actuales mínimos no contienen sets, niveles de ayuda, corrección de error, generalización/mantención, precursoras o ciclo de pausa requerido por el flujo.  
  - **Evidencia:** [Estado] identifica la brecha de programas completos; [Contrato] define átomos y pregunta si editar cambia diseño o crea versión; [Comparativo] confirma tanto campos faltantes como ciclo de vida no equivalente.  
  - **Prioridad:** P1 condicionado.  
  - **Dependencia/decisión:** F-03 y permisos aprobados de F-01.  
  - **Completitud documental:** contrato de entidad/versiones, estado/transiciones, compatibilidad con programas existentes, reglas de auditoría y prueba BDD de migración conceptual sin datos reales.

- [ ] **E-04 — Modelo de sesión abierta y registros atómicos de captura.**  
  - **Motivo:** una sesión ya completada no expresa apertura, guardado parcial, pausa/reanudación, ensayos, ocurrencias ni cronometraje del flujo en vivo.  
  - **Evidencia:** [Estado] diferencia sesión guiada de las mediciones existentes; [Contrato] define sesión abierta/cerrada, plantilla y registros, además de DEC-ABA-06; [Comparativo] confirma que la operación actual crea una sesión completada y no hay temporizadores/contador.  
  - **Prioridad:** P1 condicionado.  
  - **Dependencia/decisión:** F-03, F-04, DEC-ABA-06 y validación de medidas F-05/F-06.  
  - **Completitud documental:** máquina de estados, composición de registro, reglas de reingreso/abandono, consistencia de envío, modelo de auditoría y conjunto de BDD.

- [ ] **E-05 — Tipos explícitos de intervalo y datos derivados para gráficos.**  
  - **Motivo:** un único porcentaje de intervalo no permite preservar las reglas distintas de total, parcial y momentáneo, ni garantizar cálculos y gráficos correctos.  
  - **Evidencia:** [Estado] exige medidas de intervalo diferenciadas y gráficos por programa; [Contrato] enumera las tres modalidades y DEC-ABA-04; [Comparativo] confirma que el esquema actual no las separa y que los gráficos no tienen configuración clínica completa.  
  - **Prioridad:** P1 condicionado.  
  - **Dependencia/decisión:** F-04, F-06, F-07 y DEC-ABA-04.  
  - **Completitud documental:** contrato de cada modalidad, fórmula verificable, datos fuente/derivados, compatibilidad con registros actuales y pruebas de cálculo.

- [ ] **E-06 — Trazabilidad de decisiones y comunicaciones clínicas.**  
  - **Motivo:** solicitudes de edición y chat requieren estados, destinatarios, visibilidad y retención; no caben de manera segura en la auditoría clínica actual, que no cubre esas decisiones ni exportaciones.  
  - **Evidencia:** [Estado] prioriza autorizaciones, mensajería y chat; [Contrato] define solicitud/mensaje y DEC-ABA-10; [Comparativo] confirma su ausencia y la cobertura incompleta de auditoría para autorización/retención.  
  - **Prioridad:** P2 condicionado.  
  - **Dependencia/decisión:** E-01, F-08 y DEC-ABA-10.  
  - **Completitud documental:** entidades o contratos lógicos separados, transiciones, participantes, retención/moderación, auditoría y reglas de privacidad antes de cualquier persistencia.

- [ ] **E-07 — Contratos de salida y controles de acceso.**  
  - **Motivo:** las salidas futuras de programa/gráfico/mapa requieren formatos, permisos y trazabilidad distintos del informe PDF existente; la IA añadiría una frontera adicional de datos.  
  - **Evidencia:** [Estado] reserva exportaciones e IA para decisiones específicas; [Contrato] separa salidas y exige revisar proveedor/retención/datos permitidos; [Comparativo] diferencia el PDF de informes de las exportaciones ausentes.  
  - **Prioridad:** P2 condicionado.  
  - **Dependencia/decisión:** F-01, F-09, DEC-ABA-07 y DEC-ABA-09.  
  - **Completitud documental:** contrato por salida, contenido permitido, autorización, clasificación de datos, error, descarga/compartición y revisión humana cuando corresponda.

- [ ] **E-08 — Persistencia local y sincronización segura, si offline se aprueba.**  
  - **Motivo:** offline exigiría almacenamiento, cifrado, cola y resolución de conflictos que no existen en la arquitectura actual.  
  - **Evidencia:** [Estado] establece que offline sólo sigue tras decisión específica; [Contrato] exige DEC-ABA-08 antes de almacenamiento/sincronización; [Comparativo] confirma ausencia de almacenamiento local, cola, conflictos e indicador.  
  - **Prioridad:** P2 condicionado.  
  - **Dependencia/decisión:** F-10/DEC-ABA-08, más modelos finales E-01, E-04 y E-05.  
  - **Completitud documental:** amenaza de dispositivo, datos mínimos locales, cifrado, cola, conflictos, recuperación y pruebas BDD sintéticas; no se instala ni configura tecnología.

## Secuencia documental recomendada

1. [ ] M-01, M-02 y M-05: dejar el sistema de trazabilidad listo.
2. [ ] F-01 y F-02: resolver acceso por estudiante, familia, campos mínimos y consentimiento.
3. [ ] F-03: cerrar programa/ciclo de vida antes de ampliar registros.
4. [ ] F-04, F-05 y F-06: especificar sesión y medidas con fórmulas validadas.
5. [ ] F-07: definir gráficos sólo con fuentes de datos acordadas.
6. [ ] F-08, F-09 y F-10: abordar colaboración, salidas, IA y offline después de sus decisiones de privacidad.
7. [ ] M-03 y M-04: mantener QA y rendimiento como líneas de calidad; no sustituyen los gates funcionales.
8. [ ] Convertir cualquier ítem E-01 a E-08 en trabajo técnico sólo después de la aprobación individual de su función/spec.

## Límites de este plan

- No agrega perfiles profesionales, directorio TEAM, microservicios/eventos ni informes automáticos como trabajo comprometido: el comparativo los identifica como ausentes, pero el contrato no proporciona decisiones suficientes para implementarlos en esta fase.
- No presupone proveedor, VPS, dominio, hosting, datos reales ni prueba pública; esas decisiones permanecen fuera de este plan de mejoras y requieren su propio gate de publicación.
- No modifica ni invalida las capacidades existentes; las usa como línea base verificada y evita una reescritura.
