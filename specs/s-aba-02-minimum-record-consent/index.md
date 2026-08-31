# S-ABA-02 — expediente mínimo y consentimiento

Estado: **implementada en local y Supabase `ABA_staging`; producción/publicación bloqueadas**  
Fecha: 2026-08-30

Gate técnico resuelto: S-ABA-01 se implementó primero y las RLS ahora exigen asignación y
capacidades por estudiante.

## Objetivo

Definir el expediente mínimo del estudiante, el historial no destructivo de antecedentes y un
registro de consentimiento por finalidad. Este contrato no declara validez jurídica ni habilita
datos reales.

## Evidencia

| ID/fuente | Observado o existente | Límite |
| --- | --- | --- |
| E-002–E-004 | iniciales, ID, idioma, nacimiento, familia, convivencia y contexto | contexto hogar/colegio no está persistido |
| E-005–E-006 | diagnósticos, evaluaciones, procedimientos y medicación repetibles | obligatoriedad y semántica exacta no observadas |
| E-007 | ficha muestra estado de consentimiento | no se observa qué lo controla |
| Slice 14 | historia/contexto son drafts en memoria; consentimiento está bloqueado | no simular guardado |
| Slice 03 | consentimiento versionado, granular y revocable | requiere validación jurídica antes de datos reales |
| S-ABA-01 | familia no recibe expediente clínico ni datos crudos | la proyección familiar es separada |

## Clasificación candidata de campos

`R` requerido para crear; `O` opcional; `N` no incluido en el MVP de S-ABA-02.

| Grupo | Campos | Clase |
| --- | --- | :---: |
| identificación minimizada | `clinical_id`, `initials`, `primary_language`, `birth_date` | R |
| contexto base | `living_arrangement` | O |
| tutor/hermano | iniciales; nacimiento opcional; orden | O |
| contexto | adaptaciones de hogar, escolarización, adaptaciones escolares | O |
| diagnóstico reportado | descriptor, fecha opcional, fuente opcional | O |
| evaluación histórica | nombre, fecha opcional | O |
| procedimiento/operación histórica | descriptor, fecha opcional | O |
| medicación histórica | nombre; dosis/prescriptor/inicio/término opcionales | O |
| motivo de consulta | texto estructurado de entrevista inicial | O, referencia al assessment existente |
| consentimiento | finalidad, versión del aviso, estado, otorgante, canal y fechas | O por finalidad |
| identificadores directos | nombre completo, RUT, domicilio, teléfono, correo del estudiante | N |
| adjunto/firma | PDF, imagen, firma electrónica o biométrica | N |

Añadir una fila repetible exige su descriptor principal; no exige que exista al menos una fila.
“Diagnóstico reportado” no certifica ni interpreta clínicamente el diagnóstico.

## Matriz de campo y rol candidata

| Grupo | Supervisor | Coordinador | Terapeuta | Familia |
| --- | --- | --- | --- | --- |
| identificación minimizada | ver/editar | ver; editar con grant `student.edit` | ver | no expediente |
| familia y contexto | ver/editar | ver; editar con grant | ver | no expediente |
| historia clínica | ver/editar | ver; editar con grant | ver | no |
| medicación histórica | ver/registrar corrección | ver; registrar con grant | ver | no |
| consentimiento: estado mínimo | ver/registrar transición | ver | ver estado aplicable | no en este slice |
| evidencia/referencia de consentimiento | ver | ver | no | no |

Las capacidades dependen además de membresía y asignación activas conforme a S-ABA-01.

## Historia no destructiva

- Diagnósticos, evaluaciones, procedimientos y medicamentos son entradas con identidad propia.
- Una corrección crea una versión que referencia la anterior; no sobrescribe ni elimina historia.
- Terminar un medicamento fija `ended_on`; no cambia la entrada a “borrada”.
- Errores se marcan `entered_in_error` con razón no clínica y actor, conservando procedencia.
- No hay DELETE ordinario ni edición silenciosa de entradas históricas.

## Consentimiento candidato

En este MVP es un **registro de referencia**, no un repositorio documental ni una firma:

- una fila por estudiante + finalidad + versión;
- canal y referencia externa opaca opcional, nunca URL pública ni archivo;
- estados `not_recorded`, `pending_review`, `valid`, `revoked`, `expired`, `superseded`;
- transición append-only con actor y timestamps;
- la revocación afecta uso futuro para esa finalidad, no reescribe historia clínica;
- en staging sintético el estado es informativo y no se presenta como consentimiento legal válido.

## Decisiones aprobadas

| ID | Propuesta conservadora | Estado |
| --- | --- | --- |
| D02-01 | aprobar la clasificación R/O/N anterior | aprobada 2026-08-30 |
| D02-02 | usar la matriz de roles anterior y los grants de S-ABA-01 | aprobada 2026-08-30 |
| D02-03 | historia y medicación versionadas, sin overwrite ni DELETE ordinario | aprobada 2026-08-30 |
| D02-04 | consentimiento MVP = referencia versionada; sin archivo, firma o Storage | aprobada 2026-08-30 |
| D02-05 | consentimiento se registra por finalidad, no como booleano global | aprobada 2026-08-30 |
| D02-06 | en staging sintético es informativo; cualquier bloqueo clínico requiere base jurídica aprobada | aprobada 2026-08-30 |
| D02-07 | familia no accede al expediente ni al consentimiento en este slice | aprobada 2026-08-30 |
| D02-08 | usar “diagnóstico reportado” y “descriptor de prescriptor”; no verificar credenciales ni inferir clínica | aprobada 2026-08-30 |
| D02-09 | no incluir identificadores directos ni contactos completos en este MVP | aprobada 2026-08-30 |

Aprobación explícita y autorización de implementación/Supabase registradas el 2026-08-30. El
alcance remoto se limita a `ABA_staging` y fixtures sintéticos; no incluye producción, Storage,
firma, datos reales, Sites ni publicación.

## Entregables

- [frontend.md](frontend.md)
- [backend.md](backend.md)
- [supabase.md](supabase.md)
- [web-publication.md](web-publication.md)
- [bdd.md](bdd.md)

## Definition of Ready

La persistencia, schema, RLS y RPC quedaron verificados con datos sintéticos en `ABA_staging`.
Datos reales, Storage, firma, producción y publicación continúan prohibidos.
