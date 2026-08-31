# Slice 03 / Cumplimiento y gobierno de datos

## Decisiones requeridas

1. Identificar al responsable del tratamiento y al prestador custodio.
2. Clasificar cada módulo como administrativo, asistencial o ficha clínica.
3. Aprobar un inventario de finalidades y bases de licitud.
4. Aprobar el esquema de representación y autonomía progresiva para menores.
5. Nombrar responsable de privacidad y seguridad.
6. Aprobar transferencias internacionales y encargados.

## Registro de tratamiento mínimo

Por cada finalidad: responsable, titulares, categorías, fuente, campos, base de licitud, destinatarios, encargados, región, retención, derechos aplicables, medidas de seguridad y decisión automatizada si existiere.

## DPIA obligatoria como gate interno

La evaluación incluirá arquitectura y flujo de datos, necesidad/proporcionalidad, menores, reidentificación, abuso interno, cuentas comprometidas, exportaciones, logs, backups, disponibilidad clínica, proveedores, transferencias, incidentes, derechos y riesgo residual.

## Consentimiento y evidencia

- Consentimientos separados y versionados por finalidad.
- Ninguna casilla premarcada ni consentimiento implícito.
- Revocación tan accesible como aceptación.
- Evidencia de identidad, capacidad, texto, versión, fecha y canal.
- El rechazo de una finalidad opcional no bloquea la atención.
- Consentimiento para atención sanitaria no autoriza pruebas de software.

## Retención

- Ficha clínica: mínimo 15 años desde el último ingreso.
- Cuenta, auditoría, consentimiento, incidentes, soporte y datos administrativos: plazo específico aprobado; no copiar automáticamente el plazo clínico.
- `legal_hold` bloquea eliminación por fundamento documentado.
- La eliminación posterior al plazo cumple el procedimiento del Decreto 41 y deja acta sin conservar el contenido destruido.

## Criterios de aceptación

1. Ningún campo carece de finalidad, base de licitud y retención.
2. Una solicitud del titular puede localizar datos, copias y encargados.
3. Una revocación afecta tratamientos futuros sin alterar indebidamente la ficha histórica.
4. Los derechos de acceso y portabilidad producen un paquete íntegro, estructurado y legible.
5. El programa de cumplimiento asigna responsables, capacitación, revisión y evidencia.

