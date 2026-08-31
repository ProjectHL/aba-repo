# Slice 06 / Frontend

## Alcance

- Mostrar `Crear cuenta o continuar con Google` como acceso principal.
- En la publicación privada previa a OAuth, mantener el botón visible pero interceptar su acción con
  un aviso seguro cuando `VITE_GOOGLE_AUTH_ENABLED=false`.
- Iniciar OAuth con retorno al mismo origen y una ruta interna segura.
- Mantener correo/contraseña sólo durante la transición privada; no será el acceso principal público.
- Mostrar `Acceso pendiente de aprobación` para identidad sin membresía.
- Mostrar `Acceso desactivado` para membresía inactiva.
- Permitir cerrar sesión desde ambos estados.
- No mostrar roles internos, UUID, tokens ni detalles de otras organizaciones.

## TDD

1. El botón Google llama al puerto de autenticación una sola vez.
2. Un error previo al redirect muestra un mensaje genérico y enfocado.
3. Identidad `pending` no renderiza Clientes.
4. Identidad `inactive` no renderiza Clientes.
5. Identidad `active` conserva listado, alta, detalle y logout.
6. El retorno OAuth sólo acepta rutas del mismo origen.
7. Con Google deshabilitado, el botón sigue visible, no inicia OAuth y explica el estado de configuración.

Estado: casos 1–5 implementados; el caso 6 se completa con el smoke real del proveedor.
