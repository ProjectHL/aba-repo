# Slice 04 / Publicación privada

## Estado

Versión 6 desplegada en privado y smoke HTTP aprobado el 2026-08-18. Acceso owner-only confirmado: cero visitantes externos y cero grupos. La incorporación de la psicóloga sigue pendiente de recibir su correo exacto.

## Objetivo

Guardar y desplegar una versión nueva del candidato QA mediante Sites, inicialmente con acceso exclusivo del propietario.

## Secuencia

1. Validar el código exacto y congelarlo en control de versiones.
2. Publicarlo en el repositorio de origen de Sites sin persistir credenciales.
3. Empaquetar el build correspondiente al mismo commit.
4. Guardar una versión nueva; Sites v1 queda como evidencia histórica y no se elimina.
5. Desplegar con acceso privado owner-only.
6. Confirmar estado, URL, rutas SPA, noindex y headers.
7. Documentar el resultado antes de agregar evaluadores.

## Compatibilidad Vite en Sites

- El smoke de las versiones 3 a 5 demostró que el Worker se ejecuta, pero el binding `ASSETS` permanece vacío y devuelve 404 incluso con el paquete oficial.
- Para este frontend Vite se permite generar un Worker autocontenido desde el build aprobado: incorpora únicamente `index.html`, assets versionados y archivos públicos necesarios, sin secretos ni datos de dominio.
- El generador y su verificador deben quedar versionados. El Worker conserva fallback SPA, 404 real para assets ausentes y todos los headers de seguridad.
- El preflight debe rechazar cualquier artefacto que no contenga la URL pública del proyecto Supabase staging; el build oficial se genera explícitamente con `--mode staging` para cargar `.env.staging.local`.
- Esta adaptación no cambia Supabase como fuente de verdad ni agrega persistencia en Sites.
- La versión 6 usa el Worker autocontenido generado y verificado; las versiones 3 a 5 se conservan como evidencia no destructiva de intentos que devolvían 404.

## Acceso de evaluadora

- No modificar la allowlist hasta recibir el correo exacto y confirmación del usuario.
- Agregar sólo ese correo; no habilitar acceso público ni grupos.
- La invitación debe acompañarse de reglas de datos sintéticos y un guion sin casos reconocibles.
- No generar bypass tokens ni compartir credenciales administrativas.

## Criterio de aceptación

- El despliegue es privado, exitoso y corresponde al candidato QA.
- La URL activa no expone el contenido sin la barrera de Sites.
- La aplicación conserva Supabase Auth como segunda barrera.
- `Cache-Control: no-store`, CSP, HSTS, noindex y fallback SPA se comprueban en vivo cuando el acceso técnico lo permita.
- Ninguna acción borra versiones, filas, usuarios o recursos.
