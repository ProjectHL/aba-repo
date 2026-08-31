# Slice 06: acceso público con Google y aprobación clínica

Estado: frontend y autorización implementados; activación OAuth externa y publicación pública pendientes.  
Objetivo: permitir que la profesional conecte una cuenta personal de Google desde una puerta pública, sin convertir autenticación en autorización clínica.

| Spec | Responsabilidad |
| --- | --- |
| `frontend.md` | botón Google, callback y estados pendiente/inactivo |
| `backend.md` | límites administrativos; NestJS continúa diferido |
| `supabase.md` | OAuth, identidad, membresía y RLS |
| `web-publication.md` | cambio privado → público y smoke |

## Regla central

Google crea o conecta una identidad. Sólo una membresía `active` concede acceso a una organización. Una identidad nueva, aunque esté autenticada, ve cero datos y una pantalla de acceso pendiente.

## Gate de salida

- Proveedor Google configurado con credenciales administradas fuera del frontend.
- Botón `Crear cuenta o continuar con Google` verificado en staging.
- Identidad sin membresía ve cero datos y no puede crear.
- Membresía inactiva queda bloqueada con token vigente.
- Site público, pero toda ruta clínica continúa protegida por Supabase Auth + RLS.
- Profesional aprobada manualmente como `clinician` en una organización sintética.
- Datos reales continúan prohibidos.
