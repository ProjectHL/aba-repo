# Slice 15 — informes clínicos completos y PDF

## Estado

**APROBADA POR EL USUARIO EL 2026-08-29 PARA IMPLEMENTACIÓN LOCAL CON TDD.**

Este slice es independiente del cierre frontend de Slice 14. Autoriza código y pruebas locales,
pero no cambios de Supabase, descargas de QA fuera del workspace, publicación ni uso de datos reales. Los cuatro archivos de capa y
`bdd.md` forman un único contrato; una aprobación futura debe aprobarlos en conjunto.

## Objetivo

Cerrar el significado, contenido, fuentes, estados, permisos y salida PDF de los tres informes ya
representados por el frontend:

| ID | Informe | Ruta actual | Evidencia | Estado de entrada |
| --- | --- | --- | --- | --- |
| RPT-01 | Progreso y gráficos | `/informes` | E-019 | funcional con datos derivados |
| RPT-02 | Evaluación conductual | `/informes/evaluacion` | E-012 | ruta y marco; contenido clínico incompleto |
| RPT-03 | Informe completo | `/informes/completo` | E-020 | ruta, métricas y PDF local; paridad incompleta |

“Completo” significa completo respecto del contenido que este contrato apruebe, no expediente
clínico total, dictamen profesional, diagnóstico ni sustituto del registro fuente.

## Clasificación de verdad

| Marca | Significado |
| --- | --- |
| `observed` | visible en la evidencia fuente |
| `existing-approved` | decisión local ya aprobada e implementada, pero no observada en el producto fuente |
| `proposed` | recomendación de este borrador; requiere aprobación explícita |
| `blocked` | no se puede implementar sin una decisión o contrato adicional |

La implementación actual nunca reclasifica una inferencia como `observed`.

## Evidencia y límites

| Evidencia | Hecho observado | No demuestra |
| --- | --- | --- |
| E-012 | documento de evaluación con entrevistas, jerarquía, fortalezas y debilidades | formato final, permisos, edición, firma o retención |
| E-016 | acción de descarga para programas/conductas | formato, contenido exacto o inclusión en RPT-03 |
| E-019 | gráficos por programa/meta, sesiones, total/promedio y exportación JPG | filtros exactos, fórmula completa o política del archivo |
| E-020 | documento completo con resumen y detalle de adquisición: objetivo, dimensión, línea base, fechas, criterio, nivel, estado, generalización y mantenimiento | que incluya todos los módulos, PDF, auditoría o persistencia |
| Slice 12 | PDF local bajo demanda con métricas y gráficos; sin persistencia | paridad clínica con E-012/E-020 |

## Alcance propuesto

1. Conservar RPT-01 y formalizar sus cálculos, filtros y estados.
2. Convertir RPT-02 en una síntesis real de evaluaciones persistidas y compatibles con payloads
   aprobados; nunca interpretar texto clínico ni inventar conclusiones.
3. Ampliar RPT-03 para reunir secciones aprobadas de evaluación, adquisición, reducción y progreso,
   manteniendo trazabilidad a registros fuente.
4. Generar RPT-03 como PDF local efímero y descargable sólo bajo acción del usuario autenticado.
5. Mantener una vista HTML imprimible accesible y equivalente al contenido autorizado.

Los puntos 2–4 quedaron aprobados mediante D15-01 a D15-06 el 2026-08-29.

## Decisiones requeridas

| ID | Decisión | Propuesta conservadora | Estado |
| --- | --- | --- | --- |
| D15-01 | catálogo de informes | RPT-01 Progreso, RPT-02 Evaluación, RPT-03 Completo | aprobado 2026-08-29 |
| D15-02 | alcance de “completo” | perfil mínimo + evaluación + programas/metas + planes + progreso; excluir historia frontend y adjuntos | aprobado 2026-08-29 |
| D15-03 | filtro temporal | afecta sesiones/mediciones/ensayos; registros maestros se muestran con su estado vigente | aprobado 2026-08-29 |
| D15-04 | fallo de una fuente | no emitir un PDF “completo” parcial; mostrar error recuperable | aprobado 2026-08-29 |
| D15-05 | ciclo del PDF | generado localmente, descarga manual, sin persistencia ni auditoría | aprobado 2026-08-29 |
| D15-06 | privacidad | iniciales + ID clínico; excluir DOB, familiares, notas, adjuntos, drafts, consentimiento y usuarios | aprobado 2026-08-29 |

## No objetivos

- Persistir contexto/historia frontend de Slice 14.
- Diagnóstico, recomendaciones automáticas, interpretación clínica o firma profesional.
- Adjuntos, Storage, DOCX, CSV, envío por correo, enlaces compartibles o entrega a terceros.
- Generación server-side, NestJS, Edge Functions, tablas de informes o registro de descargas.
- Cambiar RLS, grants, RPC, schema, Auth, consentimiento o acceso por expediente.
- Corregir o editar desde el informe los registros fuente.
- Resolver PERF-14-001 o ampliar audiencia/publicar.

## Fronteras

| Capa | Propietaria de | No puede decidir sola |
| --- | --- | --- |
| frontend | selección, filtros, estados, composición, impresión y descarga local | acceso, retención o nuevos campos persistidos |
| backend | ausencia de servicio y puertos de lectura existentes | introducir generación privilegiada |
| Supabase | lecturas existentes bajo RLS; cero mutación | Storage, auditoría o nuevas políticas |
| publicación | gates locales de candidato y privacidad | despliegue o ampliación de audiencia |

## Definition of Ready

Este slice quedó listo para TDD el 2026-08-29 porque:

- D15-01 a D15-06 están aprobadas;
- cada campo del informe tenga fuente, regla de ausencia y clasificación de evidencia;
- frontend, backend, Supabase y publicación no se contradigan;
- los escenarios BDD sean verificables con fixtures sintéticos;
- un desarrollador pueda implementar sin inventar campos, permisos, persistencia, formato o
  interpretación clínica.

## Stop conditions

Detener y pedir una nueva aprobación ante cualquier solicitud de persistencia, auditoría, adjunto,
datos reales, generación remota, destinatario externo, cambio de permisos o publicación.
