# QA/release local — Slice 15

Fecha: 2026-08-29  
Resultado: **candidato local listo; no publicado**

## Alcance verificado

- RPT-02 compone evaluaciones v1 persistidas simuladas y bloquea versiones desconocidas.
- RPT-03 reúne evaluación, adquisición, reducción y progreso.
- PDF usa el modelo minimizado común, excluye IDs internos y bloquea contenido incompatible.
- Doble activación produce una sola llamada; teclado anuncia el inicio local.
- No hubo escrituras remotas, descargas físicas, datos reales ni publicación.

## Gates finales

| Comando | Resultado |
| --- | --- |
| `.\node_modules\.bin\vitest.cmd run --reporter=dot` | PASS — 31 archivos, 137/137 |
| `.\node_modules\.bin\tsc.cmd -b` | PASS |
| `.\node_modules\.bin\eslint.cmd .` | PASS |
| Vite staging a carpeta nueva con `--emptyOutDir false` | PASS |
| `node scripts\verify-staging-build.mjs verification\release-20260829-slice-15-reports` | PASS — 17 archivos |
| scan sensible del candidato | PASS — sin coincidencias relevantes |

## Candidato y rendimiento

Ruta: `apps/web/verification/release-20260829-slice-15-reports/`.

| Recurso | Minificado | Gzip |
| --- | ---: | ---: |
| principal | 991.64 kB | 296.24 kB |
| jsPDF diferido | 399.17 kB | 129.62 kB |
| html2canvas diferido | 199.49 kB | 46.77 kB |

El principal creció 10.05 kB gzip (~3.5%) frente al candidato PDF de Slice 12. Se conserva
`PERF-14-001` como P2; no se amplió la spec a rendimiento.

## Bugs y decisiones abiertas

- P0/P1 reproducibles: ninguno.
- P2: `PERF-14-001` heredado.
- GAP-15-01 a GAP-15-04: viewport real, impresión, archivo PDF físico y lecturas RLS autenticadas.
- Hosting, URL, Redirect URLs, recursos remotos y despliegue: no autorizados.

## Próxima autorización requerida

Autorizar un smoke autenticado exclusivamente con fixtures sintéticos para las tres rutas de
Informes. Autorizar por separado, si se desea, que el PDF se escriba dentro del workspace para
inspección visual. Ninguna de esas autorizaciones implica publicación.
