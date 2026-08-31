# Test run — Slice 15 informes completos y PDF (TDD)

Fecha: 2026-08-29  
Alcance: implementación local con fixtures sintéticos; sin escrituras remotas, descargas reales,
Supabase, publicación ni despliegue.

## Contrato aprobado

- Decisión: `docs/system-rebuild/decisions/2026-08-29-slice-15-approved.md`.
- Spec: `specs/slice-15-complete-clinical-reports-pdf/`.
- D15-01 a D15-06 aprobadas por el usuario mediante “documentar y continuar”.

## Evidencia rojo → verde

| Ciclo | Rojo observado | Verde |
| --- | --- | --- |
| RPT-02 evaluación | 1/8 falló: no aparecía `Preferencias sintéticas` | 8/8; payload v1 visible sin JSON crudo |
| RPT-03 completo | 2/10 fallaron: secciones ausentes y PDF habilitado ante versión incompatible | 10/10; evaluación, adquisición, reducción y progreso compuestos; PDF bloqueado |
| PDF unificado | 2/2 fallaron: compositor inexistente | 12/12 focalizadas; cuatro secciones y ningún ID interno |
| exportación atómica | doble click llamó dos veces al generador | 13/13 focalizadas; una llamada y estado accesible de preparación |

## Ajustes de regresión

La primera regresión detectó que una prueba de la ruta RPT-01 no configuraba el repositorio de
evaluaciones. Se hizo opcional sólo para Progreso; Evaluación/Completo siguen exigiéndolo. TypeScript
también exigió estrechar explícitamente el estado no archivado antes de construir el modelo. Tras
ambos ajustes, el conjunto focalizado ampliado quedó 29/29 verde.

## Gates finales

| Gate | Resultado |
| --- | --- |
| Vitest completo | PASS — 31 archivos, 137/137 pruebas tras añadir BDD de teclado |
| TypeScript | PASS — `tsc -b` |
| ESLint | PASS — proyecto completo |
| Build staging | PASS — `verification/release-20260829-slice-15-reports/` |
| Preflight | PASS — 17 archivos inspeccionados |
| Scan sensible | PASS — sin service role, JWT, correos ni RUT fuera del SVG base excluido |

## Bundle y riesgos

- principal: 991.64 kB / 296.24 kB gzip;
- jsPDF diferido: 399.17 kB / 129.62 kB gzip;
- html2canvas diferido: 199.49 kB / 46.77 kB gzip;
- crecimiento principal frente al candidato Slice 12 PDF: +10.05 kB gzip (~3.5%);
- P2 `PERF-14-001` continúa abierto y fuera de este alcance funcional;
- P0/P1 reproducibles en gates locales: ninguno.

## Archivos funcionales principales

- `apps/web/src/features/reports/report-sections.ts`;
- `apps/web/src/features/reports/reports-page.tsx`;
- `apps/web/src/features/reports/complete-report-pdf.ts`;
- pruebas de página y PDF;
- hook opcional del repositorio de evaluaciones para preservar independencia de RPT-01.

## Próximo escenario BDD exacto

Con fixtures sintéticos locales: abrir RPT-02 y RPT-03, verificar contenido por sección, aplicar un
rango, comprobar estado no compatible, activar PDF por teclado sin escribir archivo y validar
320 px/impresión. Un BDD local no demuestra flujo autenticado de staging.
