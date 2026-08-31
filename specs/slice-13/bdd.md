# Slice 13 / Matriz BDD propuesta

Estado: 13A verificada a nivel de componente, adaptador y contrato SQL. E2E autenticado reservado
para el loop QA final; 13B–13D pendientes.

Fixtures base: cliente A `SYN-13-A`, cliente B `SYN-13-B`, organización sintética staging y usuario
clínico autorizado. Los UUID reales se generan por corrida y se registran en evidencia.

| ID | Given | When | Then | Ruta | Confianza | Severidad si falla |
| --- | --- | --- | --- | --- | --- | --- |
| BDD-13A-001 | plan frequency del cliente A | incrementa y guarda sesión | persiste entero y etiqueta ocurrencias | `/clientes/:id` Sesiones | contrato verde; E2E pendiente | P1 |
| BDD-13A-002 | plan duration del cliente A | registra segundos decimales | persiste valor/unidad y reporte conserva segundos | misma | contrato verde; E2E pendiente | P1 |
| BDD-13A-003 | plan latency del cliente A | registra segundos decimales | persiste valor/unidad sin redondeo indebido | misma | contrato verde; E2E pendiente | P1 |
| BDD-13A-004 | plan interval del cliente A | registra observados/total | rechaza observados > total y deriva porcentaje | misma | contrato verde; E2E pendiente | P1 |
| BDD-13B-001 | alta sintética vacía | completa contexto e historia aprobada | ficha conserva campos sin datos reales | `/clientes/nuevo` → `/clientes/:id` | observed E-004–E-006 | P1 |
| BDD-13B-002 | entrevista cliente A | agrega/quita informante | no pierde ni mezcla filas | pestaña Evaluación | contrato/componente verde; E2E final pendiente | P2 |
| BDD-13C-001 | tres evaluaciones A y una B | abre informe evaluación A | muestra sólo A, estados y rango correctos | `/informes/evaluacion?client=A` | observed E-012 + transición inferred | P1 |
| BDD-13D-001 | expediente completo A | abre informe completo desde ficha | cliente A queda preseleccionado | `/clientes/A` → `/informes/completo?client=A` | inferred | P1 |
| BDD-13D-002 | informe completo A | genera PDF local autorizado | secciones presentes, prohibidos ausentes, cero red | `/informes/completo?client=A` | observed E-020; formato PDF inferred | P1 |
| BDD-13D-003 | expedientes A y B | genera PDF A | ningún contenido de B aparece | misma | seguridad propuesta | P0 |

Cada evidencia debe registrar timestamp, UUID sintéticos, prueba/comando, viewport, estado de teclado,
resultado de privacidad y captura sólo si no expone datos reales.
