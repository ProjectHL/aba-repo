# Test run — recuperación de contraseña

Fecha: 2026-08-24  
Proyecto objetivo: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Datos: exclusivamente sintéticos

## Alcance

- Solicitud de vínculo desde `/recuperar-acceso`.
- Redirección de recuperación limitada a `/recuperar-contrasena` del mismo origen.
- Cambio sólo tras el evento `PASSWORD_RECOVERY` de Supabase Auth.
- Validación local de contraseña de 12 caracteres y confirmación.
- Cierre de la sesión temporal tras actualizar la contraseña.

## Resultados

| Gate | Resultado |
| --- | --- |
| Pruebas de recuperación | PASS — 5/5 |
| Contrato de servicio Auth | PASS — 3/3 |
| Regresión frontend completa | PASS — 87/87 |
| TypeScript | PASS |
| ESLint | PASS |
| Verificación de UI local | PASS — Login expone el enlace de recuperación |

No se ejecutó `vite build`: reemplaza el contenido de `dist`, contrario a la regla de no borrado.

## Pendiente de configuración y smoke

Antes de probar con una cuenta real en staging, la configuración de Supabase Auth debe incluir la
URL exacta `http://localhost:5173/recuperar-contrasena` (para local) y la URL privada publicada
equivalente dentro de Redirect URLs. No se modificó esa configuración remota en este lote.

El smoke posterior debe confirmar que el correo llega, que el vínculo dispara `PASSWORD_RECOVERY`,
que un vínculo vencido falla de forma genérica y que la nueva contraseña permite iniciar sesión.
