# Política de datos de prueba

Fecha: 2026-08-18  
Estado: obligatoria para local, staging, demos, soporte y pruebas de usuario.

## Regla

Sólo se permiten datos sintéticos creados específicamente para pruebas y que no representen a una persona real. Está prohibido introducir información de pacientes actuales o antiguos, familiares, profesionales o contactos reales.

## No se consideran anónimos por sí solos

- iniciales;
- RUT cifrado, recortado o con dígito alterado;
- ID clínico original;
- fecha de nacimiento exacta;
- combinación de edad, comuna, colegio, diagnóstico o estructura familiar;
- texto libre con nombres, lugares, acontecimientos o fechas reales;
- una copia de ficha a la que sólo se cambiaron identificadores directos.

Estos casos son datos personales seudonimizados y permanecen prohibidos en pruebas.

## Generación permitida

- Prefijo visible `SYN-` en identificadores.
- Nombres ficticios no derivados de pacientes.
- Fechas y relaciones generadas sin copiar casos clínicos.
- Escenarios redactados desde patrones generales, sin reproducir narrativas reales.
- `test_run_id` y estado `archived` para trazabilidad no destructiva.

## Importación histórica

Toda importación queda bloqueada por defecto. Para una excepción futura se exigirán, antes de abrir el archivo de origen en el sistema:

1. finalidad y necesidad documentadas;
2. dictamen jurídico y autorización del responsable;
3. base de licitud o consentimiento específico verificable;
4. método formal de anonimización y evaluación de reidentificación;
5. entorno aislado aprobado, acceso nominal y registro de actividad;
6. calendario de retención y eliminación segura;
7. evidencia de que ninguna copia persiste en descargas, logs o herramientas de soporte.

La seudonimización no reemplaza estos requisitos.

## Pruebas con profesionales

La psicóloga puede evaluar pantallas y flujos con casos sintéticos realistas. Debe recibir una cuenta individual, compromiso de confidencialidad, instrucción explícita de no ingresar pacientes reales y un canal para reportar errores sin adjuntar capturas que contengan información sensible.

## Incidente

Si alguien introduce datos reales:

1. detener nuevas operaciones sobre el registro;
2. restringir acceso y preservar evidencia sin difundir el contenido;
3. avisar de inmediato al responsable de privacidad;
4. identificar copias, logs, exportaciones y personas con acceso;
5. aplicar el plan de incidentes y la decisión jurídica de bloqueo, devolución o eliminación;
6. documentar la causa y corregir controles antes de reanudar.

El equipo de desarrollo no ejecutará borrado improvisado ni ocultará el incidente.

