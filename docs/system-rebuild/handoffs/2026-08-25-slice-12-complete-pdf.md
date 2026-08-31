# Handoff - Slice 12, exportación PDF completa (2026-08-25)

Se reemplazó el JPG expuesto por descarga PDF local en `/informes/completo`. El PDF reúne el
contenido derivado visible del informe, incluidos gráficos de conducta y adquisición, y excluye
campos sensibles no autorizados. El generador JPG previo se conserva como histórico no expuesto.

| Estado | Resultado |
| --- | --- |
| Exportación | PDF local bajo demanda con `jspdf` |
| Calidad | 95/95, typecheck y lint aprobados |
| Candidato | `apps/web/verification/release-20260825-pdf-lazy/`, preflight aprobado |
| Rendimiento | principal 286.19 kB gzip; PDF 176.39 kB gzip bajo demanda |
| Publicación | no autorizada; no se modificó ningún recurso remoto |

## Brújula

| Área | Verificado | Pendiente |
| --- | --- | --- |
| Informes sintéticos | gráficos y PDF completo local | autorización de descarga E2E si se requiere evidencia de archivo |
| Rendimiento | carga inicial preservada mediante import dinámico | evaluación P2 antes de ampliar audiencia |
| Release privado | preflight actualizado | proveedor, URL, Redirect URLs y autorización explícita |
