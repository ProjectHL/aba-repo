# Slice 11 / Supabase

`ABA_staging` conserva Auth, RLS, grants mínimos y datos exclusivamente sintéticos. No hay
migración, Storage, `service_role`, usuario nuevo ni cambio de configuración autorizado.

Aceptación futura: el smoke privado demuestra autenticación y aislamiento con datos sintéticos sin
exponer secretos. Stop: cualquier cambio remoto requiere aprobación explícita.
