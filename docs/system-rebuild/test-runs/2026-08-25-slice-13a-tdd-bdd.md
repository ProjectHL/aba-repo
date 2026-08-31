# Evidencia TDD/BDD — Slice 13A (2026-08-25)

## Alcance y límites

Dimensiones de medición de sesión, payload RPC, snapshot histórico y lectura para informes. Sólo
fixtures sintéticos. No se desplegó Sites, no se usaron pacientes y no se crearon filas de prueba
persistentes. El E2E autenticado queda para el QA final solicitado por el propietario.

## SDD

- Aprobación registrada en `docs/system-rebuild/decisions/2026-08-25-slice-13-approval.md`.
- Política legacy: `measurement_unit = null`, sin backfill ni inferencia.
- Duración/latencia: segundos, máximo dos decimales.
- Intervalo: observados/total, `observados <= total`; porcentaje derivado, con 0/0 = 0.

## TDD rojo → verde

| Gate | Rojo observado | Verde |
| --- | --- | --- |
| UI/contrato | 3 fallos: falta unidad, controles decimales e intervalo | 10/10 ficha cliente |
| Adaptador RPC | no enviaba dimensión | prueba dedicada verde |
| Reporte | sólo conservaba `value` | conserva unidad, intervalos y legacy null |
| Regresión | — | 21 archivos, 99/99 pruebas |

Verificaciones finales: `tsc -b` verde, `eslint .` verde y build staging aislado verde en
`verification/release-20260825-slice13a-v2`.

## BDD 13A

| Escenario | Given | When | Then | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- |
| 13A-001 | plan frequency sintético | aumenta a 1 y guarda | etiqueta ocurrencias y draft entero con snapshot | prueba de componente + adaptador | contrato verde |
| 13A-002 | plan duration sintético | ingresa 12.50 | draft conserva 12.5 segundos y reporte conserva unidad | componente + analytics | contrato verde |
| 13A-003 | plan latency sintético | ingresa 2.25 | no redondea a entero y envía segundos | componente + adaptador | contrato verde |
| 13A-004 | plan interval sintético | ingresa 3/4 o 5/4 | deriva 75%; bloquea 5/4 antes de RPC | componente + SQL 004 | contrato verde |
| 13A-005 | fila legacy | lector recibe snapshot null | no fabrica unidad actual | analytics | verde |

Estos escenarios no se marcan como E2E autenticado: requieren iniciar sesión contra staging y crear
una corrida sintética identificable, acción reservada al loop QA final.

## Supabase staging

- Proyecto confirmado: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`).
- Migración: `slice_13a_session_measurement_dimensions`.
- SQL 004: `pass`.
- Función: `SECURITY INVOKER`; grants sólo para `authenticated`; RLS existente permanece.
- Types generados coinciden con las tres columnas nuevas.
- Advisor seguridad: una advertencia preexistente por protección de contraseñas filtradas
  desactivada; no fue causada por 13A.
- Advisor rendimiento: índices aún sin uso en el staging pequeño; no se eliminaron.

## Hallazgos

- P1 del alcance 13A: ninguno abierto a nivel de contrato.
- Gate pendiente: persistencia autenticada y verificación visual de navegador en QA final.
- P2 preexistente: chunk principal de 948.39 kB (286.83 kB gzip).
- Seguridad preexistente: habilitar protección contra contraseñas comprometidas antes de usar datos
  clínicos reales.
