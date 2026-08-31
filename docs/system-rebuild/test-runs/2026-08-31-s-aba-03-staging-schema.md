# S-ABA-03 — gate de schema en ABA_staging

Fecha: 2026-08-31  
Entorno: Supabase `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Datos: exclusivamente sintéticos; esta fase no creó fixtures ni usó datos clínicos reales.

## Resultado

| Gate | Evidencia | Estado |
| --- | --- | --- |
| Preflight | proyecto saludable, dependencias presentes y tablas S-ABA-03 ausentes | verde |
| Migración 018 | historial remoto `20260831162901_s_aba_03_program_lifecycle` | verde |
| Contrato 006 | ejecución sin excepciones | verde |
| RLS/grants | 3/3 tablas con RLS; ledger sin lectura directa; sin DELETE | verde |
| FK indexes | advisor detectó 9 coberturas faltantes; 019 las añadió | verde |
| Migración 019 | historial remoto `20260831163125_s_aba_03_program_lifecycle_fk_indexes` | verde |
| Regresión local final | 34 archivos, 147/147; TypeScript y ESLint verdes | verde |

La lectura final confirmó `3/3` RPC como `SECURITY INVOKER`, `3/3` grants de ejecución sólo para
`authenticated`, cero grants cliente sobre el ledger y cero filas en las tres tablas nuevas antes
del E2E.

## Hallazgo corregido antes de migrar

El preflight TDD encontró que una versión sucesora podía crearse pero no publicarse cuando el
programa ya estaba activo o pausado. Se añadió una prueba focalizada, el control `Publicar versión`
y una transición atómica que instala la nueva versión sin confundirla con `Reactivar`. La versión
anterior queda `superseded`; el programa conserva su estado activo o pausado.

## Advisors

- Seguridad: S-ABA-03 no añadió funciones `SECURITY DEFINER` expuestas. El aviso informativo de
  `program_lifecycle_events` sin políticas es intencional: RLS está habilitado y la tabla no tiene
  grants de lectura; la auditoría se escribe mediante un helper privado revocado.
- Rendimiento: los avisos `unindexed_foreign_keys` de S-ABA-03 quedaron cerrados por 019. Los
  avisos `unused_index` son esperables inmediatamente después de crear índices sobre tablas vacías.
- Avisos preexistentes de otras slices y la protección de contraseñas filtradas no se modificaron
  en este alcance.

## Persistencia y no borrado

Las migraciones son aditivas y no eliminaron, truncaron ni reescribieron registros. No se creó un
fixture mediante privilegios administrativos: la evidencia de identidad, RLS y datos sintéticos
persistentes se obtendrá en el E2E autenticado por UI después de publicar el frontend candidato.

## Gate pendiente

Publicar S-ABA-03 en el sitio staging y ejecutar BDD-03-01–BDD-03-12 con identidades sintéticas. Los
fixtures deben permanecer identificados por `test_run_id`; no se eliminarán al finalizar.
