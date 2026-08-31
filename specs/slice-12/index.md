# Slice 12 — Gráficos de Informes

## Estado

**Aprobada para implementación local con datos sintéticos.** Sustituye la visualización CSS mínima
de S-12 por Chart.js mediante una integración React, sin alterar cómo se derivan los datos.

## Alcance

1. línea por plan de conducta: fecha en eje X y valor registrado en eje Y;
2. barras horizontales de porcentaje acumulado por meta de adquisición;
3. alternativa textual accesible y conservación del JPG local minimizado;
4. medir el bundle tras integrar la dependencia.
5. exportación local a PDF del Informe completo.

## Aceptación

- cada serie con mediciones muestra un gráfico de línea responsive y su lista textual;
- las metas con ensayos muestran su porcentaje tanto en gráfico como en texto;
- tooltip/leyenda no muestran fecha de nacimiento, notas ni datos ajenos al informe;
- pruebas, typecheck y lint aprobados;
- no se modifica Supabase, backend, hosting ni configuración remota.
- el Informe completo ofrece un PDF con los indicadores, valores y gráficos visibles, sin fecha de
  nacimiento, tutores, notas ni adjuntos;
- la interfaz ya no ofrece JPG por serie. El generador histórico se conserva sin exponerlo, de
  acuerdo con la regla de no eliminación.

## Primera prueba roja

`reports-page.test.tsx` exigirá los contenedores de línea y de progreso por metas identificados y
la alternativa textual existente. La siguiente prueba roja exigirá el botón PDF del Informe completo
y la ausencia del control JPG. La implementación mínima hará pasar esas pruebas con Chart.js y
jsPDF.

## Stop condition

Detener antes de desplegar, cambiar Redirect URLs, tocar recursos remotos o incluir datos reales.
