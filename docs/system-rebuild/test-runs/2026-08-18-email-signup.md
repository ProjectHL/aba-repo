# QA Slice 07: registro con correo

Fecha: 2026-08-18  
Ambiente: staging privado; datos exclusivamente sintéticos.

## Resultado

- Vitest: 54/54 PASS.
- TypeScript: PASS.
- ESLint: PASS.
- Build staging y preflight de seguridad: PASS.
- Ruta `/registro` incluida en el fallback SPA.
- Supabase Auth: email habilitado, signup habilitado y confirmación obligatoria.
- No se creó ninguna cuenta real durante QA.

## Cobertura

- Login abre registro.
- Doble contraseña y mínimo de 12 caracteres.
- Contraseñas diferentes no llaman a Supabase.
- Error remoto genérico sin filtrar existencia de cuentas.
- Registro aceptado solicita confirmar el correo y no concede acceso clínico.
- Retorno de confirmación limitado al mismo origen.

## Estado

GO para staging privado. La apertura pública continúa separada y requiere confirmar el flujo real de
correo con la cuenta de la profesional, además del gate de publicación de acceso.

