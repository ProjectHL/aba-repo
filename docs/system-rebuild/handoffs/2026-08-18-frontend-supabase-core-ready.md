# Handoff: núcleo Frontend Supabase listo

Fecha: 2026-08-18  
Estado: integración local completa; E2E remoto pendiente.

## Entregado

- `@supabase/supabase-js` fijado en `2.111.0` y lockfile actualizado.
- Cliente singleton tipado con clave publicable.
- AuthProvider, login, guards, cierre de sesión, retorno seguro y 404.
- ClientsRepository como frontera única de Data API/RPC.
- Listado con estados y AbortController.
- Formulario Zod, prevención de doble envío y error de conflicto estable.
- Alta mediante `public.create_client` y detalle por Data API/RLS.
- Fecha de nacimiento opcional de tutor añadida mediante migración reproducible.

## Brújula Slice 02

| Categoría | Avance |
| --- | ---: |
| Supabase/schema/RLS | 100% |
| Auth y navegación frontend | 90% |
| Clientes frontend | 85% |
| E2E staging | 20% |
| Publicación web | 10% |
| Slice 02 total ponderado | 74% |

## Siguiente unidad

1. Crear un usuario Auth exclusivamente sintético mediante API/Dashboard soportado.
2. Insertar su membresía de staging sin tocar producción.
3. Ejecutar E2E real login → listado → alta → detalle.
4. Archivar el cliente de prueba; nunca eliminarlo.
5. Corregir cualquier diferencia RLS/Data API y repetir advisors.
6. Iniciar la spec `specs/slice-02/web-publication.md` sólo después de los gates.

NestJS permanece diferido a crecimiento.
