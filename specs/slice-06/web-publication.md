# Slice 06 / Publicación web

## Decisión

El Site pasará de acceso `custom` owner-only a `public` sólo después de que Google OAuth funcione en staging. Público significa que cualquiera puede ver la pantalla de acceso; no significa acceso público a Clientes.

## Orden

1. Publicar el frontend con Google preparado en una versión privada. El botón será visible y quedará
   bloqueado mediante `VITE_GOOGLE_AUTH_ENABLED=false` hasta que el proveedor esté operativo.
2. Probar redirect Google y callback con una cuenta autorizada.
3. Probar identidad sin membresía y membresía activa.
4. Cambiar Sites a `public` con autorización ya entregada por el usuario.
5. Repetir rutas, headers, noindex, RLS y logout.

## Stop conditions

- No hacer público el Site con Google deshabilitado o callback roto.
- No publicar secretos OAuth.
- No autoasignar organización o rol por dominio `gmail.com`.
- No aceptar datos reales durante el piloto.
