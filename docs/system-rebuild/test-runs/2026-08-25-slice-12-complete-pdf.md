# Verificación - Slice 12, PDF de Informe completo (2026-08-25)

## Alcance y límites

El usuario autorizó reemplazar el JPG por un PDF local del Informe completo. No se borró el código
histórico de JPG; dejó de exponerse. No hubo descarga real durante QA porque escribiría fuera del
workspace sin autorización específica. No hubo datos reales, Supabase, hosting ni cambios remotos.

## Resultado

| Control | Evidencia | Resultado |
| --- | --- | --- |
| TDD | `reports-page.test.tsx` | prueba roja de botón PDF/ausencia de JPG y verde posterior |
| Alcance de UI | `/informes/completo` | botón `Descargar PDF del informe completo` sólo en informe completo |
| Contenido PDF | `complete-report-pdf.ts` | resumen, métricas, series, porcentajes y canvas visibles; excluye DOB, tutores, notas y adjuntos |
| Descarga | `jspdf` local | nombre `informe-completo-sintetico.pdf`, sin subida ni persistencia remota |
| Regresión | Vitest | 95/95 aprobadas en 20 archivos |
| Calidad estática | TypeScript y ESLint | aprobados |
| Candidato | `verification/release-20260825-pdf-lazy` | preflight staging aprobado, 17 archivos |

## Rendimiento

La importación dinámica mantiene el JS inicial en 286.19 kB gzip, frente a 286.02 kB del candidato
con gráficos. Al solicitar PDF se cargan `jspdf` (129.62 kB gzip) y `html2canvas` (46.77 kB gzip).
El bundle inicial continúa como P2; evaluar el PDF bajo demanda antes de ampliar audiencia.
