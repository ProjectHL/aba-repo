# Handoff: QA prepsicóloga y staging sintético

Fecha: 2026-08-18  
Estado: supersedido por `2026-08-18-private-pilot-live.md`; correcciones locales y Supabase staging verificadas en esta etapa.  
Decisión: **candidato apto para prueba profesional sintética después del último gate de publicación**.

## Entregado

- Agente QA y checklist independiente documentados en `docs/system-rebuild/qa-agent.md`.
- Doce hallazgos trazados, corregidos o mitigados y retesteados.
- Sesión invalidada globalmente ante 401.
- Flujo de Clientes recuperable: navegación a detalle, reintento, eliminación de familiares y métricas correctas.
- Fechas calendario estrictas con zona `America/Santiago`.
- Barrera de staging: advertencia persistente, confirmación obligatoria y rechazo de RUT/correo evidente.
- Registros creados desde la UI vinculados a una corrida QA.
- Headers `no-store`, noindex, CSP y fallback SPA comprobados localmente.
- Supabase staging con RLS en todas las tablas expuestas, aislamiento entre organizaciones, negativa de escritura para viewer, cero políticas DELETE y auditoría de create/update/archive.
- Migración 004 y harness SQL de integridad versionados.

## Evidencia

- `docs/system-rebuild/test-runs/2026-08-18-pre-psychologist-qa.md`: auditoría inicial.
- `docs/system-rebuild/test-runs/2026-08-18-pre-psychologist-qa-retest.md`: retest vigente.
- `supabase/schema/004_audit_client_updates.sql`: auditoría de cambios.
- `supabase/tests/001_staging_integrity.sql`: comprobación repetible no destructiva.
- `apps/web/verification/qa-pre-psychologist-20260818-v2`: candidato local verificado.

## Límites vigentes

- No se desplegó ni se modificó el acceso del Site.
- La versión Sites 1 está obsoleta y no debe entregarse.
- La protección de contraseñas filtradas continúa como limitación del plan Free.
- No se realizó QA visual interactiva de navegador en esta ronda; sí componentes, accesibilidad automatizada y smoke HTTP.
- No existe autorización para datos reales. Los gates clínicos C-01 a C-10 siguen rojos.

## Siguiente spec

`Slice 02 / Publicación privada y onboarding de evaluadora sintética`:

1. congelar el candidato exacto y guardar una versión Sites nueva;
2. desplegarla de forma privada sólo con confirmación explícita;
3. verificar headers y rutas en la URL activa;
4. agregar exclusivamente el correo de la psicóloga a la allowlist aprobada;
5. entregar credencial sintética individual, regla de datos y guion de prueba;
6. ejecutar observación UX sin grabar datos sensibles;
7. archivar lógicamente los fixtures por `test_run_id` al cerrar la sesión.

## Brújula

| Categoría | Avance | Estado |
| --- | ---: | --- |
| Agente QA y evidencia | 100% | completo |
| Frontend y flujo principal | 100% | regresión verde |
| Supabase staging, RLS y auditoría | 100% | verificado |
| Barreras de datos sintéticos | 90% | control técnico + instrucción humana |
| Seguridad de staging | 90% | limitación Pro documentada |
| Publicación privada vigente | 55% | Site existe, versión nueva pendiente |
| Preparación para prueba sintética | 92% | falta publicar/verificar acceso |
| Preparación para datos clínicos reales | 10% | bloqueada por Slice 03 |

Próximo norte: **publicar en privado el candidato corregido, verificarlo y recién entonces entregar acceso sintético a la psicóloga**.
