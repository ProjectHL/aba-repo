# Handoff — Slice 12, gráficos de Informes (2026-08-25)

Chart.js y `react-chartjs-2` se incorporaron localmente en `apps/web`. Informes ahora presenta una
línea por plan de conducta y barras horizontales de porcentaje por meta, sin cambiar contratos ni
acceder a campos nuevos. Se preservan listas accesibles y la exportación JPG minimizada.

| Estado | Resultado |
| --- | --- |
| Funcionalidad | verificada en navegador con datos sintéticos |
| Calidad | 94/94, typecheck y lint aprobados |
| Candidato | `apps/web/verification/release-20260825-charts/`, preflight aprobado |
| Riesgo P2 | 286.02 kB gzip (+60.78 kB por sobre el candidato anterior) |
| Publicación | no autorizada; sin hosting ni cambios remotos |

## Brújula

| Área | Verificado | Pendiente |
| --- | --- | --- |
| Frontend sintético | S-12 con gráficos Chart.js | evaluación de code splitting / aceptación P2 |
| Datos | derivación existente y RLS sin cambios | datos reales siguen bloqueados por Slice 03 |
| Release privado | preflight local actualizado | proveedor, URL, Redirect URLs y autorización explícita |
