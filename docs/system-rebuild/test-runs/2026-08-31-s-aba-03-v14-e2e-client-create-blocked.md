# S-ABA-03 v14 — intento E2E autenticado bloqueado en alta de fixture

Fecha: 2026-08-31  
Entorno: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`) mediante la versión 14 publicada.  
Autenticación: sesión existente en el navegador; no se inspeccionaron credenciales, tokens ni datos de cuenta.  
Límite de datos: sólo fixture adulto ficticio; no se usaron datos reales ni de menores.

## Resultado ejecutivo

El alta del fixture solicitado no llegó a Supabase. La validación local del formulario bloqueó el
ID clínico sintético `E2E-SABA03-20260831` antes de efectuar una solicitud de creación. Por tanto,
no existe `client_id` para este intento y BDD-03-01–12 sigue sin ejecutar.

## Escenario observado

| Dado | Cuando | Entonces | Evidencia | Estado |
| --- | --- | --- | --- | --- |
| Usuario autenticado en staging; `/clientes/nuevo`; banner visible de datos exclusivamente sintéticos | Se ingresan `UV`, `E2E-SABA03-20260831`, `1990-05-14`, `persona adulta independiente`, idioma Español y confirmación sintética | Al pulsar `Continuar con datos sintéticos`, la ruta no cambia y aparece `Revisa los campos obligatorios antes de continuar.` | UI v14, 2026-08-31 | bloqueado |
| Mismo formulario | Se inspecciona el error visible asociado al campo | El campo `clinicalId` queda inválido con el texto `No ingreses RUT ni correos reales` | UI v14; `apps/web/src/features/clients/client-form-schema.ts` | reproducido |

## Diagnóstico acotado

La regla local `directIdentifierPattern` puede interpretar un subsegmento numérico de
`E2E-SABA03-20260831` como identificador directo. Es un falso positivo observado de la validación
del cliente; no se modificó código, especificación, schema ni configuración remota.

## Persistencia, RLS y no borrado

- No se realizó escritura en `ABA_staging`; no hay creación del cliente ni registros derivados.
- No se ejecutaron consultas Supabase adicionales: no había `client_id` que verificar.
- No se borró, archivó, truncó, movió ni limpió ningún fixture o artefacto.

## Brecha y retest mínimo

- **P1 provisional — alta bloqueada por falso positivo:** impide iniciar el E2E con el identificador
  sintético autorizado. No debe cambiarse el ID ni el validador sin decisión explícita y, si se
  corrige código, sin actualizar primero las especificaciones afectadas y añadir una prueba roja.
- Retest mínimo tras una corrección aprobada: enviar una sola vez el mismo fixture exacto y comprobar
  la navegación al detalle antes de continuar BDD-03-01.

## Estado BDD

BDD-03-01–12: no ejecutados; no se infieren resultados a partir de los gates local, schema o
publicación previos.

## Referencias

- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-sites-v14-auth-handoff.md`
- `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-staging-schema.md`
- `apps/web/src/features/clients/client-form-schema.ts`
