# Handoff — Slice 13 spec-first con SDD, TDD y BDD

Fecha: 2026-08-25  
Estado: spec congelada; implementación aún no iniciada.

## Qué se entregó

Se detallaron los pendientes de la revisión video/frontend en cuatro capas separadas:

- `specs/slice-13/index.md`: orden obligatorio, dependencias, datos sintéticos y definición global
  de terminado.
- `specs/slice-13/frontend.md`: controles por dimensión, paridad de formularios, informe de
  evaluación, informe completo, PDF y pruebas TDD mínimas.
- `specs/slice-13/backend.md`: contratos de datos, aislamiento y decisión explícita de no usar NestJS
  ni exportación server-side.
- `specs/slice-13/supabase.md`: decisión previa sobre unidades, migraciones aditivas, RLS, grants,
  advisors y pruebas SQL sin borrado.
- `specs/slice-13/web-publication.md`: candidato local, preflight, privacidad y autorización
  separada de publicación.

## Orden de ejecución

1. **13A — dimensiones de medición:** frecuencia, duración, latencia e intervalo.
2. **13B — formularios clínicos:** adaptaciones, historia, consentimiento, informantes y paridad.
3. **13C — informe de evaluación:** consumir evaluaciones persistidas y estados completos.
4. **13D — informe completo/PDF:** integrar módulos autorizados y prueba local de archivo.
5. QA autenticado final con fixtures sintéticos, luego publicación sólo con autorización.

## Skills creadas para subagentes

- `.codex/skills/aba-sdd-spec-first/SKILL.md`
  - Obliga a leer la spec de cuatro capas antes de escribir código.
  - Separa evidencia observada de inferencias.
  - Detiene al subagente si falta una decisión de producto.
- `.codex/skills/aba-tdd-validation/SKILL.md`
  - Exige rojo → implementación mínima → verde → refactor → regresión.
  - Usa binarios locales si Corepack intenta leer caché global.
  - Prohíbe borrar, limpiar, publicar o usar datos reales.
- `.codex/skills/aba-bdd-flow-validation/SKILL.md`
  - Ejecuta escenarios Given/When/Then encadenados.
  - Exige evidencia, aislamiento por cliente y estados de error/reintento.
  - Separa la descarga real del PDF como acción autorizada.

## Validación realizada

- Las tres skills tienen frontmatter válido, descripción y sin placeholders.
- Las tres contienen la frontera `aba 2`, no borrado y datos sintéticos.
- La spec contiene gates SDD, TDD y BDD y referencias de salida.
- No se modificó código de aplicación, Supabase, hosting ni datos remotos.

## Brújula

| Área | Estado | Próximo movimiento |
| --- | ---: | --- |
| SDD y especificaciones | 90% | aprobar decisiones clínicas pendientes |
| TDD y contratos | 80% | crear pruebas rojas de 13A |
| BDD y flujos | 65% | escenarios autenticados después de cada lote |
| Formularios clínicos | 60% | 13B, comenzando por alta e historia |
| Dimensiones de sesión | 35% | 13A |
| Informes derivados | 70% | 13C para evaluación |
| PDF completo | 55% | 13D y prueba de archivo local |
| Supabase/RLS | 90% | sólo migrar si 13A lo exige |
| Publicación | 55% | no publicar hasta QA final |

**MVP técnico estimado: 76%. Paridad completa con el video: 60–65%.**

## Próxima acción autorizada

Iniciar 13A en modo spec-first: revisar el modelo actual de mediciones, escribir la prueba roja para
cada unidad, decidir si basta el contrato existente y detenerse antes de migrar Supabase si la unidad
no está definida clínicamente.

