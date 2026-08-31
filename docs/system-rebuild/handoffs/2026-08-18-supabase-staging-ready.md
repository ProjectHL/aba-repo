# Handoff: Supabase staging listo

Fecha: 2026-08-18  
Estado: G-01 Supabase completado; siguiente unidad: integración Frontend.

## Entorno autoritativo

- Organización: `ABA`
- Proyecto exclusivo: `ABA_staging`
- Referencia: `arfwuctpwnnuhdgjtxaa`
- Región: `sa-east-1`
- Proyecto previo `ABA_project`: intacto y fuera de alcance.

## Resultado implementado

- Seis tablas `public`: organizaciones, membresías, clientes, tutores, hermanos y auditoría.
- RLS activo en todas las tablas, grants mínimos y sin políticas `DELETE`.
- RPC `public.create_client` como `SECURITY INVOKER`, organización derivada desde la membresía.
- Trigger privado de auditoría, sin ejecución pública.
- Dos migraciones remotas reproducibles desde `supabase/schema/`.
- Tipos generados en `apps/web/src/integrations/supabase/database.types.ts`.
- Configuración local de staging en archivo ignorado `apps/web/.env.staging.local`; ejemplo versionable separado.

## Evidencia TDD

La prueba roja inicial confirmó que el proyecto estaba vacío. Tras las migraciones pasaron:

1. alcance de administrador;
2. derivación de organización en RPC;
3. creación atómica de cliente y familia;
4. auditoría y atribución de actor;
5. organización inmutable;
6. lector sin escritura;
7. aislamiento entre organizaciones.

La prueba se ejecutó en una transacción aislada y dejó cero registros sintéticos persistentes. El asesor de seguridad terminó sin hallazgos. El asesor de rendimiento sólo marca dos índices sin uso, esperado mientras las tablas permanezcan vacías.

## Siguiente spec

Ejecutar `specs/slice-02/frontend.md` con TDD:

1. instalar y encapsular `@supabase/supabase-js`;
2. validar variables de entorno sin imprimir valores;
3. implementar sesión/login;
4. crear `ClientsRepository` tipado;
5. conectar listado y alta mediante `public.create_client`;
6. crear usuarios y membresías sintéticos de staging para E2E, sin borrar registros.

NestJS continúa diferido a `specs/growth/nestjs-api.md`.
