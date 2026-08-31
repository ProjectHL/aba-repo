# Brújula — Slice 15 E2E autenticado

Fecha: 2026-08-30

## Estado ejecutivo

Slice 15 superó el smoke autenticado sintético hasta las tres rutas de Informes. El flujo creó un
adulto ficticio, completó las dependencias clínicas, guardó una sesión atómica y mostró métricas
derivadas consistentes después de recargar. El PDF físico continúa pendiente de autorización y QA
visual; no hubo cambios adicionales de Supabase.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Autenticación y recovery | inicio de sesión disponible tras recovery | verde |
| Cliente sintético | adulto ficticio persistido | verde |
| Evaluaciones | entrevista, preferencias y funcional | verde |
| Adquisición | programa y meta asociados | verde |
| Reducción | plan con frecuencia controlada | verde |
| Sesión atómica | 3 ocurrencias, 8/2 ensayos, confirmación UI | verde |
| RPT-01 Progreso | 1 sesión, serie 3, progreso 80.0% | verde autenticado |
| RPT-02 Evaluación | tres evaluaciones persistidas | verde autenticado |
| RPT-03 Completo | secciones y métricas consistentes | verde autenticado |
| Persistencia/RLS | datos conservados tras recarga bajo sesión | verde UI |
| PDF físico | no escrito ni descargado | pendiente |

## Evidencia enlazada

- `docs/system-rebuild/test-runs/2026-08-30-slice-15-authenticated-e2e.md` — flujo, métricas y
  persistencia.
- `docs/system-rebuild/test-runs/2026-08-30-password-recovery-published-smoke.md` — recovery del
  responsable.
- `docs/system-rebuild/test-runs/2026-08-29-slice-15-local-release-loop.md` — gates automatizados
  del candidato publicado.
- `specs/slice-15-complete-clinical-reports-pdf/` — contrato aprobado.

## P0/P1/P2

- P0/P1 del flujo autenticado hasta Informes: ninguno reproducido.
- P1 de recovery a localhost: cerrado por evidencia previa.
- P2 abierto: `PERF-14-001`.
- P2 abierto: Google OAuth sin evidencia operativa.
- GAP-15 PDF físico/QA visual: pendiente, no clasificado como fallo.

## Límites vigentes

- Los registros ficticios permanecen en staging y no se eliminan ni archivan.
- Sólo datos sintéticos; no introducir personas reales, menores, correos, RUT o información
  clínica identificatoria.
- No modificar schema, RLS, RPC, Storage, Auth, permisos ni audiencia sin spec y autorización.
- No descargar un PDF al sistema ni escribirlo fuera del workspace.

## Siguiente norte

**Único objetivo siguiente:** generar un PDF del informe completo para `QZ · E2E-SYNTH-BETA-AUG`,
guardarlo exclusivamente dentro del workspace y verificar contenido, privacidad y render.

**Autorización requerida:** permiso explícito para pulsar `Descargar PDF del informe completo`,
capturar la descarga dentro del workspace y ejecutar la verificación PDF. Esta autorización no
incluye envío, publicación, datos reales ni cambios de Supabase.

**No objetivos:** no crear otro cliente, no repetir escrituras clínicas, no habilitar Google OAuth,
no ampliar audiencia y no modificar recursos remotos.

## Skills y agentes

1. Cargar `pdf:pdf` antes de crear o verificar el archivo físico.
2. Reutilizar `browser:control-in-app-browser` para la descarga visible autorizada.
3. Cargar `brujula` al cerrar el gate PDF.
4. `supabase:supabase` sólo ante un diagnóstico remoto nuevo.
5. Agente primario activo; no hay subagentes y no hubo delegación.

