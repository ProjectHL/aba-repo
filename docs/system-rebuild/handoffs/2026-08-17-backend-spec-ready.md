# Handoff de planificación: Backend NestJS listo

Fecha: 2026-08-17  
Estado: supersedido el 2026-08-18; NestJS se trasladó a `specs/growth/nestjs-api.md`.

## Spec activa posterior

`specs/slice-02/backend.md`

## Qué quedó definido

- Límites de módulos y capas NestJS.
- Endpoints, respuestas y envelope de errores.
- Matriz de autorización aprobada.
- JWT asimétrico verificado mediante JWKS, con rotación de `kid` contemplada.
- Validación estricta y propiedades adicionales rechazadas.
- Creación y auditoría atómicas bajo `SECURITY INVOKER` y RLS.
- Estrategia TDD, orden de implementación y fuera de alcance.

## Dependencia que no debe falsearse

La spec Supabase está aprobada, pero sus migraciones, grants y políticas aún no se han ejecutado ni verificado. Backend puede avanzar con contratos y dobles de prueba; no puede declarar integración completa hasta recibir:

1. migración versionada;
2. tipos generados;
3. nombre y firma de la operación atómica;
4. pruebas RLS positivas y negativas;
5. evidencia de advisors sin hallazgos críticos.

## Primer test esperado

Un request de creación con una propiedad desconocida debe fallar con `400`, un `ApiError` estable y sin incluir el valor enviado en respuesta o logs.

## Próximo handoff

Cuando el contrato HTTP y OpenAPI estén verificados, transferir a `specs/slice-02/frontend.md`. No conectar frontend directamente a tablas de dominio.

## Reglas heredadas

- Trabajo exclusivamente dentro de `C:\Users\Moonlabpc\Desktop\aba 2`.
- Sin borrado, datos reales, secretos, conexiones remotas o publicación no autorizada.
- Prueba roja antes de implementación.
