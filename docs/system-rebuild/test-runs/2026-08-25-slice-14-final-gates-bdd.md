# Slice 14 — gates finales y validación BDD local

Fecha: 2026-08-25  
Entorno: frontend local Vite staging  
Datos: exclusivamente fixtures sintéticos  
Supabase: sin mutaciones durante esta ejecución  
Publicación: no realizada

## Resultado ejecutivo

- Vitest completo: **130/130 PASS** en 30 archivos.
- TypeScript: **PASS** con `tsc --noEmit`.
- ESLint: **PASS** sin errores ni advertencias.
- Build staging aislado final: **PASS**.
- BDD automatizado seleccionado: **45/45 PASS**.
- Navegador público: **PASS** en 320×800 y 1440×900.
- Consola del navegador: **0 errores / 0 advertencias**.
- P0 abiertos: 0.
- P1 abiertos: 0.
- P2 corregidos: 1.
- P2 abiertos: 1 advertencia de rendimiento y 1 brecha de evidencia visual autenticada.

## Ciclo TDD aplicado

### UXP-14-001 — ortografía de rótulos clínicos

Severidad: P2  
Estado: corregido

Problema: algunos rótulos visibles y nombres accesibles usaban `Escolarizacion`, `Anadir`,
`diagnostico`, `evaluacion` y `Termino` sin tildes.

Rojo:

```text
vitest run src/features/clinical/forms/clinical-draft-dialogs.test.tsx
1 PASS / 3 FAIL
```

Verde:

```text
vitest run src/features/clinical/forms/clinical-draft-dialogs.test.tsx
4/4 PASS
```

Corrección: rótulos y nombres accesibles normalizados a `Escolarización`, `Añadir`,
`diagnóstico`, `evaluación` y `Término`.

## Gates técnicos

Comandos ejecutados desde `apps/web`:

```text
.\node_modules\.bin\vitest.cmd run
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\eslint.cmd .
```

Resultado final:

```text
Test Files 30 passed (30)
Tests      130 passed (130)
TypeScript PASS
ESLint     PASS
```

## Build no destructivo

Candidato final:

`apps/web/verification/release-20260825-slice14-forms-02`

El directorio no existía antes del build. No se reutilizó ni vació ningún candidato anterior.

Resultado: PASS, 2296 módulos transformados. Existe una advertencia P2 porque el chunk principal
minificado mide aproximadamente 978.81 kB; no bloquea el cierre funcional de formularios.

## Matriz BDD

| ID | Given | When | Then | Evidencia | Resultado |
| --- | --- | --- | --- | --- | --- |
| BDD-14-01 | identidad sintética y rutas públicas/privadas | registro, login o acceso pendiente | la ruta protege el expediente y conserva el destino | `routing.test.tsx` | PASS |
| BDD-14-02 | usuario y repositorio sintéticos | crea cliente | se crea una sola vez y navega al detalle | `new-client-page.test.tsx` | PASS |
| BDD-14-03 | cliente sintético autenticado | prepara contexto e historia | vive sólo en memoria, sin red/Web Storage; fechas y filas se validan | `clinical-draft-dialogs.test.tsx` | PASS |
| BDD-14-04 | cliente sintético | guarda entrevista, preferencias o funcional | payload tipado; fecha separada; adjunto excluido; errores conservan valores | `client-detail-page.test.tsx`, `assessment-forms-dialog.test.tsx` | PASS |
| BDD-14-05 | programa/plan sintético | crea meta, plan y sesión por cuatro dimensiones | contratos y operación atómica reciben los valores correctos | `client-detail-page.test.tsx` | PASS |
| BDD-14-06 | expediente con indicadores sintéticos | abre informes/PDF | vistas separadas y generador PDF local disponibles; no se descargó archivo | `reports-page.test.tsx` | PASS |
| BDD-14-07 | ficha sintética | revisa consentimiento y usuarios | aparecen bloqueados, sin acciones falsas | `client-detail-page.test.tsx` | PASS |
| BDD-14-08 | puerta pública local | cambia a 320×800 y 1440×900 | sin desbordamiento horizontal; aviso sintético visible; consola limpia | navegador local `/login` | PASS |
| BDD-14-09 | sesión real de staging | recorre visualmente las rutas privadas | requiere login manual o una sesión sintética ya autenticada | `/login` | NOT RUN |

Fixture IDs automatizados principales:

- usuario: `synthetic-user`;
- cliente: `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa`;
- ID clínico: `SYN-DETAIL-001`;
- programa: `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb`;
- meta: `cccccccc-cccc-4ccc-8ccc-cccccccccccc`;
- plan: `dddddddd-dddd-4ddd-8ddd-dddddddddddd`.

Privacidad: los escenarios no contienen nombres reales, RUT, correos personales ni datos de
pacientes. Los validadores rechazan RUT/correos en texto clínico libre.

## Brechas y riesgos abiertos

### GAP-14-AUTH-VISUAL — evidencia visual privada

Clasificación: P2, brecha de evidencia; no es un defecto confirmado.  
La puerta pública fue validada en navegador, pero las rutas privadas no se inspeccionaron porque
la pestaña local está anónima y no se inventaron, leyeron ni transmitieron credenciales. La lógica
privada sí está cubierta por pruebas automatizadas.

Próximo paso: la persona usuaria inicia sesión manualmente con una cuenta sintética autorizada y
confirma que la pestaña está lista. Luego se ejecuta el smoke visual privado sin crear ni guardar
datos remotos.

### PERF-14-001 — chunk principal grande

Clasificación: P2, no bloqueante.  
El build reporta un chunk principal cercano a 979 kB. Reservar code splitting de reportes/PDF para
una spec de rendimiento; no mezclarlo con el cierre funcional de formularios.

## Veredicto

Slice 14 cumple los gates técnicos y el BDD automatizado con 0 P0/P1. El cierre funcional puede
considerarse candidato, pero la evidencia visual de rutas privadas permanece pendiente hasta que
exista una sesión sintética autenticada en el navegador local.

