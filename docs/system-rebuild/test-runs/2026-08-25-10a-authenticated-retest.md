# Retest autenticado — Slice 10A, guardado clínico confiable

Fecha: 2026-08-25  
Entorno: `ABA_staging` mediante sesión autenticada existente en navegador local.  
Límite de datos: expediente adulto totalmente ficticio; no se ingresaron datos reales, credenciales,
tokens, correos ni identificadores de usuario.

## Recorrido y confirmación visible

| Etapa | Dato sintético | Resultado en UI |
| --- | --- | --- |
| Expediente | `RT` / `SYNTH-RETEST-A`, fecha ficticia adulta | detalle del cliente abierto y conectado a staging |
| Entrevista inicial | cuatro campos ficticios requeridos | `Borrador sintético guardado.`; contador 1 |
| Programa | `Programa sintético de retest` | `Borrador sintético guardado.`; contador 1 |
| Meta | `Meta sintética de retest`, asociada al programa | `Borrador sintético guardado.`; contador 1 |
| Plan | `Conducta sintética de retest`, unidad Frecuencia | `Borrador sintético guardado.`; contador 1 |

Cada envío produjo una única confirmación de guardado: no apareció `No pudimos guardar el
borrador`, no se reenvió ningún formulario y no hubo duplicación.

## Persistencia y RLS observables

Tras recargar el expediente, las tres áreas mostraron `Conectado a staging` y conservaron:

- entrevista inicial: 1 borrador;
- programa: 1 activo;
- meta: 1 activa;
- plan de conducta: 1 activo, incluida su función ficticia.

La UI declara que estos registros se guardan en Supabase con RLS. No se realizaron migraciones,
cambios de esquema, uso de `service_role`, consultas con privilegios, eliminación ni limpieza de
los registros sintéticos. Permanecen en staging como evidencia autorizada.

## Resultado

El defecto P0 de falso error post-escritura queda **resuelto en retest autenticado** para las cuatro
creaciones de 10A. La siguiente fase es 10D; aún no hay autorización para publicación.
