# Evidencia E2E autenticada — flujo clínico sintético

Fecha: 2026-08-24  
Entorno: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Canal: navegador integrado, sesión autenticada existente  
Alcance: sólo datos sintéticos de una persona adulta; no se usaron datos clínicos reales ni de menores.

## Expediente creado

| Campo | Valor sintético |
| --- | --- |
| Iniciales | `ZX` |
| ID clínico | `E2E-SYNTH-ALPHA` |
| Fecha de nacimiento | `1990-01-01` |
| Convivencia | hogar sintético compartido |
| Tutor | `TG`, `1970-01-01` |

El alta se hizo desde `/clientes` mediante `create_client`; el detalle volvió a cargar el expediente,
la convivencia y el tutor desde staging bajo RLS.

## Recorrido verificado

| Paso | Acción y dato sintético | Evidencia observada |
| --- | --- | --- |
| Evaluación | Entrevista inicial, preferencias y evaluación funcional | 1 borrador por cada tipo al recargar la ficha |
| Adquisición | Programa `Programa sintético de habilidades` | 1 programa visible tras carga limpia |
| Meta | `Meta sintética de solicitud`, criterio 80% en tres sesiones sintéticas | 1 meta visible y asociada al programa |
| Reducción | `Conducta sintética objetivo`, unidad `frequency` | 1 plan visible tras carga limpia |
| Sesión | 2026-08-24; valor conductual 3; 8 correctos y 2 incorrectos | aviso UI: `Sesión sintética guardada de forma atómica.` |
| Informe | `/informes`, expediente `ZX · E2E-SYNTH-ALPHA` | 1 sesión, 1 plan con datos, 1 meta revisada y 80.0% |

El informe mostró la serie `Conducta sintética objetivo: 3` para `2026-08-24` y la meta con
`8 correctos · 2 incorrectos`, consistente con 80.0%.

## Verificación de persistencia

Las consultas de comprobación en staging confirmaron registros para el mismo `client_id` sintético:

- 3 evaluaciones (`initial_interview`, `preference`, `functional`);
- 1 programa, 1 meta asociada y 1 plan de conducta;
- 1 sesión con sus mediciones y ensayos, creada por la operación atómica;
- las llamadas REST del navegador respondieron 200/201 bajo la sesión autenticada y RLS.

## Hallazgos y correcciones

1. La consulta de detalle usaba columnas resumidas mientras validaba el contrato completo. Se cambió
   a la selección de detalle, incluyendo convivencia, tutores y hermanos.
2. PostgREST devuelve `timestamptz` con un espacio entre fecha y hora. La validación exclusiva de
   `z.iso.datetime()` lo rechazaba aunque la escritura hubiera sido exitosa. Los repositorios clínicos
   ahora aceptan cualquier timestamp interpretable.
3. Durante esta sesión de navegador, varios formularios mostraron un falso error inmediatamente
   después de insertar, aunque la API devolvió 201 y los datos persistieron. Una recarga con F5
   mostró los conteos correctos. El defecto queda abierto para diagnóstico específico del camino
   `insert().select().single()`/estado del formulario; no se atribuye a RLS ni se considera éxito UI.

No se eliminó ni alteró ningún dato previo. Los registros sintéticos descritos permanecen en staging
por la política de no eliminación.
