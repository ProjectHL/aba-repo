# Especificación de publicación web para pruebas

## Estado

Contrato general aprobado para planificación. La spec ejecutable está en `specs/slice-02/web-publication.md`; no autoriza despliegue ni creación de cuentas externas.

## Objetivo

Publicar un entorno `staging` accesible por URL para probar altas y listados con registros sintéticos, manteniendo autenticación, aislamiento y trazabilidad.

## Topología

- Web estática Vite candidata a Sites privado, sujeta a prueba de empaquetado y autorización.
- Supabase administrado como Auth/PostgreSQL.
- El frontend se publica separado de Supabase; NestJS no forma parte del despliegue Slice 02.

## Entornos

| Entorno | Uso | Datos | Acceso |
|---|---|---|---|
| local | desarrollo y TDD | sintéticos | equipo local |
| staging | prueba por URL | sintéticos versionados | usuarios de prueba autenticados |
| production | fuera del alcance inicial | ninguno hasta aprobación | por definir |

## Seguridad de staging

- El staging será privado por defecto; Supabase Auth y RLS siguen controlando identidad y acceso de aplicación.
- No habilitar escritura anónima.
- Configurar URLs de redirección de Auth exactas para staging.
- El frontend recibe sólo URL de Supabase y clave publicable; grants y RLS son obligatorios.
- Añadir encabezados de seguridad, HTTPS, rate limiting y logs sin PII.

## Flujo de validación de registros

1. Iniciar sesión con una cuenta de prueba.
2. Abrir `/clientes` y registrar el identificador de ejecución sintético.
3. Crear un cliente ficticio mediante `/clientes/nuevo`.
4. Confirmar respuesta Data API/RPC y aparición en el listado.
5. Recargar la página para verificar persistencia.
6. Iniciar sesión con otro usuario/organización y confirmar aislamiento.
7. Marcar el registro como archivado si la función está aprobada; no borrarlo.

## Pipeline mínimo

1. Typecheck, lint y pruebas unitarias.
2. Build del frontend.
3. Pruebas de contrato.
4. Aplicación controlada de migraciones de staging.
5. Configuración de Supabase staging y despliegue web.
6. Smoke test de login, creación, listado y aislamiento.
7. Publicar un informe dentro de `docs/system-rebuild/test-runs/` con versión, URL, resultados y evidencias sin datos sensibles.

## Criterios de aceptación

- La URL carga por HTTPS y no expone secretos.
- Un usuario autenticado crea un registro sintético y lo ve después de recargar.
- Otro usuario fuera de la organización no ve ni modifica ese registro.
- Un visitante anónimo no puede leer ni escribir datos de dominio.
- Los fallos Data API/RPC se muestran de forma accesible y no revelan SQL ni información interna.
- El despliegue puede repetirse desde artefactos versionados sin escribir fuera de `aba 2` durante el trabajo local.

## Pendientes de decisión

- Proveedor de hosting web.
- Dominio/subdominio de staging.
- Método de invitación para testers.
- Presupuesto, región y requisitos de residencia de datos.
