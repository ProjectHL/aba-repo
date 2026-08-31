# Slice 14 / Matriz BDD de formularios clínicos

Fixtures: usuario sintético autorizado, organización staging, cliente A y cliente B. E2E remoto sólo
en QA final; durante TDD se usan repositorios simulados.

| ID | Ruta | Fixture | Given | When | Then | Evidencia esperada | Confianza | Privacidad | Severidad |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BDD-CF-01 | `/clientes/nuevo` | SYN-CF-A | alta base válida | crea cliente A | navega a ficha A | componente + E2E final | observed fields/inferred edge | sin nombre/RUT/correo | P1 |
| BDD-CF-02 | `/clientes/A` | SYN-CF-A | ficha A | prepara contexto/historia temporal | cambia pestaña y vuelve | provider/component | proposed | conserva memoria, muestra no guardado | P1 |
| BDD-CF-03 | `/clientes/A` | SYN-CF-A | draft temporal | recarga/remonta app | vuelve vacío | remount + spies storage/red | proposed | no usa storage ni red | P0 |
| BDD-CF-04 | `/clientes/A` | SYN-CF-A | historia A con tres filas | elimina fila B | A/C no cambian | componente | observed repeatable pattern | IDs UI no salen | P1 |
| BDD-CF-05 | `/clientes/A` tab `assessment` | SYN-CF-A | entrevista A | añade/quita informantes | payload v1 ordenado | prueba 13B.1 | observed matrix | rechaza identificadores | P1 |
| BDD-CF-06 | `/clientes/A` tab `assessment` | SYN-CF-A | preferencias A con archivo | guarda assessment | payload/DB excluyen archivo | mapper + E2E final | observed fields/proposed persistence | cero upload | P0 |
| BDD-CF-07 | `/clientes/A` tab `assessment` | SYN-CF-A | funcional A | falla escritura | conserva valores y permite reintento | componente | proposed state | error no filtra detalle | P1 |
| BDD-CF-08 | `/clientes/A` tab `acquisition` | SYN-CF-A | programa existente | crea meta | mantiene relación y suplementos | mapper + componente | observed | sólo cliente A | P1 |
| BDD-CF-09 | `/clientes/A` tab `reduction` | SYN-CF-A | plan A | configura unidad/estrategias | resumen coincide con draft remoto | mapper + componente | observed | sin datos B | P1 |
| BDD-CF-10 | `/clientes/A` tab `sessions` | SYN-CF-A | planes/metas A | registra 4 dimensiones | RPC recibe contrato discriminado | regresión 13A | observed/proposed dimensions | atomicidad | P1 |
| BDD-CF-11 | `/clientes/A` tab `information` | SYN-CF-A | consentimiento/acceso | abre tarjetas | no existe acción guardar | componente | observed screen/proposed blocked | contrato pendiente | P0 |
| BDD-CF-12 | `/clientes/A` | SYN-CF-A/B | ficha A | usa Continuar | conserva A hasta `/informes?client=A` | router/component | inferred | no mezcla B | P0 |
| BDD-CF-13 | `/clientes/A` | SYN-CF-A | viewport 320 + teclado | recorre formularios | sin bloqueo/foco perdido | navegador QA final | proposed | alertas accesibles | P1 |
| BDD-CF-14 | `/clientes/A`→`/clientes/B` | SYN-CF-A/B | draft temporal sólo en A | navega a B y vuelve a A | B vacío; A conserva su draft | provider/component | proposed | aislamiento por clientId | P0 |

## Cierre BDD

Cada escenario registra prueba, ruta, fixture, timestamp, confianza y si prueba contrato o E2E. Un
PASS de componente no se etiqueta como persistencia autenticada. Cualquier mezcla A/B es P0 y
bloquea el handoff.
