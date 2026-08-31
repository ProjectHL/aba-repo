# S-ABA-03 — corrección local de validación de ID clínico

Fecha: 2026-08-31  
Alcance: sólo frontend local; datos de prueba estrictamente sintéticos.  
Entorno remoto: no utilizado durante esta corrección.

## Cambio aplicado

La validación de `clinicalId` ahora rechaza un campo que sea por completo un RUT o correo directo,
en vez de rechazar una subcadena numérica interna. Esto conserva la barrera contra identificadores
directos y acepta el fixture aprobado `UV / E2E-SABA03-20260831`.

Archivos de implementación:

- `apps/web/src/features/clients/client-form-schema.ts`
- `apps/web/src/features/clients/client-form.test.tsx`

## TDD y regresión

| Paso | Comando | Resultado |
| --- | --- | --- |
| Rojo | `node .\\node_modules\\vitest\\vitest.mjs run src\\features\\clients\\client-form.test.tsx` | 1 fallo esperado: el fixture exacto era rechazado. |
| Verde enfocado | mismo comando | 9/9 pruebas verdes. |
| Suite | `node .\\node_modules\\vitest\\vitest.mjs run` | 34 archivos, 148/148 pruebas verdes. |
| Tipos | `node .\\node_modules\\typescript\\bin\\tsc --noEmit` | verde. |
| Lint | `node .\\node_modules\\eslint\\bin\\eslint.js .` | verde, sin diagnósticos. |

El gestor de paquetes pidió purgar `node_modules` por una discrepancia de instalación. No se aceptó
ni se ejecutó esa limpieza; todas las verificaciones se hicieron con binarios ya existentes dentro
del proyecto.

## Candidato y preflight

Se creó de manera no destructiva el candidato local
`apps/web/verification/s-aba-03-client-id-validation-20260831`.

El build staging completó. Su chunk principal fue `1,024.43 kB` minificado / `304.29 kB` gzip,
prácticamente igual al P2 `PERF-14-001` ya documentado. El preflight falló porque el Worker generado
requiere el binding `ASSETS` y no cumple el contrato previo de Worker autocontenido (`const FILES =`
y `function decode(value)`). No se publicó el candidato.

## Límites y siguiente paso

- No hubo escritura, consulta ni cambio de schema/RLS/configuración en `ABA_staging`.
- No se creó el fixture ni se ejecutó BDD-03-01–12.
- Antes de publicar o reintentar staging, se requiere autorización explícita y resolver el fallo de
  preflight del Worker sin reemplazar ni borrar artefactos previos.

## Referencias

- `docs/system-rebuild/decisions/2026-08-31-client-id-synthetic-validation-spec.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-v14-e2e-client-create-blocked.md`
