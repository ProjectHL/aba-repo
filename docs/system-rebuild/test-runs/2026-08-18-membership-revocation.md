# Test run: revocación reversible de membresía

Fecha: 2026-08-18  
Ambiente: Supabase staging `arfwuctpwnnuhdgjtxaa`  
Datos: exclusivamente identidades y registros sintéticos existentes.

## Ciclo TDD

1. Rojo: `002_membership_revocation.sql` falló con `memberships.status is missing`.
2. Verde: se aplicó la migración `membership_status_access_control`.
3. Regresión: integridad general y contrato de revocación pasaron.

## Prueba conductual

Se utilizó una membresía sintética `clinician` con una sola organización activa.

| Estado | Organizaciones visibles | Clientes visibles | Tutores visibles | Hermanos visibles |
| --- | ---: | ---: | ---: | ---: |
| activa inicial | 1 | 2 | no medido | no medido |
| inactiva, mismo `auth.uid()` | 0 | 0 | 0 | 0 |
| reactivada | 1 | 2 | no medido | no medido |

La propia fila de membresía continuó visible durante la revocación, por diseño. Esto permite informar el estado sin exponer datos clínicos u organizaciones. El estado final quedó `active` y se registraron dos eventos de auditoría.

## Contratos

- `supabase/tests/001_staging_integrity.sql`: PASS; 4 clientes sintéticos, todos archivados, 5 membresías.
- `supabase/tests/002_membership_revocation.sql`: PASS.
- Políticas DELETE: 0.
- Migraciones remotas: 001–005 presentes.

## Advisors

- Seguridad: sin errores RLS nuevos; permanece el warning de leaked-password protection deshabilitada.
- Rendimiento: índice de auditoría aún sin uso, nivel informativo; se conserva porque el sistema está recién iniciado y está prohibido borrar.

## Gate

La revocación está aprobada. El acceso profesional continúa bloqueado hasta recibir correo exacto, confirmar rol y autorizar invitación. El piloto sigue siendo 100% sintético; no se autoriza información real o histórica de pacientes.
