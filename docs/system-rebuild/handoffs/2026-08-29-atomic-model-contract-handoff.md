# Brújula — contrato atómico de visión ABA

Fecha: 2026-08-29

## Estado ejecutivo

Se incorporó, sólo como documentación, el modelo atómico de la visión de negocio entregada en APP ABA.docx. El documento fuente fue clasificado sin convertir preguntas, recomendaciones o ambigüedades en decisiones de producto. No hubo cambios de código, Supabase, permisos, datos, publicación ni pruebas de producto.

| Categoría | Avance verificable | Estado |
| --- | --- | --- |
| Fuente de visión ABA | extraída y normalizada | documentada |
| Modelo mental y dominios | roles, expediente, programas, medición, gráficos y colaboración | documentados |
| Backlog de specs | diez slices atómicos propuestos | pendiente de priorización y aprobación |
| Implementación | sin cambio | no autorizada |
| Slice 15 | candidato local previo | conserva smoke/PDF/RLS pendientes de autorización |
| Publicación | sin cambio | no autorizada |

## Evidencia enlazada

- docs/system-rebuild/atomic-model-aba-contract.md — artefacto de contrato creado en este hito.
- docs/system-rebuild/handoffs/2026-08-29-brujula-slice-15-local-candidate.md — continuidad vigente de Slice 15.
- docs/system-rebuild/test-runs/2026-08-29-slice-15-local-release-loop.md — evidencia local más reciente de Slice 15.
- specs/slice-15-complete-clinical-reports-pdf/ — contrato aprobado de Slice 15.

## P0/P1/P2

- P0/P1: no se ejecutó producto ni se declara una ausencia nueva; se conserva el estado local previo sin P0/P1 reproducibles en la evidencia de Slice 15.
- P2 abierto: PERF-14-001, bundle principal de 296.24 kB gzip, heredado del candidato local.
- Deuda de gobernanza: specs/index.md sigue afirmando que Slice 12 es la continuación activa, contradiciendo evidencia posterior de Slices 13–15. No se corrigió para evitar ampliar el alcance sin una revisión deliberada.
- Metadato desfasado: el BDD de Slice 15 conserva lenguaje de propuesta pese a contar con evidencia posterior de ejecución; los resultados vigentes están en test-runs.

## Límites vigentes

- Sólo fixtures sintéticos y anonimización; no datos clínicos reales.
- No desplegar, publicar, tocar producción ni conectar credenciales de producción.
- No cambiar schema, RLS, RPC, Storage, Auth o permisos existentes sin una spec aprobada.
- No implementar las capacidades documentadas en el modelo atómico sin resolver sus decisiones bloqueantes y aprobar las cuatro capas.
- No tratar el mapa de flujo con IA, offline, consentimiento, exportaciones o chat como aprobados.

## Siguiente norte

**Único objetivo siguiente:** aprobar y especificar primero S-ABA-01, autorización y acceso por estudiante, porque desbloquea los permisos de expediente, programas, registros, gráficos, chat y familia sin asumir reglas clínicas.

**Autorización requerida:** aprobación explícita para iniciar aba-sdd-spec-first sobre S-ABA-01; esta autorización no incluye implementación, Supabase, IA, offline ni publicación.

**No objetivos:** no resolver S-ABA-02 a S-ABA-10, no corregir specs/index.md, y no realizar el smoke/PDF de Slice 15 salvo autorización independiente.

## Skills y agentes del siguiente chat

1. Cargar aba-sdd-spec-first antes de redactar S-ABA-01.
2. Cargar supabase:supabase y supabase:supabase-postgres-best-practices sólo si la spec aprobada toca Supabase o SQL/RLS.
3. Tras aprobación de la spec, cargar aba-tdd-validation; luego aba-mvp-qa-release-loop para la evidencia de un cambio local aprobado.
4. Cargar brujula al cerrar un gate, hito o handoff.
5. Agente primario: mantiene trazabilidad y no aprueba inferencias por cuenta propia. No hay subagentes activos. La delegación sólo se usa para una subtarea acotada solicitada por la persona usuaria; cada agente queda dentro del workspace, sin borrado/movimiento, datos reales, producción ni despliegue.

## Mensaje inicial sugerido para el próximo chat

> Carga aba-sdd-spec-first. Usa docs/system-rebuild/atomic-model-aba-contract.md como visión de negocio, pero no implementes. Redacta únicamente las cuatro capas y BDD de S-ABA-01 (autorización y acceso por estudiante), resolviendo DEC-ABA-01 y DEC-ABA-02 con preguntas de aprobación explícita. Conserva los límites de datos sintéticos, sin Supabase ni publicación.

