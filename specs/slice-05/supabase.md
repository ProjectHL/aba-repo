# Slice 05 / Supabase staging

## Objetivo

Crear una identidad individual aislada en una organización sintética dedicada y permitir activación/desactivación inmediata sin eliminar filas.

## Migración 005 implementada

- `memberships.status text not null default 'active'` con valores `active|inactive`. ✅
- Políticas de organizaciones, clientes, tutores y hermanos exigen `m.status = 'active'`. ✅
- `create_client` sólo considera membresías writable activas. ✅
- `memberships_select_self` se conserva para exponer únicamente el estado propio. ✅
- Cambios de estado se auditan como `membership_activated` o `membership_deactivated`. ✅
- No existen políticas DELETE ni grants administrativos en el cliente web. ✅

Archivo: `supabase/schema/005_membership_status_access_control.sql`.  
Contrato: `supabase/tests/002_membership_revocation.sql`.

## Alta de evaluadora

1. Recibir correo exacto y rol aprobados.
2. Crear identidad Supabase confirmada con contraseña única.
3. Crear organización `Piloto profesional sintético` con `test_run_id` nuevo.
4. Insertar una membresía activa `clinician` o `viewer` según decisión.
5. No usar `user_metadata` para autorización.
6. Verificar que la identidad tenga exactamente una membresía activa.

## Matriz de pruebas

| Caso | Resultado esperado |
| --- | --- |
| sin sesión | cero filas |
| evaluadora activa | sólo su organización |
| evaluadora → organización QA anterior | cero filas y no inferencia |
| `clinician` activo | RPC create aprobada |
| `viewer` activo | create denegada 42501/403 normalizado |
| membresía inactiva con token vigente | cero lectura y cero escritura |
| reactivación autorizada | acceso restaurado sin crear otra membresía |
| integridad | cero huérfanos, cero DELETE policies y auditoría presente |

## TDD

1. Harness SQL falló mientras `status` no existía. ✅
2. Migración mínima añadió estado y actualizó cada política/RPC. ✅
3. Una identidad sintética activa veía 2 clientes; inactiva vio 0 organizaciones, clientes, tutores y hermanos; reactivada recuperó 1 organización y 2 clientes. ✅
4. Advisors no introdujeron errores nuevos de RLS. ✅
5. `001_staging_integrity.sql` y `002_membership_revocation.sql` quedaron verdes. ✅

## Limitaciones

- El advisor de seguridad informa que leaked-password protection está deshabilitada; debe resolverse antes de datos reales o documentarse como riesgo aceptado.
- No se habilita MFA en este corte; se mantiene como gate antes de datos reales.
- Todo dato del piloto es sintético y se archiva lógicamente al finalizar.
