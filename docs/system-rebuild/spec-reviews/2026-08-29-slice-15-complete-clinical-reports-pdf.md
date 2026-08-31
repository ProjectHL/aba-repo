# Revisión de spec — Slice 15 informes clínicos completos y PDF

Fecha: 2026-08-29  
Estado: **D15-01 a D15-06 aprobadas el 2026-08-29; lista para TDD local**

## Resultado de la revisión

La nueva spec quedó separada de Slice 14 y cubre frontend, backend, Supabase, publicación y BDD.
La brecha principal es semántica: las rutas existen, pero RPT-02 aún no compone evaluaciones y
RPT-03 sólo reutiliza el informe de progreso. El PDF local actual no convierte esa vista en un
informe clínico completo.

## Alcance

- RPT-01 Progreso y gráficos (E-019).
- RPT-02 Informe de evaluación (E-012).
- RPT-03 Informe completo (E-020).
- PDF local efímero de RPT-03 como propuesta continuista de Slice 12.

## Fuentes y trazabilidad

| Producto | Evidencia | Fuente local vigente o necesaria |
| --- | --- | --- |
| RPT-01 | E-019 | sesiones, mediciones, ensayos, planes y metas |
| RPT-02 | E-012 | evaluaciones persistidas y payloads versionados |
| RPT-03 | E-020 + composición propuesta | cliente mínimo, evaluaciones, programas/metas, planes y progreso |
| PDF | `existing-approved` Slice 12 | modelo minimizado de RPT-03 en memoria |

## Seguridad

Mismo profesional autenticado y mismo acceso por expediente que las lecturas vigentes. Sin nuevos
roles, destinatarios, archivos remotos, Storage, auditoría, backend privilegiado ni datos reales.
El contenido propuesto excluye DOB, familiares, notas, adjuntos, drafts, consentimiento, usuarios e
identificadores internos.

## Criterios testables

Los criterios completos están en `bdd.md`: rango inclusivo, cálculos verificables, payloads
versionados, vacío/error/no-soportado diferenciados, atomicidad del informe completo, aislamiento
por cliente, PDF minimizado, teclado, fallo recuperable, impresión y 320 px.

## Dependencias

- aprobación D15-01 a D15-06;
- reemplazar los `unknown` deliberados por tipos exactos de sección;
- conservar los contratos remotos existentes sin cambios;
- después de aprobación: `aba-tdd-validation`, luego `aba-bdd-flow-validation` y, con gates verdes,
  `aba-mvp-qa-release-loop`.

## Decisiones aprobadas por el usuario

1. Tres informes: Progreso, Evaluación y Completo.
2. “Completo” incluye perfil mínimo, evaluación, adquisición, reducción y progreso.
3. El rango filtra eventos fechados; programas/planes muestran estado vigente.
4. Una fuente requerida fallida bloquea el PDF completo, sin salida parcial.
5. PDF local descargable, sin persistencia ni auditoría.
6. Lista de datos incluidos/excluidos definida en la spec.

## Próxima tarea exacta

Ejecutar el primer ciclo rojo de `aba-tdd-validation` para que RPT-02 componga evaluaciones
persistidas compatibles y RPT-03 reúna las cuatro secciones aprobadas antes de habilitar su PDF.
