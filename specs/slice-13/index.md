# Slice 13 — paridad clínica y cadena de exportación

## Estado

**Aprobada para implementación local y Supabase staging. Despliegue y datos reales bloqueados.**

Estado por capa:

| Capa | Estado | Registro |
| --- | --- | --- |
| Frontend | aprobada | `docs/system-rebuild/decisions/2026-08-25-slice-13-approval.md` |
| Backend | aprobada | mismo registro |
| Supabase | aprobada sólo para staging | mismo registro |
| Publicación | spec aprobada; despliegue bloqueado | mismo registro |
| Global | 13A implementada; 13B.1 entrevista dinámica en ejecución | no autoriza Sites ni datos reales |

## Objetivo

Cerrar las brechas que impiden afirmar que los formularios y el flujo encadenado reproducen el
recorrido observado hasta un informe PDF completo, manteniendo sólo datos sintéticos en staging.

## Orden obligatorio (spec first)

No se modifica código, esquema, Storage, hosting ni configuración remota mientras esta spec no
esté aprobada por las cuatro capas. Cada subagente debe leer esta spec y la capa que le corresponde,
declarar su alcance y comenzar por una prueba o criterio verificable. Un subagente no puede convertir
una inferencia del video en un campo obligatorio sin una decisión registrada aquí.

La secuencia de ejecución es:

1. SDD: congelar contrato, decisiones, datos permitidos y criterios de aceptación.
2. TDD: escribir una prueba roja por comportamiento, implementar lo mínimo y cerrar regresión.
3. BDD: recorrer escenarios de usuario encadenados con fixtures sintéticos y registrar evidencia.
4. Handoff: documentar resultados, riesgos, brújula y autorización pendiente.

## Matriz obligatoria de subagentes y skills

| Fase | Skill obligatoria | Responsable | Salida exigida |
| --- | --- | --- | --- |
| SDD | `aba-sdd-spec-first` | agente de especificación | contrato aprobado y decisión registrada |
| TDD | `aba-tdd-validation` | agente implementador | prueba roja, verde, regresión y archivos cambiados |
| BDD | `aba-bdd-flow-validation` | agente de flujo | matriz Given/When/Then y evidencia sintética |
| QA final | `aba-mvp-qa-release-loop` | agente QA | P0/P1/P2, preflight, handoff y brújula |

Ningún subagente puede saltarse su skill o ejecutar la fase siguiente si la salida anterior está
pendiente. Los prompts deben repetir frontera de workspace, no borrado y datos sintéticos.

## Lotes

- 13A: dimensiones de medición de sesión.
- 13B: paridad de alta, ficha e entrevista.
- 13C: informe de evaluación y enlace desde ficha.
- 13D: informe completo y prueba de PDF dentro del workspace.

Avance: **13A implementada localmente y migrada a staging**. Contratos UI/RPC/reporte y SQL están
verificados; el recorrido autenticado de navegador queda deliberadamente en el QA final solicitado.

13B se ejecuta por contratos independientes:

1. **13B.1 entrevista dinámica:** autorizado; reutiliza `assessments.payload`, sin migración.
2. **13B.2 contexto hogar/colegio:** bloqueado hasta aprobar almacenamiento y RPC.
3. **13B.3 historia clínica:** bloqueado hasta aprobar tablas, auditoría y campos sensibles.
4. Consentimiento/acceso: fuera de 13B; requiere spec legal y de autorización propia.

## Dependencias

`13A` debe preceder a la captura de sesiones y a los informes. `13B` puede ejecutarse en paralelo
con `13A` sólo en formularios que no cambien las tablas clínicas. `13C` depende de evaluaciones
persistidas. `13D` depende de `13A`, `13B` y `13C`, y no autoriza publicación por sí solo.

## Datos y no objetivos

- Fixtures: UUID sintéticos, iniciales ficticias y fechas de prueba.
- Prohibido: RUT, correos personales, nombres reales, fechas de pacientes, adjuntos reales o datos
  históricos.
- No se implementa corrección retroactiva de sesiones, sincronización offline, firmas, Storage ni
  API NestJS en este slice.

## Criterio global de aceptación

Un lote queda cerrado sólo si su spec de frontend/backend/Supabase/publicación está actualizada,
existe evidencia TDD y BDD, la regresión local está verde, no hay P0/P1 abiertos en su alcance y
el handoff actualiza la brújula. La publicación requiere autorización separada.

## Regla de salida

Cada lote requiere prueba roja, implementación mínima, regresión, typecheck, lint, evidencia y
brújula. El QA autenticado final permanece posterior a todos los lotes.
