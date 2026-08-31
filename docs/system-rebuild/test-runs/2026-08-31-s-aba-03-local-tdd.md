# S-ABA-03 — TDD y candidato local

Fecha: 2026-08-31  
Datos: exclusivamente sintéticos  
Alcance remoto: ninguno

## Resultado

S-ABA-03 quedó implementada como candidato local: ciclo de vida no destructivo, diseños completos
de adquisición/conducta, versiones sucesoras, repositorio tipado, UI por capacidad y migración SQL
aditiva con RLS. No se conectó ni modificó `ABA_staging`.

## TDD

| Gate | Evidencia |
| --- | --- |
| Rojo | `program-lifecycle.test.ts` falló al no existir el contrato de dominio |
| Verde enfocado | 3 archivos, 20/20 pruebas |
| Regresión final | 34 archivos, 146/146 pruebas |
| TypeScript | `tsc --noEmit`, verde |
| ESLint | verde |
| Build staging aislado | verde |
| Worker autocontenido | 14 archivos embebidos |
| Preflight | 18 archivos inspeccionados, aprobado |

## Artefactos

- Build: `apps/web/verification/s-aba-03-local-20260831-r3/`
- Paquete candidato: `apps/web/verification/package-s-aba-03-local-20260831-r3/dist/`
- Schema: `supabase/schema/018_program_lifecycle.sql`
- Contrato SQL: `supabase/tests/006_program_lifecycle.sql`

## Controles implementados

- Estados `draft`, `active`, `paused`, `achieved` y `discontinued`; terminales sin DELETE.
- Identidad/tipo inmutables y versiones `draft`, `released`, `superseded` internas.
- Activación exige diseño completo; pausa impide considerar el programa activo y conserva historia.
- RLS por `program.view`/`program.edit`, grants explícitos y funciones públicas revocadas a
  `PUBLIC`/`anon`.
- Auditoría separada sin payload clínico; tablas históricas sin grants de cliente.
- UI conserva valores ante error y oculta acciones si falta `program.edit`.

## Límites de la evidencia

El entorno no tiene Supabase CLI ni PostgreSQL local. La revisión inicial fue estructural; el gate
remoto posterior del 2026-08-31 aplicó 018/019 y ejecutó 006 en `ABA_staging`. Una suite frontend
verde todavía no equivale al E2E autenticado por UI.

## P0/P1/P2

- P0/P1 locales: ninguno reproducido.
- Gate de schema staging cerrado: 018/019 aplicadas y contrato 006 ampliado verde. El gate P1
  restante es el E2E autenticado por UI.
- P2: el chunk principal pasó de 1,011,068 a 1,024,284 bytes minificados (+13,216; +1.31%) y queda
  en 304.27 kB gzip. Se conserva `PERF-14-001`.
- P2 preexistente: smoke v13 de S-ABA-01/02 bloqueado por OpenAI Auth 500.

## Próximo escenario

Con autorización separada: publicar el frontend y realizar un E2E sintético supervisor → crear
borrador → activar → pausar → reactivar → crear y publicar sucesora → lograr o
descontinuar, seguido por denegaciones de coordinador sin grant, terapeuta y no asignado.
