# Auditoría de specs y preparación de release — 2026-08-25

## Alcance revisado

Se revisaron las specs raíz, Slices 02–10, índices, handoffs, evidencia E2E y el checklist de QA.
Los Slices 02–09 se conservan como historial; Slice 10 aporta la evidencia vigente de cierre.

| Grupo | Estado documental | Hallazgo actual |
| --- | --- | --- |
| Raíz y Slices 02–07 | histórico / contratos base | mantienen decisiones de staging y cumplimiento; no autorizan datos reales ni producción |
| Slice 08 | cartografía | 13/13 destinos visibles representados |
| Slice 09 | persistencia por lote | flujo clínico vertical y reporte derivado disponibles |
| Slice 10A–10D | verificado | E2E de guardado, JPG minimizado, QA móvil/teclado/impresión y recuperación documentados |
| Cumplimiento Slice 03 | abierto por diseño | datos reales, adjuntos, retención y dictámenes jurídicos siguen bloqueados |

## QA ejecutado

- Vitest: 94/94 pruebas aprobadas en 20 archivos.
- TypeScript: aprobado.
- ESLint: aprobado.
- Candidato staging: `apps/web/verification/release-20260825/`.
- Preflight: 13 archivos inspeccionados; noindex, no-store, CSP, HSTS, fallback SPA y ausencia de
  patrones de secretos aprobados.

## Hallazgos

| Severidad | Hallazgo | Decisión |
| --- | --- | --- |
| P2 | Bundle principal de 771.88 kB (225.24 kB gzip) supera el umbral de aviso de Vite | no bloquea una publicación privada sintética; evaluar code splitting antes de ampliar audiencia |
| Bloqueo de producto | publicación, hosting, dominio y Redirect URLs no tienen autorización de ejecución | crear preparación de release, sin desplegar |
| Bloqueo de cumplimiento | datos reales, adjuntos, retención, correcciones clínicas y documento descargable siguen sin contrato | fuera del MVP sintético; no implementar |

No se encontró P0/P1 abierto para el alcance actual de MVP sintético. Esta auditoría no declara
cumplimiento jurídico ni habilita producción o datos clínicos reales.
