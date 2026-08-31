# Mapa previo — Slice 12, gráficos de Informes (2026-08-25)

## Estado previo

La única continuación activa era Slice 11, preparación de release privado. El informe S-12 ya
derivaba series de conducta y porcentajes de adquisición desde staging sintético; su visualización
era una barra HTML/CSS por punto. Chart.js no era dependencia del proyecto.

## Evidencia y decisión

- Verificado en `apps/web/src/features/reports/reports-page.tsx`: gráfico de barras CSS y lista
  textual accesible.
- Verificado en `apps/web/package.json`: no existían `chart.js` ni una integración React.
- Solicitud explícita del responsable: agregar gráficos usando Chart.js o una librería equivalente.

## Decisiones abiertas preservadas

No se autoriza despliegue, cambios remotos, datos reales, adjuntos ni cambios de contrato clínico.
El impacto de bundle debe medirse antes de volver a declarar candidato de release.
