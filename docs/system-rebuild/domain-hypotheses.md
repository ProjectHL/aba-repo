# Hipótesis de dominio

Estas entidades son un modelo mínimo inferido; no equivalen al esquema original.

| Entidad | Evidencia | Confianza | Relaciones propuestas |
|---|---|---|---|
| User | E-001, E-008 | observed | crea/asigna acceso a clientes |
| Organization | E-008 | probable | agrupa usuarios y clientes para aislamiento |
| Client | E-002, E-007 | observed | tiene familiares, antecedentes, evaluaciones, programas y sesiones |
| Guardian | E-003, E-007 | observed | pertenece al cliente |
| Sibling | E-003, E-007 | observed | pertenece al cliente |
| Diagnosis | E-005 | observed | pertenece al historial del cliente |
| ClinicalEvaluation | E-005, E-006 | observed | pertenece al historial del cliente |
| Medication | E-005, E-006 | observed | pertenece al historial del cliente |
| Interview | E-009, E-012 | observed | pertenece a evaluación conductual; contiene secciones dinámicas |
| PreferenceAssessment | E-010 | observed | pertenece al cliente; puede tener documento |
| FunctionalAssessment | E-011 | probable | pertenece al cliente; puede tener documento |
| AcquisitionProgram | E-013, E-020 | observed | pertenece al cliente; agrupa metas |
| AcquisitionGoal | E-014, E-018 | observed | pertenece a programa; define dimensión/criterio |
| TargetBehavior | E-015–E-017 | observed | pertenece al cliente; se mide en sesión |
| BehaviorFunctionProgram | E-015 | observed | agrupa intervención por función; relación exacta desconocida |
| Session | E-017, E-018 | observed | pertenece al cliente; contiene observaciones |
| Measurement | E-017–E-019 | observed | pertenece a sesión y meta/conducta; tipo depende de dimensión |
| GeneratedReport | E-012, E-016, E-019, E-020 | observed | consolida información y/o gráficos |

## Reglas candidatas que requieren aprobación

- ID clínico único dentro de una organización.
- Edad derivada de fecha de nacimiento y fecha de referencia, no persistida como autoridad.
- Los usuarios sólo acceden a clientes asignados o creados, además de una posible membresía organizacional.
- Las mediciones se interpretan según dimensión: frecuencia, porcentaje o duración.
- Los registros clínicos son archivables, no eliminables, conforme a la restricción del proyecto.
