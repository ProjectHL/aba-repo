# Handoff — Slice 08 / Cartografía frontend

Fecha: 2026-08-18

## Entregado

- Workspace de cliente con cinco áreas navegables.
- Formularios de referencia en diálogos sin guardado engañoso.
- Simulación visual de registro de sesión.
- Ruta protegida `/informes` y navegación activa desde el encabezado.
- Vista responsive basada en shadcn/Tailwind.
- Regresión de 56 pruebas y artefacto staging verificado.
- Sites versión 10 privada publicada.

## Archivos principales

- `apps/web/src/features/clients/client-detail-page.tsx`
- `apps/web/src/features/reports/reports-page.tsx`
- `apps/web/src/components/app-shell.tsx`
- `apps/web/src/App.tsx`
- `specs/slice-08/`

## Corrección transversal

El build estricto encontró que la función inicial de `unsubscribe` infería `() => undefined`,
incompatible con el contrato `() => void` retornado por Auth. Se añadió la anotación explícita sin
cambiar el comportamiento.

## Próxima spec recomendada

**Slice 09 / Evaluación conductual vertical.**

Debe implementar de punta a punta y con TDD:

1. Entrevista inicial editable y persistente.
2. Evaluación de preferencias con elementos repetibles.
3. Registro ABC de evaluación funcional.
4. Borradores, estados vacío/cargando/error y reintento.
5. Tablas, RLS, RPC/contratos Supabase y trazabilidad separados de frontend.
6. Auditoría sintética y publicación de staging.

No conviene intentar adquisición, reducción, sesiones y reportes a la vez. La evaluación es la
primera columna vertical que convierte las vistas actuales en producto comprobable.

## Regla de datos

El Site sigue siendo exclusivamente sintético. La cartografía visual no modifica el NO-GO para
datos de pacientes.
