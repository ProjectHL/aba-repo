# Slice 07 / Registro clásico

## Objetivo

Permitir que una profesional cree una identidad con correo y contraseña desde la puerta de acceso,
sin recibir acceso clínico hasta contar con una membresía activa.

## Flujo

1. Desde Login, seleccionar `Crear cuenta con correo`.
2. Completar correo, contraseña y repetir contraseña.
3. Validar localmente formato, longitud y coincidencia antes de enviar.
4. Crear la identidad mediante Supabase Auth.
5. Mostrar una respuesta genérica que indique revisar el correo de confirmación.
6. Después de confirmar e iniciar sesión, una identidad sin membresía queda en `pending`.

## Extensión 2026-08-24 — recuperación de contraseña

1. Desde Login, seleccionar `¿Olvidaste tu contraseña?`.
2. Solicitar el vínculo mediante correo sin revelar si la identidad existe.
3. El vínculo permitido retorna únicamente a `/recuperar-contrasena` del Site.
4. La nueva contraseña exige 12 caracteres y confirmación exacta.
5. Tras actualizarla se cierra la sesión temporal de recuperación y se vuelve a Login.

## Gate

- Datos de prueba exclusivamente sintéticos.
- La creación de identidad nunca crea organización, rol ni membresía.
- La confirmación del correo no equivale a autorización clínica.
- No revelar si un correo ya existe.
