# Slice 09 / Backend

NestJS continúa fuera de alcance. El frontend accede a Supabase Data API con clave publicable,
sesión Auth y RLS. Una API propia se evaluará sólo con los criterios de `growth/nestjs-api.md`.

La atomicidad del lote 04 se resuelve con una función Postgres invocadora expuesta como RPC. No se
incorpora servidor propio, Edge Function ni `service_role`.

## Lote 05A

No se añade backend propio. El repositorio frontend consulta la Data API con la sesión Auth del
usuario y RLS como límite de autorización. Los cálculos del informe se hacen en memoria desde las
filas autorizadas; no hay endpoint, RPC, tabla de reportes ni caché persistente nueva.
