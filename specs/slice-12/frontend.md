# Slice 12 / Frontend

Se añade `chart.js` y `react-chartjs-2` al frontend local. Se usan componentes React de Chart.js:

- `Line` para cada serie de conducta, con puntos y eje temporal basado en las fechas ya derivadas;
- `Bar` horizontal para el porcentaje acumulado de las metas que tienen ensayos.

Los datos siguen siendo exclusivamente `ClinicalReport`: plan/meta, fecha ya visible y valor o
porcentaje derivado. Las listas de valores y porcentajes permanecen como alternativa accesible y
para impresión. La ruta `/informes/completo` incorpora un botón de descarga PDF local mediante
`jspdf`: resumen, métricas, series, porcentajes y capturas de los canvas visibles. Excluye fecha de
nacimiento, tutores, notas y adjuntos. El control JPG deja de exponerse; su código y pruebas
históricos se preservan sin borrarlos.

No se agregan consultas, filtros clínicos ni campos nuevos. El resultado del build registrará el
impacto de bundle; cualquier degradación que cambie la decisión de release se documentará como P2.

Verificación 2026-08-25: el gráfico de línea y el de progreso se observaron en `/informes` con el
expediente sintético `ZX · E2E-SYNTH-ALPHA`. El bundle principal pasó de 225.24 kB a 286.02 kB gzip
(+60.78 kB); continúa siendo P2 y se debe resolver o aceptar explícitamente antes de ampliar
audiencia.

La exportación PDF se carga dinámicamente al pulsar su botón: el bundle inicial queda en 286.19 kB
gzip y los recursos bajo demanda de PDF son 176.39 kB gzip. El botón sólo aparece en
`/informes/completo`; reemplaza al JPG por serie en la interfaz.
