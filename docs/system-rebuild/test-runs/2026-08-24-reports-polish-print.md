# Test run — pulido e impresión de informes

Fecha: 2026-08-24  
Datos: exclusivamente sintéticos

## Alcance

- Alternativa textual accesible para valores de cada gráfico.
- Resumen identificado para impresión, sin navegación, banner de entorno ni botón de imprimir.
- Prevención de cortes de tarjetas en impresión y restricciones responsive locales.
- Conservación de cabeceras públicas de no-caché y no-indexación.

## Resultados

| Gate | Resultado |
| --- | --- |
| Pruebas específicas de informes | PASS — 7/7 |
| Regresión frontend completa | PASS — 80/80 |
| TypeScript | PASS |
| ESLint | PASS |
| `Cache-Control: no-store` / `X-Robots-Tag` | Preservados en `public/_headers` |

No se ejecutó `vite build`: el proceso reemplaza `dist`, contrario a la regla de no borrado.

## Pendiente de QA final

La validación visual manual en navegador de impresión y ancho 320 px permanece para el QA
autenticado previo a la publicación agrupada. Debe realizarse sólo con un expediente sintético.
