# Estado actual del desarrollo — cierre de Fase 1 y preparación de Fase 2

Fecha: 2026-08-30  
Estado: **snapshot documental; no autoriza programación, despliegue ni publicación**

## Propósito

Este documento es la fotografía actual del desarrollo. Separa lo verificado localmente, lo incompleto, las brechas frente al contrato APP ABA y las decisiones necesarias antes de iniciar una Fase 2 organizada.

## Estado verificable

| Área | Estado actual | Evidencia |
| --- | --- | --- |
| Base web | React, TypeScript, rutas protegidas y componentes shadcn/ui | apps/web/src/App.tsx; apps/web/src/components/ui/ |
| Autenticación y membresías | implementadas para entorno sintético/staging; roles base admin, clinician y viewer | apps/web/src/auth/; supabase/schema/005_membership_status_access_control.sql |
| Expediente | alta, listado, detalle y familia básica implementados | apps/web/src/features/clients/ |
| Evaluaciones | entrevista inicial, preferencias y funcional implementadas | apps/web/src/features/clinical/assessment-forms-dialog.tsx |
| Programas y planes | adquisición y reducción con modelos mínimos implementados | supabase/schema/006_clinical_workspace.sql |
| Sesiones y mediciones | escritura atómica de sesiones, ensayos y medidas; dimensiones 13A verificadas localmente | supabase/schema/008_atomic_clinical_session.sql; docs/system-rebuild/test-runs/2026-08-25-slice-13a-tdd-bdd.md |
| Informes | progreso, evaluación y completo implementados localmente | specs/slice-15-complete-clinical-reports-pdf/ |
| PDF local | contrato y pruebas locales verdes; inspección física pendiente de autorización | docs/system-rebuild/test-runs/2026-08-29-slice-15-local-release-loop.md |
| Publicación | no publicada; sin VPS, dominio, URL, hosting ni pruebas públicas | docs/system-rebuild/handoffs/2026-08-29-brujula-slice-15-local-candidate.md |

## Calidad y evidencia disponible

- Slice 15: 137/137 pruebas, TypeScript, ESLint, build/preflight local y BDD de Informes 19/19 verdes.
- Esto demuestra el candidato local; **no** demuestra flujo visual real, lecturas RLS autenticadas, PDF físico ni publicación.
- P2 abierto: PERF-14-001, bundle principal de 296.24 kB gzip.
- No se registran P0/P1 nuevos en la evidencia local más reciente. Esta observación no equivale a una auditoría pública o de producción.

## Brechas funcionales frente al contrato APP ABA

La referencia completa está en docs/system-rebuild/comparativo-spec.md. Las brechas prioritarias son:

1. Permisos ABA por estudiante y recurso, incluyendo supervisor, coordinador, terapeuta y familia.
2. Expediente clínico mínimo, consentimiento y visibilidad específica por rol.
3. Programas ABA con el detalle de adquisición y conducta solicitado.
4. Sesión guiada de toma de datos en vivo, plantillas, códigos, ayudas y temporizadores.
5. Medidas de intervalo diferenciadas y gráficos clínicos por programa.
6. Solicitudes de autorización, mensajería y chat.
7. Exportación de programas/gráficos y mapa de flujo con IA, sólo después de una decisión específica.
8. Offline y sincronización, sólo después de una decisión específica.

## Fase 2 propuesta: alcance de planificación

Fase 2 comienza como una fase de **organización y preparación**, no de código. Sus productos serán:

- una épica de trabajo y un backlog priorizado;
- historias expresadas como specs atómicas de cuatro capas;
- tareas simples con dependencias, criterios de aceptación y stop conditions;
- una ruta de verificación y publicación pública controlada;
- una lista de decisiones de infraestructura para VPS, dominio, TLS, secretos, backups, observabilidad, reversión y soporte.

## Preparación de VPS y pruebas públicas

La intención de publicar no otorga permiso para desplegar. Antes de crear una VPS o publicar, el plan debe definir y recibir aprobación explícita sobre:

1. proveedor, región, titularidad y presupuesto;
2. dominio/subdominio, DNS, TLS y correo transaccional;
3. ambiente separado de producción, secretos y rotación;
4. datos permitidos en pruebas públicas: inicialmente sólo sintéticos o el marco legal/documental aprobado para datos reales;
5. autenticación, gestión de miembros y límite de audiencia;
6. backups, monitoreo, logs, alertas, soporte y plan de reversión;
7. amenaza y revisión de privacidad para salud/menores, consentimiento, retención y acceso familiar;
8. gate previo de QA: navegador real, RLS autenticada, PDF físico y pruebas de seguridad;
9. decisión de qué significa “públicas”: acceso abierto, lista de espera, piloto invitado o beta restringida.

## Límites invariables

- No programar, mutar Supabase, crear VPS, subir archivos, desplegar ni publicar como parte de este snapshot.
- No usar datos clínicos reales ni cuentas de terceros.
- Cada futuro cambio funcional requiere spec aprobada antes de TDD.
- Infraestructura y publicación son un slice separado; nunca una consecuencia automática de un build verde.

## Siguiente trabajo

Un agente PM debe convertir este estado y el comparativo en una épica Fase 2, con historias/specs y tareas. Su salida es una propuesta de planificación que requiere aprobación del usuario antes de iniciar cualquier spec o cambio técnico.

