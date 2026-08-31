# Slice 07 / Publicación web

## Alcance

- Publicar primero en el Site privado de staging.
- Verificar navegación Login → Registro, validaciones locales y mensaje genérico.
- No crear una cuenta real durante el smoke automatizado.
- Mantener `noindex`, `Cache-Control: no-store` y el aviso de datos exclusivamente sintéticos.
- Mantener Sites privado hasta completar Google OAuth y el gate público de Slice 06.

## Gate de salida

- Regresión, typecheck, lint, build y preflight verdes.
- `/registro` funciona al recargar directamente.
- Ninguna contraseña aparece en logs, errores, URL o artefactos.

## Recuperación de contraseña

- Incluir `/recuperar-contrasena` entre las Redirect URLs autorizadas de Auth antes del smoke
  publicado; esta configuración requiere verificación manual en staging y no se cambia desde el
  frontend.
- Mantener `noindex`, `Cache-Control: no-store` y la ausencia de contraseñas en URL, logs o
  artefactos.
