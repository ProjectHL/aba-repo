# Slice 04 / Frontend

## Objetivo

Conservar el candidato aprobado por QA y ofrecer un recorrido evaluable con datos sintéticos: login, listado, búsqueda, alta, detalle, recuperación y logout.

## Criterios

- Banner de staging visible en toda ruta y prohibición explícita de datos reales o históricos.
- Confirmación sintética obligatoria antes del alta.
- Patrones evidentes de RUT/correo se interrumpen sin registrar el valor.
- Errores de sesión, permisos, conflicto y red mantienen el comportamiento retesteado.
- Un fallo fatal de configuración durante el arranque muestra un estado seguro de indisponibilidad; nunca deja una pantalla en blanco ni expone valores técnicos.
- No agregar funcionalidad clínica, edición, exportación ni texto libre.
- El candidato debe conservar 41 pruebas, typecheck, lint y build verdes.
