# Handoff de cierre — continuación del MVP profesional

Fecha de cierre: 2026-08-18  
Workspace autorizado: `C:\Users\Moonlabpc\Desktop\aba 2`  
Proyecto Supabase: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)

## Objetivo vigente

Reconstruir el sistema clínico observado en el material disponible hasta obtener un MVP utilizable
por una psicóloga profesional. En esta fase sólo se permite información sintética; todavía no existe
autorización para datos clínicos reales, históricos o identificables.

## Reglas inmutables

- Todo el trabajo debe permanecer dentro de `C:\Users\Moonlabpc\Desktop\aba 2`.
- No leer, explorar, escribir ni mover contenido fuera de esa carpeta sin permiso explícito.
- No borrar archivos, carpetas, registros, tablas, índices ni recursos locales o remotos.
- Supabase se usa exclusivamente en el proyecto staging indicado arriba.
- Mantener specs separadas para frontend, backend, Supabase y publicación.
- Trabajar con spec-driven development y TDD.
- Usar React, Vite, Tailwind y shadcn/ui.
- NestJS queda documentado para crecimiento futuro; no forma parte del MVP actual.
- El QA integral del piloto y la publicación agrupada permanecen al final. Cada lote sí debe cerrar
  con regresión proporcional, corrección de hallazgos, handoff y brújula.

## Estado funcional entregado

- Login con correo y contraseña.
- Registro público con correo, confirmación y aprobación administrativa.
- Entrada con Google configurada en la interfaz.
- Membresías por organización, roles y aprobación de acceso.
- Listado, alta y detalle de clientes.
- Tutores, hermanos y contexto familiar.
- Entrevista inicial, preferencias y evaluación funcional.
- Programas de adquisición, metas y planes de conducta.
- Captura clínica de fecha, notas, mediciones y ensayos.
- Alta atómica de sesión mediante `create_clinical_session`.
- RLS, auditoría y aislamiento organizacional en staging.

## Último lote cerrado

Slice 09 / Lote 04 — sesión clínica atómica.

- La pantalla consume metas y planes reales del cliente.
- Una única RPC crea cabecera, mediciones y ensayos.
- La función usa `SECURITY INVOKER`.
- `PUBLIC` y `anon` no pueden ejecutarla; `authenticated` sí.
- Payload vacío o malformado se rechaza con `22023`.
- Se corrigió la incompatibilidad de estados entre frontend y base de datos:
  - programas y metas: `draft | active | mastered | archived`;
  - planes: `draft | active | resolved | archived`.
- Regresión: 73/73 pruebas, TypeScript y ESLint en verde.
- Contrato SQL remoto en verde y versionado en `supabase/tests/003_atomic_clinical_session.sql`.
- No se ejecutó build porque el proceso reemplaza `dist` y contradice la regla de no borrado.

Documentos relacionados:

- `docs/system-rebuild/handoffs/2026-08-18-front-first-batch-04.md`
- `docs/system-rebuild/test-runs/2026-08-18-atomic-clinical-session.md`
- `docs/system-rebuild/supabase-screen-connection-matrix.md`

## Estado de publicación

La versión pública desplegada no incluye todos los cambios recientes de los lotes clínicos. No se
debe asumir que la vista alojada representa el estado local actual. La publicación debe agruparse
después de cerrar informes y antes del QA final autenticado.

## Brújula activa

| Categoría | Avance | Dirección inmediata |
| --- | ---: | --- |
| Auth y navegación | 90% | recuperación de contraseña y endurecimiento |
| Gestión y ficha de clientes | 85% | edición clínica completa |
| Evaluaciones | 75% | historial y presentación |
| Adquisición y reducción | 78% | pulido y validación final |
| Sesiones clínicas | 72% | historial detallado y correcciones controladas |
| Informes y gráficos | 20% | siguiente lote prioritario |
| Supabase, RLS y auditoría | 90% | mantener contratos y pruebas RLS |
| Publicación y operación | 55% | publicar el próximo bloque estable |
| QA y cumplimiento piloto | 65% | gate final sólo con datos sintéticos |

**Avance ponderado estimado del MVP profesional: 69%.**

## Riesgos y pendientes conocidos

- No ingresar datos de pacientes reales o antiguos.
- La protección de contraseñas filtradas de Supabase permanece desactivada y requiere plan Pro.
- Los índices señalados como no usados se conservan porque staging aún tiene poco tráfico y varios
  cubren claves foráneas o consultas previstas.
- Falta confirmar los flujos autenticados completos en la versión que finalmente se publique.
- Faltan controles definitivos de no-cache, privacidad, responsive, accesibilidad e impresión para
  el piloto profesional.

## Siguiente spec

Slice 09 / Lote 05A — informes clínicos derivados.

Criterios propuestos:

1. Consultar sesiones, mediciones y ensayos del cliente respetando RLS.
2. Mostrar evolución temporal por plan de conducta.
3. Calcular porcentaje de ensayos correctos por meta.
4. Filtrar por rango de fechas sin mezclar clientes ni series.
5. Incluir estados de carga, vacío, error recuperable y reintento.
6. Crear un resumen profesional imprimible sin identificadores innecesarios.
7. Derivar el informe desde registros existentes; no duplicar datos en una tabla nueva.
8. Escribir primero pruebas fallidas, implementar, ejecutar regresión y corregir hallazgos.
9. Cerrar con un nuevo handoff y actualizar la brújula.

Después: Lote 05B de pulido visual, impresión y responsive; luego publicación agrupada y QA final
del MVP con cuenta profesional y datos exclusivamente sintéticos.

## Mensaje listo para la nueva conversación

> Continúa el proyecto desde
> `docs/system-rebuild/handoffs/2026-08-18-conversation-close.md`. Respeta completamente
> `AGENTS.md`: trabaja sólo dentro de `C:\Users\Moonlabpc\Desktop\aba 2`, no accedas a otras
> carpetas y no borres nada local ni remoto. Empieza Slice 09 / Lote 05A, informes clínicos
> derivados, en modo spec-driven y TDD. Usa React, Vite, Tailwind, shadcn/ui y Supabase staging
> `arfwuctpwnnuhdgjtxaa`; no uses NestJS ni datos reales. Valida las conexiones, soluciona los
> hallazgos del lote y termina con handoff y brújula actualizada.

