# Test run: QA previa al acceso de la psicóloga

Fecha: 2026-08-18  
Alcance: inspección local read-only de specs Slice 02/03, frontend, tests y esquema SQL versionado.  
Datos: exclusivamente fixtures sintéticos.  
Estado de esta corrida inicial: **sustituida por el retest correctivo del mismo día**. Conservada como evidencia del descubrimiento; consultar `2026-08-18-pre-psychologist-qa-retest.md` para el resultado vigente.

## Restricciones de la corrida

- No se editó código ni specs.
- No se modificó Supabase, Auth, Sites ni ningún recurso remoto.
- No se crearon, actualizaron, archivaron ni eliminaron filas.
- No se ejecutó despliegue.
- No se ejecutó el build porque el destino configurado podía reemplazar artefactos existentes; debe repetirse luego en un destino de verificación no destructivo.

## Verificaciones ejecutadas

Desde `apps/web`, usando binarios ya instalados dentro del proyecto:

| Verificación | Resultado |
| --- | --- |
| Vitest | 11 archivos, 32 pruebas aprobadas |
| TypeScript `--noEmit` | aprobado |
| ESLint | aprobado, sin errores reportados |
| Build candidato | no ejecutado en esta corrida |
| QA remota Supabase/Sites | fuera del alcance read-only |

Los tests verdes confirman la cobertura existente; no invalidan los defectos encontrados en recorridos o requisitos sin prueba.

## Hallazgos abiertos

### QA-001 · P0 · staging no previene el ingreso de datos reales

**Estado:** abierto.  
**Evidencia:** Slice 03 exige rechazar o interrumpir entradas con apariencia de RUT, correo o nombre real. La implementación inspeccionada sólo presenta un banner; `clinicalId` y `livingArrangement` aceptan texto libre.  
**Riesgo:** una profesional puede usar un paciente antiguo pese a la advertencia, incorporando datos sensibles a un entorno cuyos gates clínicos están rojos.  
**Retest:** con entradas sintéticas que simulen patrones de RUT, correo y nombre completo, el formulario debe interrumpir el envío, explicar la política sin repetir el valor sensible y permitir corrección. Los casos sintéticos aprobados deben continuar funcionando.

### QA-002 · P1 · familiares añadidos no se pueden retirar

**Estado:** abierto.  
**Evidencia:** `ClientForm` permite `append` para tutores y hermanos, pero `RepeatablePeople` no expone una acción de eliminación. Las iniciales añadidas son obligatorias.  
**Riesgo:** un clic accidental bloquea el alta; cancelar o recargar hace perder el trabajo.  
**Retest:** agregar dos tutores y dos hermanos sintéticos, retirar elementos intermedios por teclado y ratón, comprobar etiquetas/índices y enviar una sola vez conservando los restantes.

### QA-003 · P1 · un `401` no invalida la sesión de aplicación

**Estado:** abierto.  
**Evidencia:** la normalización produce `DomainError("UNAUTHORIZED")`, pero listado, alta y detalle convierten ese error en estados locales; `AuthProvider` no recibe la invalidación.  
**Riesgo:** el usuario permanece en una interfaz aparentemente autenticada y obtiene errores repetidos en vez de volver al login.  
**Retest:** provocar un `401` sintético en lectura, detalle y alta; cada caso debe limpiar la identidad, navegar una sola vez a login y preservar únicamente un retorno interno seguro.

### QA-004 · P1 · las filas del listado no abren el detalle

**Estado:** abierto.  
**Evidencia:** las filas se renderizan como elementos `li` sin enlace ni botón.  
**Riesgo:** tras volver al listado no existe un recorrido visible para consultar nuevamente un cliente.  
**Retest:** activar una fila con teclado y ratón debe navegar a `/clientes/:id`; el control debe tener nombre accesible y mantener el aislamiento de recursos no autorizados.

### QA-005 · P1 · la métrica de clientes totales usa sólo activos

**Estado:** abierto.  
**Evidencia:** el repositorio filtra `status = active`; “Clientes activos” y “Clientes totales” usan el mismo largo de esa respuesta.  
**Riesgo:** la interfaz comunica un total incorrecto cuando existen registros archivados.  
**Retest:** con fixture de dos activos y un archivado, mostrar `2` activos y `3` totales mediante un contrato aprobado; no debilitar RLS ni cargar filas clínicas innecesarias.

### QA-006 · P1 · fechas calendario imposibles pasan validación frontend

**Estado:** abierto.  
**Evidencia:** `validDate` y `calculateAge` confían en `Date.parse`/`Date`; JavaScript normaliza `2026-02-31` como `2026-03-03`. La comparación de “hoy” usa UTC.  
**Riesgo:** fecha incorrecta o error remoto genérico; comportamiento distinto cerca del cambio de día en Chile.  
**Retest:** rechazar `2026-02-29`, `2026-02-30`, `2026-04-31` y equivalentes no bisiestos; aceptar `2024-02-29`; probar fecha presente y futura según la zona acordada.

### QA-007 · P2 · el detalle no ofrece reintento recuperable

**Estado:** abierto.  
**Evidencia:** ante error muestra mensaje y enlace al listado, sin acción para repetir `getById`.  
**Riesgo:** una falla transitoria obliga a abandonar el contexto.  
**Retest:** primer request sintético falla por red, el botón Reintentar ejecuta una nueva lectura y la segunda respuesta muestra el mismo detalle sin duplicar llamadas.

### QA-008 · P2 · asociación accesible incompleta de errores

**Estado:** abierto.  
**Evidencia:** el conflicto remoto de `clinicalId` se muestra inline, pero `aria-invalid` sólo considera errores del resolver y los textos no están asociados mediante `aria-describedby`.  
**Riesgo:** tecnologías de asistencia pueden no relacionar el error con su campo.  
**Retest:** errores locales y remotos deben marcar el campo, asociar descripción, enfocar el resumen y permitir llegar al campo afectado con teclado.

### QA-009 · P2 · altas manuales no quedan vinculadas a una corrida QA

**Estado:** abierto.  
**Evidencia:** `NewClientPage` llama `repository.create(values)` sin `testRunId`, aunque el contrato acepta ese identificador.  
**Riesgo:** registros sintéticos manuales quedan difíciles de inventariar y archivar no destructivamente por campaña.  
**Retest:** una corrida autorizada asigna un UUID sintético no clínico a todas sus altas y permite demostrar su pertenencia sin exponer payloads.

### QA-010 · P2 · falta una suite local repetible del adaptador/RLS

**Estado:** abierto.  
**Evidencia:** no hay pruebas unitarias del repositorio Supabase ni harness SQL versionado para repetir grants y RLS; la evidencia remota existente está documentada en Markdown.  
**Riesgo:** cambios futuros pueden romper aislamiento sin detección automática local/CI.  
**Retest:** ejecutar casos positivos y negativos versionados para anon, usuario sin membresía, viewer, clinician A y clinician B, sin borrar filas ni usar datos reales.

### QA-011 · P1 para datos clínicos · falta política `no-store`

**Estado:** abierto; no bloquea una demo estrictamente sintética si se acepta el riesgo, pero sí cualquier dato clínico.  
**Evidencia:** `_headers` y el Worker incluyen headers de seguridad, pero no `Cache-Control: no-store`; Slice 03 prohíbe caché compartida de vistas sensibles.  
**Retest:** respuestas HTML/rutas privadas de la versión desplegada deben emitir la política aprobada; assets versionados pueden conservar una política distinta y segura.

### QA-012 · P1 · la versión Sites guardada no contiene el cambio más reciente

**Estado:** abierto.  
**Evidencia:** la versión 1 corresponde al commit `5931e6e`; durante la inspección `environment-banner.tsx` y su prueba tenían cambios locales posteriores.  
**Riesgo:** desplegar la versión guardada no publicaría la advertencia reforzada esperada.  
**Retest:** generar un candidato no destructivo desde el commit aprobado, comprobar texto/banner en login y formulario, registrar hash y hacer smoke test privado antes de dar acceso.

## Cobertura faltante observada

- pruebas de `ClientDetailPage`;
- pruebas directas de `supabaseClientsRepository`;
- integración de `401` y `403` con la sesión;
- fechas calendario imposibles y borde de zona horaria;
- eliminación accesible de tutores/hermanos;
- navegación listado → detalle;
- diferencia entre métricas activas y totales;
- rechazo preventivo de patrones de datos reales;
- harness automatizado de grants/RLS.

## Orden recomendado de corrección y retest

1. QA-001: barrera preventiva de datos reales.
2. QA-003: invalidación global por `401`.
3. QA-002, QA-004, QA-005 y QA-006: recorridos principales y exactitud.
4. QA-007 a QA-011: recuperación, accesibilidad, trazabilidad, RLS y caché.
5. Generar candidato actualizado y resolver QA-012.
6. Ejecutar unitarias, integración, typecheck, lint, build no destructivo y recorrido manual sintético completo.

## Criterio de salida para el siguiente handoff

- Cero P0 y P1 abiertos para el alcance de prueba acordado.
- Cada corrección cuenta con prueba roja previa y regresión verde.
- Build candidato creado sin borrar artefactos y ligado a commit/hash.
- Smoke test privado con identidad y pacientes completamente sintéticos.
- Advertencia visible en login, listado, alta y detalle.
- Handoff declara expresamente que pacientes reales, antiguos o seudonimizados siguen prohibidos mientras los gates C-01 a C-10 estén rojos.

Hasta cumplir estos criterios, esta auditoría mantiene la recomendación **NO-GO** para entregar acceso a la psicóloga.
