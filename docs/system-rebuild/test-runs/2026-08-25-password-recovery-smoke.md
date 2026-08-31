# Smoke de recuperación de contraseña — validación de responsable

Fecha: 2026-08-25  
Entorno: `ABA_staging` / navegador local.  
Fuente de evidencia: confirmación directa del responsable durante la sesión de QA.

## Resultado verificado

- Supabase envió el enlace directo de recuperación.
- El enlace permitió llegar al cambio de contraseña.
- El flujo completo de recuperación fue validado por el responsable.

No se registran correos, direcciones, tokens, enlaces completos ni contraseñas. La aplicación
mantiene la barrera de ruta pública: una sesión autenticada que visita `/recuperar-acceso` vuelve a
Clientes, como se observó durante este smoke.

## Límites

Esta evidencia no autoriza publicar ni modificar Redirect URLs. No se eliminó ningún dato ni se
copiaron secretos de autenticación al repositorio.
