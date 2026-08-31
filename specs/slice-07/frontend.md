# Slice 07 / Frontend

## Alcance

- Añadir `Crear cuenta con correo` en Login.
- Añadir ruta pública `/registro`.
- Formulario accesible con correo, contraseña y repetir contraseña.
- Requerir al menos 12 caracteres y coincidencia exacta de contraseñas.
- No conservar ni registrar contraseñas.
- Mostrar errores locales junto al campo y errores remotos mediante un mensaje genérico.
- Tras una solicitud aceptada, mostrar `Revisa tu correo para confirmar la cuenta` y un enlace a Login.

## TDD

1. El botón de Login abre `/registro`.
2. Contraseñas diferentes no llaman a Auth.
3. Una contraseña corta no llama a Auth.
4. Un formulario válido llama una vez a `signUp`.
5. Un error remoto no filtra detalles internos.
6. El mensaje de éxito no concede acceso a Clientes.

## Recuperación de contraseña

- Añadir ruta pública `/recuperar-acceso` y ruta de retorno `/recuperar-contrasena`.
- La solicitud acepta correo, no conserva ni muestra su valor después de enviarlo y comunica un
  resultado uniforme para prevenir enumeración de cuentas.
- El formulario de nueva contraseña sólo se habilita al recibir el evento `PASSWORD_RECOVERY` de
  Supabase Auth; una sesión ordinaria no autoriza este cambio desde la ruta de recuperación.
- El formulario tiene campos de contraseña y confirmación, `autocomplete="new-password"`, mínimo
  de 12 caracteres y mensajes genéricos sin detalles remotos.
- Tras el éxito, cerrar la sesión temporal y redirigir a `/login`.

## TDD de recuperación

1. Login enlaza a la solicitud de recuperación.
2. Un correo válido llama una vez a `requestPasswordRecovery` y muestra respuesta uniforme.
3. Error remoto no filtra detalles internos.
4. Un vínculo inválido no muestra el formulario de nueva contraseña.
5. Contraseña corta o no coincidente no llama a `updatePassword`.
6. Un flujo válido actualiza, cierra sesión y vuelve a Login.

Estado: implementado y cubierto por regresión el 2026-08-24. Falta el smoke remoto, condicionado a
configurar las Redirect URLs autorizadas de Supabase Auth.
