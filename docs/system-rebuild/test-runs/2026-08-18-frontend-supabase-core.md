# Test run: núcleo Frontend Supabase

Fecha: 2026-08-18  
Entorno: `apps/web`, Node.js 24, build Vite modo staging.

## Resultado

- Vitest: 10 archivos, 30 pruebas, todas aprobadas.
- TypeScript: aprobado sin errores.
- ESLint: aprobado sin errores ni advertencias.
- Build: aprobado en `apps/web/verification/build-20260818-slice02`.
- Escaneo de credenciales secretas/JWT heredado: cero coincidencias.
- Advertencia no bloqueante: bundle JavaScript de 685.22 kB; considerar code splitting antes de producción.

## Cobertura funcional

- configuración de URL y clave publicable;
- inicialización y liberación de sesión;
- login, error genérico y foco accesible;
- guards, retorno interno seguro y 404;
- contratos Supabase y normalización de errores;
- listado loading/vacío/éxito/filtro/error/reintento;
- validación Zod y fecha no futura;
- alta sin doble envío, conflicto de ID y navegación con replace;
- detalle, not-found indistinguible y error recuperable.

## Evidencia remota adicional

La migración `guardian_birth_date` preservó el campo observado en el formulario. Se creó un registro sintético archivado con `test_run_id` `88888888-8888-4888-8888-888888888888`; la fecha de tutor y el evento de auditoría fueron verificados. No se borró ningún registro.

## Pendiente

Crear mediante un flujo Auth soportado un usuario sintético de staging y asignar su membresía; después ejecutar E2E real login → listado → alta → detalle. No usar SQL directo para fabricar credenciales de acceso.
