# Slice 05 / Acceso privado de Sites

## Estado inicial

- Site activo: versión 6.
- Modo: `custom`.
- Visitantes externos: 0.
- Grupos: 0.
- Propietario: 1.

## Cambio autorizado pendiente

Después de recibir correo exacto y confirmación explícita:

1. conservar modo `custom`;
2. agregar sólo el correo de la psicóloga;
3. conservar cero grupos;
4. no cambiar a `public` o `workspace_all`;
5. verificar que la invitación no altere la versión desplegada;
6. confirmar que un correo distinto sigue bloqueado.

Agregar una visitante externa puede enviar un correo de invitación. La operación no se ejecuta durante la redacción de esta spec.

## Smoke posterior

- La evaluadora atraviesa la barrera de Sites con su propia identidad.
- Supabase Auth continúa solicitando la segunda credencial.
- `/`, `/login` y una ruta SPA directa cargan correctamente.
- `no-store`, noindex, CSP y HSTS permanecen presentes.
- Logs no contienen correo completo, contraseña, JWT ni contenido de Clientes.

## Retirada

- La membresía Supabase se inactiva antes de retirar el acceso de Sites.
- La allowlist sólo se modifica con confirmación explícita del propietario.
- No se borra la versión, el Site, el usuario Auth ni la organización.

