# Brújula vigente - MVP y auditoría independiente (2026-08-25)

## Posición actual

| Área | Verificado | Pendiente / gate |
| --- | --- | --- |
| Frontend sintético | 13/13 vistas, flujos clínicos, gráficos y PDF local minimizado | QA móvil/teclado/impresión posterior a Slice 12 |
| Datos y seguridad | Auth, rutas, RLS y flujos con staging sintético | datos reales, adjuntos, retención y correcciones: Slice 03 |
| QA | 95/95, typecheck, lint, preflight y E2E vertical previo | descarga PDF sintética y reaplicación visual a gráficos/PDF |
| Rendimiento | importación dinámica evita crecer la carga inicial por PDF | P2: 286.19 kB gzip inicial; 176.39 kB bajo demanda |
| Release privado | candidato local `release-20260825-pdf-lazy` | proveedor, URL, audiencia, Redirect URLs y autorización de despliegue |

## Próximo paso recomendado

Ejecutar el QA 12A: viewport móvil, teclado, impresión y descarga física de un PDF sintético con
autorización explícita. Si queda verde, decidir aceptación/resolución del P2 de rendimiento y
completar el checklist de Slice 11 sin desplegar.

## Límites

No publicar, cambiar recursos remotos, descargar archivos ni usar datos reales sin autorización
específica. El informe PDF actual es sintético y minimizado, no un documento clínico habilitado.
