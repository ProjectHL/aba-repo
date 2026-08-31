# BDD — Slice 15 informes clínicos completos y PDF

Fecha/hora: 2026-08-29 14:18 CLT  
Entorno: Vitest/jsdom local, build staging local  
Fixtures: profesional/organización simulados por providers; cliente sintético `AB · SYN-001`, UUID
`11111111-1111-4111-8111-111111111111`. No se usaron datos reales ni recursos remotos.

## Resultado

19/19 pruebas del módulo Informes en verde. La evidencia automatizada valida comportamiento y
privacidad del modelo; no demuestra layout real, impresión física, archivo descargado ni acceso
autenticado de staging.

## Matriz Given–When–Then

| ID | Given | When | Then + privacidad | Evidencia | Estado/confianza |
| --- | --- | --- | --- | --- | --- |
| BDD-15-01 | cliente sintético con sesión, medición y ensayos | abre `/informes` | serie, 80%, gráfico y alternativa textual; sin JPG | `muestra el informe derivado…` | PASS alta |
| BDD-15-02 | rutas privadas representadas | navega entre tipos | destinos `/informes/evaluacion` y `/informes/completo` | `expone pantallas separadas…` | PASS alta |
| BDD-15-03 | preferencia v1 persistida simulada | abre RPT-02 | título y campos permitidos; no aparece JSON crudo | `compone evaluaciones persistidas…` | PASS alta |
| BDD-15-04 | evaluación, programa/meta, plan y progreso sintéticos | abre RPT-03 | ve las cuatro secciones; no hay interpretación nueva | `compone el informe completo…` | PASS alta |
| BDD-15-05 | payload versión 99 | abre RPT-03 | alerta compatible, JSON privado oculto, PDF deshabilitado | `bloquea el PDF completo…` | PASS alta |
| BDD-15-06 | RPT-03 compatible | solicita PDF dos veces rápidamente | una llamada; estado `Preparando PDF local…` | `evita descargas PDF duplicadas…` | PASS alta |
| BDD-15-07 | RPT-03 compatible y botón enfocado | presiona Enter | una llamada y confirmación de inicio local | `permite activar el PDF… con teclado` | PASS media: jsdom |
| BDD-15-08 | una lectura falla y luego responde | activa Reintentar | error normalizado, sin detalle privado, segunda lectura | `permite reintentar…` | PASS alta |
| BDD-15-09 | fecha inicial posterior a final | aplica período | alerta local y cero consulta adicional | `no consulta cuando el rango es inválido` | PASS alta |
| BDD-15-10 | serie de otro cliente | compone progreso | rechaza mezcla de cliente | `rechaza cualquier fila…` | PASS alta |
| BDD-15-11 | modelo completo con ID interno | compone texto PDF | incluye cuatro secciones y excluye `sourceId` | `incluye las cuatro secciones…` | PASS alta |
| BDD-15-12 | modelo con evaluación no soportada | compone PDF | lanza error antes del archivo | `rechaza una evaluación no compatible…` | PASS alta |
| BDD-15-13 | cliente sin sesiones en rango | abre informe | estado vacío, sin JPG | `no ofrece JPG cuando…` | PASS alta |

## Persistencia y privacidad

- Resultado persistido: ninguno; todos los escenarios son de lectura/composición local.
- No hubo fetch remoto autenticado, escritura, Storage, auditoría ni descarga física.
- El PDF usa iniciales e ID clínico sintético; no recibe DOB, familiares, notas, adjuntos, drafts,
  consentimiento, usuarios ni IDs internos.
- La generación permanece bajo acción del usuario y carga dinámica.

## Brechas explícitas

| ID | Brecha | Clasificación | Condición de cierre |
| --- | --- | --- | --- |
| GAP-15-01 | viewport real 320/768/1440 | QA pendiente, no bug | smoke de navegador local/autenticado |
| GAP-15-02 | impresión visual y saltos de página | QA pendiente, no bug | preview/captura de impresión sin datos reales |
| GAP-15-03 | PDF físico y contenido renderizado | QA pendiente, no bug | autorización de escritura dentro del workspace y verificación visual |
| GAP-15-04 | lecturas RLS autenticadas de las nuevas secciones | QA pendiente, no bug | smoke staging con fixture sintético autorizado |
| PERF-14-001 | principal 296.24 kB gzip | P2 heredado | spec de rendimiento separada |

P0/P1 abiertos: ninguno reproducible en automatización local.

## Retest

```powershell
.\node_modules\.bin\vitest.cmd run src\features\reports --reporter=verbose
.\node_modules\.bin\vitest.cmd run --reporter=dot
.\node_modules\.bin\tsc.cmd -b
.\node_modules\.bin\eslint.cmd .
node scripts\verify-staging-build.mjs verification\release-20260829-slice-15-reports
```

## Próximo conjunto exacto

BDD visual local/autenticado de `/informes`, `/informes/evaluacion` y `/informes/completo`: 320,
768 y 1440 px; teclado; rango; versión incompatible; preview de impresión; y, sólo con autorización
de escritura, PDF guardado dentro del workspace. No publicar ni usar datos reales.
