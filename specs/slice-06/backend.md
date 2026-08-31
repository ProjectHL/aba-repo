# Slice 06 / Backend

NestJS continúa diferido. El frontend nunca recibe `service_role`, secreto OAuth ni permisos administrativos.

En el MVP, la aprobación de una profesional es una operación administrativa fuera del navegador:

1. la profesional inicia con Google y crea su identidad Auth;
2. una persona administradora verifica el correo por un canal acordado;
3. se inserta una única membresía `clinician` en la organización sintética;
4. la revocación usa `memberships.status = 'inactive'`, nunca DELETE.

Una consola de administración propia se evaluará cuando exista más de una persona encargada de altas o un volumen repetitivo de invitaciones.
