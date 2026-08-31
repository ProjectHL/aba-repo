# Slice 05 / Frontend

## Objetivo

Usar el candidato publicado para que la profesional evalúe comprensión, navegación y alta de un cliente completamente ficticio, sin ampliar todavía el dominio clínico.

## Alcance

- Login con correo individual y contraseña única.
- Banner permanente: no ingresar pacientes actuales, antiguos, seudonimizados o reconocibles.
- Listado, búsqueda, alta, validación, detalle, recuperación de error y logout.
- Confirmación obligatoria de datos sintéticos.
- La UI no muestra credenciales, roles internos, tokens ni identificadores de otras organizaciones.

## Fuera de alcance

- registro, recuperación de contraseña y cambio de contraseña dentro de la app;
- notas clínicas, diagnósticos, sesiones, documentos o informes;
- grabación de pantalla, analítica de comportamiento o texto libre clínico;
- datos reales aunque la profesional tenga autorización sobre ellos en otro sistema.

## Casos TDD/aceptación

1. La evaluadora sin sesión llega a login y vuelve a una ruta interna segura.
2. Credenciales incorrectas muestran un mensaje genérico.
3. Membresía inactiva produce cero acceso a Clientes aunque el JWT siga vigente.
4. Rol `clinician` crea una sola ficha sintética; `viewer` recibe 403.
5. El formulario rechaza RUT/correo evidente y exige confirmación sintética.
6. Logout vuelve a login y una ruta privada no revela contenido.
7. Ninguna captura o evidencia contiene contraseña, correo personal completo ni payload de formulario.

## Decisión de implementación

No se requiere cambio visual para iniciar el piloto. Cualquier ajuste solicitado por la profesional pasa a Slice 06 y comienza con prueba roja.

