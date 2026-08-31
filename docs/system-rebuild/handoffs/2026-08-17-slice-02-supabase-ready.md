# Handoff final: Slice 02 lista para Supabase TDD

Fecha: 2026-08-17  
Estado: supersedido por `2026-08-18-supabase-first-ready.md`; la spec Supabase continúa activa sin dependencia NestJS.

## Spec activa

`specs/slice-02/supabase.md`

## Objetivo inmediato

Preparar y probar localmente el esquema multi-organización, grants mínimos y políticas RLS antes de crear la API NestJS. El primer resultado verificable debe demostrar aislamiento entre dos organizaciones sintéticas.

## Entrada confirmada

- P-01 a P-06 aprobadas y registradas.
- Frontend base y siete pruebas existentes en verde.
- Modelo mínimo, matriz RLS y criterios de aceptación definidos.
- Esquema dedicado expuesto seleccionado; helpers internos permanecen no expuestos.
- `audit_events` no se consulta desde clientes en Slice 02.

## Orden de ejecución

1. Verificar changelog/documentación y versión de la CLI disponible.
2. Escribir pruebas rojas de aislamiento, grants y ausencia de acceso anónimo.
3. Fijar contrato de tipos, longitudes y normalización con fixtures sintéticos.
4. Crear migración mediante la CLI dentro del workspace.
5. Implementar tablas, índices, grants y RLS mínimos.
6. Ejecutar pruebas, advisors y revisión de seguridad.
7. Registrar evidencia y habilitar el handoff hacia `specs/slice-02/backend.md`.

## Guardas obligatorias

- Todo el trabajo permanece en `C:\Users\Moonlabpc\Desktop\aba 2`.
- No borrar archivos, filas, recursos ni datos.
- No usar `service_role` en el frontend o flujo ordinario.
- No usar `raw_user_meta_data` para autorización.
- No conectar recursos remotos ni instalar herramientas fuera del workspace sin autorización.
- Sólo identidades y datos sintéticos con identificadores únicos de prueba.

## Bloqueo externo conocido

La ejecución puede preparar archivos y pruebas locales. Si requiere descargar la CLI, iniciar contenedores, autenticarse o conectar un proyecto Supabase, debe detenerse y solicitar autorización específica.

## Definition of done del próximo relevo

- Pruebas RLS positivas y negativas verdes.
- Grants y RLS comprobados como capas independientes.
- Migración y tipos versionados dentro del workspace.
- Advisors sin hallazgos críticos.
- Evidencia de ejecución registrada sin secretos ni datos reales.
