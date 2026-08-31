# S-ABA-01 / BDD de autorización por estudiante

Estado: **contratos automatizados y flujo crítico autenticado ejecutado; navegador publicado pendiente**

## Background sintético

```gherkin
Background:
  Given una organización sintética "Org Alfa"
  And los estudiantes sintéticos "A" y "B"
  And una supervisora principal, un coordinador, una terapeuta y una familiar con membresía activa
  And la supervisora, el coordinador, la terapeuta y la familiar están asignados al estudiante "A"
  And ningún usuario salvo la supervisora está asignado al estudiante "B"
```

## Descubrimiento y aislamiento

```gherkin
Scenario: un miembro de la organización no infiere un estudiante no asignado
  Given un miembro activo de "Org Alfa" no asignado al estudiante "A"
  When lista estudiantes o abre directamente la URL de "A"
  Then "A" no aparece en la lista
  And recibe la misma respuesta pública que para un estudiante inexistente

Scenario: una membresía inactiva corta todo acceso
  Given la terapeuta conserva una asignación activa al estudiante "A"
  And su membresía pasa a inactiva sin borrar filas
  When intenta ver o capturar datos con una sesión ya iniciada
  Then la operación es denegada
  And no se revela información del estudiante
```

## Capacidades base

```gherkin
Scenario: la terapeuta registra pero no configura
  When la terapeuta abre el estudiante "A"
  Then puede ver programas y configuración necesaria para registrar
  And puede capturar y enviar un registro sintético
  But no puede crear o editar programas, plantillas ni gráficos

Scenario: el coordinador sin grant permanece restringido
  When el coordinador abre un programa del estudiante "A"
  Then puede verlo
  But no puede editarlo
  And puede solicitar "program.edit"
```

## Solicitud, decisión y alcance

```gherkin
Scenario: una solicitud equivalente no se duplica
  Given existe una solicitud pendiente de "program.edit" para "A"
  When el coordinador reintenta la misma solicitud
  Then recibe el estado de la solicitud existente
  And no se crea una segunda solicitud pendiente equivalente

Scenario: sólo la supervisora principal decide
  Given una solicitud pendiente de "program.edit" para "A"
  When la terapeuta o el coordinador intenta aprobarla
  Then la decisión es denegada
  When la supervisora principal la aprueba por 90 días
  Then el grant queda vigente y auditado

Scenario: un grant habilita sólo su acción y estudiante
  Given el coordinador tiene un grant vigente de "program.edit" para "A"
  When edita un programa de "A"
  Then la operación es permitida
  But no puede editar el expediente ni configurar gráficos de "A"
  And no puede leer o editar recursos de "B"

Scenario: denegación conserva modo restringido
  Given una solicitud pendiente de "student.edit" para "A"
  When la supervisora la deniega
  Then el coordinador conserva sólo sus capacidades base
  And la solicitud y decisión permanecen auditables sin datos clínicos
```

## Vencimiento y revocación

```gherkin
Scenario: un grant vencido deja de autorizar con la sesión activa
  Given el coordinador tiene un grant cuya fecha de vencimiento ya pasó
  When intenta la acción concedida sin cerrar sesión
  Then la operación es denegada como no autorizada
  And puede crear una solicitud nueva

Scenario: la revocación es inmediata y no destructiva
  Given el coordinador tiene un grant vigente de "chart.configure" para "A"
  When la supervisora principal lo revoca
  Then la siguiente mutación del coordinador es denegada
  And el historial de solicitud, aprobación y revocación permanece intacto
```

## Familia y publicación

```gherkin
Scenario: la familia no accede a datos clínicos crudos
  When la familiar abre el estudiante "A"
  Then no recibe sesiones, ensayos, mediciones, evaluaciones, notas, medicación ni contactos
  And no puede capturar, editar, descargar ni chatear

Scenario: la vista familiar permanece cerrada hasta definir su proyección
  Given S-ABA-02 no ha aprobado los campos de la proyección familiar
  When la familiar intenta abrir resultados
  Then la aplicación muestra que la función aún no está disponible
  And no reutiliza ni entrega la respuesta profesional completa
```

## Trazabilidad

| Escenarios | Decisión/regla |
| --- | --- |
| aislamiento | membresía + asignación + deny-by-default |
| capacidades base | matriz D01/D02 |
| solicitud/decisión | D03/D05/D09 |
| vencimiento/revocación | D04 y auditoría append-only |
| familia | D06/D07 y dependencia S-ABA-02 |
