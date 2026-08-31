# Retest QA previo al acceso de la psicóloga

Fecha: 2026-08-18  
Alcance: frontend, build/Worker de Sites y Supabase staging.  
Datos: exclusivamente sintéticos.  
Decisión: **GO condicionado para prueba sintética; NO-GO para datos reales, históricos o seudonimizados**.

## Resultado de regresión

| Control | Resultado |
| --- | --- |
| Vitest | 12 archivos, 41/41 pruebas aprobadas |
| TypeScript | aprobado |
| ESLint | aprobado |
| Build Vite no destructivo | aprobado en `apps/web/verification/qa-pre-psychologist-20260818-v2` |
| Preflight del bundle | aprobado, 13 archivos inspeccionados |
| Worker Sites | fallback SPA, 404 de assets y `Cache-Control: no-store` aprobados |
| Smoke HTTP local | raíz y ruta directa de detalle respondieron 200; `noindex` presente |
| Integridad Supabase staging | aprobada; 6 tablas públicas con RLS, cero políticas DELETE y cero relaciones huérfanas |
| Permisos negativos | viewer no crea; organización B no observa cliente de A |
| Auditoría | creación, actualización y archivado sintéticos registrados sin payload clínico |

El build informa un chunk JavaScript cercano a 690 kB. Es una mejora de rendimiento pendiente, no un bloqueo funcional ni de seguridad para esta prueba acotada.

## Resolución de hallazgos

| ID | Estado de retest | Evidencia |
| --- | --- | --- |
| QA-001 | mitigado para staging sintético | banner reforzado, confirmación obligatoria y bloqueo de patrones evidentes de RUT/correo; la detección de nombres sigue siendo preventiva y humana |
| QA-002 | resuelto | tutores y hermanos se pueden retirar; prueba de componente aprobada |
| QA-003 | resuelto | un `UNAUTHORIZED` publica invalidación y AuthProvider cierra sesión; prueba integrada aprobada |
| QA-004 | resuelto | filas activas enlazan al detalle; prueba de navegación aprobada |
| QA-005 | resuelto | total y activos se calculan por separado; prueba 2 activos/3 totales aprobada |
| QA-006 | resuelto | parser calendario estricto y zona Chile compartidos por validación y edad |
| QA-007 | resuelto | detalle ofrece reintento; suite dedicada aprobada |
| QA-008 | resuelto | conflicto remoto marca y describe accesiblemente `clinicalId` |
| QA-009 | resuelto | altas UI reciben UUID de corrida QA |
| QA-010 | resuelto parcialmente | harness SQL de integridad versionado y ejecutado; queda recomendable añadir unitarias directas del adaptador |
| QA-011 | resuelto localmente | `_headers`, Worker y verificadores exigen `Cache-Control: no-store`; falta comprobar la URL publicada |
| QA-012 | pendiente de publicación | candidato v2 local aprobado; Sites v1 sigue obsoleto y no debe desplegarse |

## Supabase organizado

- Proyecto utilizado: staging exclusivamente.
- Migraciones 001–004 aplicadas y trazables.
- La migración 004 añade auditoría de actualizaciones y archivado mediante función privada, `SECURITY DEFINER`, `search_path` vacío y ejecución revocada a roles públicos.
- El fixture de esta corrida quedó archivado, nunca eliminado.
- `supabase/tests/001_staging_integrity.sql` valida tablas, RLS, ausencia de DELETE, relaciones, etiquetas `test_run_id` y auditoría de creación.
- Advisor de seguridad conserva una advertencia: protección de contraseñas filtradas requiere plan Pro. No se oculta ni se marca como resuelta.
- Advisor de rendimiento conserva sólo el índice de auditoría aún sin uso; se mantiene por la regla de no borrado.

## Riesgos residuales y gate

1. No publicar Sites v1: no incluye esta ronda correctiva.
2. Antes de entregar acceso, guardar/publicar en privado el candidato vigente y repetir smoke de headers, login, alta sintética, detalle y logout.
3. La psicóloga debe recibir por escrito la regla: no usar pacientes actuales, antiguos, seudonimizados ni casos reconocibles.
4. La barrera de entrada reduce errores, pero no puede reconocer todos los nombres reales.
5. Los gates C-01 a C-10 de Slice 03 siguen rojos; cualquier dato clínico real continúa prohibido.

La recomendación es **GO sólo después de publicar y verificar una versión privada nueva, y únicamente para datos sintéticos**.
