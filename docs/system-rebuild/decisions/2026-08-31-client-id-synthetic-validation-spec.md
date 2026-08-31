# SDD — corrección de validación para fixture S-ABA-03

Fecha: 2026-08-31  
Estado: **aprobado por instrucción explícita de continuar; listo para TDD**

## Alcance

Corregir exclusivamente el falso positivo de la validación local de `clinicalId` que bloqueó el
fixture adulto ficticio `UV / E2E-SABA03-20260831` en staging v14. El cambio pertenece a la capa
frontend de Slice 02, que es propietaria del formulario de alta reutilizado por el E2E de S-ABA-03.

## Evidencia

- Observado: `docs/system-rebuild/test-runs/2026-08-31-s-aba-03-v14-e2e-client-create-blocked.md`.
- Observado: la UI dejó `clinicalId` inválido antes de solicitud remota, con `No ingreses RUT ni
  correos reales`.
- Verificado en código: `apps/web/src/features/clients/client-form-schema.ts` detecta un patrón
  numérico de RUT sin límite de palabra al final del match; puede clasificar una subcadena del ID
  sintético como identificador directo.

## Decisión de contrato

La barrera preventiva seguirá rechazando RUT completos y correos completos en `clinicalId` y en
campos libres. Un match de RUT deberá terminar en un límite de palabra, para impedir que una
subcadena interna de un identificador sintético válido active el rechazo. Por contrato,
`E2E-SABA03-20260831` es válido.

## Viaje y estados

| Dado | Cuando | Entonces |
| --- | --- | --- |
| Usuario autenticado en staging, formulario de alta y datos sintéticos confirmados | Ingresa el fixture exacto y envía una vez | La validación local no muestra error de ID; la creación puede llegar a su frontera remota normal. |
| Mismo formulario | Ingresa un RUT completo o un correo | El campo se mantiene inválido y no se envía creación. |

Estados afectados: `invalid` sólo para identificadores directos completos; `saving`, éxito,
conflicto y error remoto no cambian.

## Contrato, seguridad y capas

- **Frontend (cambia):** ajuste de la expresión de detección y prueba observable del formulario.
- **Backend (sin cambio):** la unicidad y el payload de `clinicalId` permanecen iguales.
- **Supabase (sin cambio):** no hay migración, RPC, RLS ni configuración remota.
- **Publicación web (sin cambio):** un candidato local futuro no autoriza publicar una nueva
  versión.
- La corrección no transmite datos reales, no usa credenciales privilegiadas y no flexibiliza la
  protección frente a RUT/correos completos.

## Criterios de aceptación

1. El esquema acepta `E2E-SABA03-20260831` con el resto del alta sintética válida.
2. El esquema continúa rechazando un RUT completo y un correo.
3. La prueba nueva es roja antes de implementar y verde después.
4. Pruebas completas, typecheck y lint locales quedan verdes.
5. No hay cambios de backend, Supabase, publicación ni despliegue.

## No objetivos y stop conditions

- No cambiar el fixture, relajar la validación de correos/RUT, ni implementar normalización de
  identificadores.
- No crear, borrar ni modificar datos remotos durante el cambio local.
- No publicar Sites ni iniciar BDD hasta autorizar el reintento de staging.

## Siguiente tarea TDD exacta

Añadir una prueba de `createClientFormSchema` que use el fixture válido exacto y falle con la regla
actual; añadir el límite final de palabra mínimo a la alternativa de RUT; ejecutar prueba dirigida,
suite, typecheck y lint sin modificar artefactos existentes.
