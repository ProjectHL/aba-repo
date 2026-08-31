# Handoff: Slice 02 Supabase-first

Fecha: 2026-08-18  
Estado: arquitectura simplificada y lista para iniciar TDD local.

## Flujo vigente

```text
React + shadcn/ui → Supabase Auth → Data API/RPC → PostgreSQL/RLS
```

## Primera unidad

`specs/slice-02/supabase.md`

## Orden

1. Verificar CLI y runtime local disponibles.
2. Escribir pruebas RLS negativas.
3. Crear migración mediante Supabase CLI.
4. Implementar esquema, grants, políticas y RPC `create_client`.
5. Generar tipos.
6. Integrar `ClientsRepository` en React.
7. Implementar Auth y completar E2E local.
8. Publicar staging sólo tras cinco gates y autorización.

## NestJS

No se implementa. Consultar `specs/growth/nestjs-api.md` únicamente cuando aparezca un disparador de crecimiento verificable.

## Guardas

- Todo dentro de `C:\Users\Moonlabpc\Desktop\aba 2`.
- Sin borrado, datos reales, secretos o recursos remotos no autorizados.
- Prueba roja antes de implementar.

