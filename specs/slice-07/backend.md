# Slice 07 / Backend

## Decisión

NestJS permanece diferido. El frontend usa Supabase Auth directamente mediante el puerto `AuthService`.
No se crea endpoint propio para contraseñas y ningún servidor del proyecto recibe o registra el valor.

## Criterio de crecimiento

Reevaluar un backend propio sólo si se requiere invitación administrada, auditoría avanzada, políticas
multi-organización adicionales o integración con un proveedor de correo transaccional.

La recuperación también se resuelve directamente con Supabase Auth: `resetPasswordForEmail` y
`updateUser({ password })`. No se crea endpoint, función Edge ni backend que reciba contraseñas.
