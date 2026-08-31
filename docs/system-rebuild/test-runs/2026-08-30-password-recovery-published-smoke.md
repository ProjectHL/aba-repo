# Smoke publicado — recuperación de contraseña

Fecha: 2026-08-30  
Entorno: `ABA_staging` privado  
Fuente de evidencia: confirmación directa del responsable

## Resultado

- Se solicitó un vínculo nuevo después de corregir `Site URL` y `Redirect URLs`.
- El vínculo nuevo permitió completar la recuperación de contraseña.
- El responsable confirmó que recuperó la contraseña.
- No se registraron correo, contraseña, token, enlace completo ni sesión.

## Alcance demostrado

El flujo publicado de solicitud, redirect y actualización de contraseña quedó validado por el
responsable. Esta evidencia cierra el defecto que enviaba los vínculos a localhost.

## Límites

- No se verificó en esta evidencia un inicio de sesión posterior con la contraseña nueva.
- No hubo cambios adicionales de Supabase, usuarios, schema, RLS, RPC, Storage o datos.
- No se usaron datos clínicos reales.

