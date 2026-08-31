# S-ABA-02 / BDD

Estado: **contratos automatizados y persistencia autenticada sintética ejecutados; navegador publicado pendiente**

```gherkin
Background:
  Given una organización, un estudiante y usuarios sintéticos asignados
  And rigen las capacidades aprobadas en S-ABA-01

Scenario: la ficha mínima distingue requerido y opcional
  When la supervisora crea un estudiante sin un campo requerido
  Then la creación es inválida
  When omite contexto, historia y consentimiento
  Then la ficha base puede crearse con esas secciones vacías

Scenario: una fila iniciada exige descriptor
  Given la supervisora añade una fila de diagnóstico reportado
  When deja vacío su descriptor
  Then la fila es inválida
  And otras secciones no se pierden

Scenario: la terapeuta consulta pero no modifica historia
  When la terapeuta asignada abre la historia del estudiante
  Then puede ver las entradas mínimas permitidas
  But no puede crear, corregir ni terminar una medicación

Scenario: la corrección conserva la historia
  Given existe una medicación sintética vigente
  When la supervisora corrige su descriptor de dosis
  Then se crea una versión que referencia la anterior
  And la versión anterior permanece como superseded

Scenario: terminar una medicación no la elimina
  When la supervisora registra una fecha de término válida
  Then la entrada conserva inicio, término y procedencia
  And no se ejecuta DELETE

Scenario: el consentimiento es granular por finalidad
  Given existe consentimiento válido para la finalidad "evaluación sintética"
  When se consulta una finalidad diferente
  Then no se reutiliza el consentimiento anterior
  And el estado de la nueva finalidad es not_recorded

Scenario: revocar consentimiento conserva evidencia histórica
  Given existe un registro válido para una finalidad sintética
  When la supervisora registra su revocación
  Then el estado futuro es revoked
  And el registro y eventos anteriores permanecen intactos

Scenario: el consentimiento MVP no maneja archivos ni firma
  When la supervisora registra una referencia de consentimiento sintética
  Then puede guardar metadatos y una referencia opaca
  But no puede subir PDF, imagen o firma

Scenario: la familia no recibe el expediente profesional
  When una familiar asignada abre su portal
  Then no recibe identificación clínica, familia, contexto, historia, medicación ni consentimiento
  And la futura proyección de resultados permanece separada

Scenario: un usuario no asignado no infiere el expediente
  When abre directamente la URL del estudiante
  Then recibe la misma respuesta que para un estudiante inexistente
```

Todos los descriptores, fechas, usuarios y estudiantes del BDD son ficticios. El flujo crítico se
ejecutó en `ABA_staging` tras la aprobación y autorización técnica del 2026-08-30.
