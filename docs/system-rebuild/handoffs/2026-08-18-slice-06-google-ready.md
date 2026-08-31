# Handoff: Google listo en código, proveedor pendiente

Fecha: 2026-08-18  
Estado: **frontend verde y publicado en privado; bloqueo externo en Google Cloud/Supabase**.

## Resultado

- La profesional podrá crear/conectar su identidad con una cuenta Google personal.
- Una identidad nueva no obtiene organización ni rol automáticamente.
- `pending` e `inactive` bloquean toda la aplicación clínica.
- Sólo una membresía activa autoriza Clientes.
- La puerta pública se habilitará únicamente después del smoke OAuth.

## Brújula

| Categoría | Avance | Estado |
| --- | ---: | --- |
| Spec 06 | 100% | completa |
| Botón Google | 100% | implementado |
| Publicación privada del botón | 100% | verificada en navegador |
| Estado pendiente/inactivo | 100% | implementado |
| Regresión frontend | 100% | 48/48 |
| Google Cloud OAuth | 0% | requiere configuración del propietario |
| Google en Supabase | 0% | actualmente deshabilitado |
| Publicación pública | 0% | bloqueada hasta smoke OAuth |

No compartir el Client Secret por chat. Configurarlo directamente en Supabase Dashboard y avisar cuando Google aparezca habilitado.
