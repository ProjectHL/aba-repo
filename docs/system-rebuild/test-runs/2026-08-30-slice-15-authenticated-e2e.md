# E2E autenticado sintético — Slice 15

Fecha: 2026-08-30  
Entorno: `ABA_staging` (`arfwuctpwnnuhdgjtxaa`)  
Autenticación: sesión existente del responsable, sin inspeccionar credenciales ni tokens  
Datos: adulto completamente ficticio; ningún dato clínico real

## Identificador sintético

| Campo | Valor |
| --- | --- |
| Iniciales | `QZ` |
| ID clínico | `E2E-SYNTH-BETA-AUG` |
| Fecha ficticia de nacimiento | `1990-04-15` |
| Convivencia | adulto ficticio independiente |

El primer ID propuesto contenía una secuencia numérica larga y fue rechazado por la protección
contra identificadores directos antes de escribir. Se corrigió a un ID alfabético sintético y se
realizó una sola creación efectiva.

## Cadena clínica persistida

| Etapa | Evidencia UI después de guardar |
| --- | --- |
| Cliente | detalle activo con iniciales e ID clínico sintético |
| Entrevista inicial | `1 borrador(es)` |
| Evaluación de preferencias | `1 borrador(es)` y estado `Guardado en staging con RLS` |
| Evaluación funcional | `1 borrador(es)` y estado `Guardado en staging con RLS` |
| Programa de adquisición | `1 programa(s) activo(s)` |
| Meta de adquisición | `1 meta(s) activa(s)` asociada al programa |
| Plan de conducta | `1 plan(es) activo(s)`, unidad `frequency` |
| Sesión clínica | `Sesión sintética guardada de forma atómica` y contador `1` |

## Métricas de entrada

- Conducta `Pausa ficticia en tarea`: `3` ocurrencias.
- Meta `Completar secuencia ficticia de tres pasos`: `8` correctos y `2` incorrectos.
- Consistencia esperada: `8 / (8 + 2) = 0.8 = 80.0%`.

## Informes derivados

| Ruta | Resultado observado |
| --- | --- |
| `/informes` | 1 sesión, serie de conducta `2026-08-30: 3`, `8 correctos · 2 incorrectos`, `80.0%` |
| `/informes/evaluacion` | entrevista, preferencias y evaluación funcional persistidas |
| `/informes/completo` | evaluación, programa/meta, plan, 1 sesión, serie `3` y progreso `80.0%` |

Después de recargar `/informes/completo`, el cliente seleccionado y todos los registros y métricas
continuaron disponibles. Esto revalida persistencia remota bajo la sesión autenticada y lecturas
del frontend con RLS; no se ejecutó una consulta privilegiada ni se capturaron logs/API status.

## Resultado

- Flujo autenticado completo hasta Informes: **PASS**.
- Consistencia exacta de métricas: **PASS**.
- Persistencia tras recarga: **PASS**.
- Errores UI de escritura o falsos negativos: ninguno reproducido.
- PDF físico: no ejecutado; requiere autorización separada.

## Límites y no eliminación

- No se modificaron schema, RLS, RPC, Auth, Storage, permisos ni configuración remota.
- No se usó `service_role`, no se inspeccionaron credenciales y no se usaron datos reales.
- No se descargó, escribió ni inspeccionó un PDF.
- Los registros sintéticos permanecen en staging según la autorización; no se borraron,
  archivaron, movieron ni sobrescribieron datos previos.

