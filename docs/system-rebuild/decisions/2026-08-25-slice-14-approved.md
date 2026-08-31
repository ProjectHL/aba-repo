# Decisión — Slice 14 aprobada

- Fecha: 2026-08-25
- Alcance aprobado: cierre frontend de CF-01 a CF-08 según la spec paraguas
  `specs/slice-14-clinical-forms-frontend-closure/`.
- Prioridad confirmada: completar todos los formularios clínicos antes de informes, PDF,
  publicación y QA final.
- Persistencia: no crear ni modificar tablas, RPC, RLS o Storage. CF-02 y CF-03 permanecen
  exclusivamente en memoria React; los demás módulos conservan los repositorios ya autorizados.
- Método: SDD aprobado, TDD rojo-verde-refactor y validación BDD sintética por lote.
- Fuera de alcance: datos reales, producción, despliegue, consentimiento editable y gestión de
  acceso.

