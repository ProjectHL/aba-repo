# Auditoría Dev TI Expert y QA - estado del MVP (2026-08-25)

## Dictamen

El MVP es funcional y listo localmente para un piloto privado con datos sintéticos, pero no está
publicado ni está habilitado para datos clínicos reales. Esta auditoría independiente revisó specs,
evidencia, flujos, controles de acceso y el cierre QA disponible. No modifica servicios ni datos.

## Evidencia vigente

| Control | Estado verificable |
| --- | --- |
| Regresión | 95/95 pruebas en 20 archivos, TypeScript y ESLint aprobados |
| E2E sintético | Auth/recuperación, cliente, evaluación, programa-meta, plan, sesión e informe derivados verificados |
| Informes | métricas, gráficos, impresión y PDF local bajo demanda |
| Seguridad de aplicación | rutas protegidas, membresía pendiente/inactiva bloqueada y contratos Supabase bajo RLS |
| Candidato local | `apps/web/verification/release-20260825-pdf-lazy/`, preflight aprobado |
| Publicación | no ejecutada ni autorizada |

## Flujos disponibles

1. acceso: login, registro, recuperación y restablecimiento;
2. clientes: listado, alta sintética, detalle y ficha familiar;
3. clínica: evaluaciones, programas/metas, reducción de conducta y sesiones atómicas;
4. informes: cliente/período, series, porcentajes, gráficos accesibles, impresión y PDF completo
   minimizado;
5. control de acceso: sesión, salida y estados de membresía.

## Riesgos y decisiones

| Prioridad | Hallazgo | Decisión/recomendación |
| --- | --- | --- |
| P0 | ninguno dentro del alcance sintético | conservar TDD y regresión como gate por cambio |
| P1 de alcance | cumplimiento, consentimiento, retención, responsables, adjuntos y exportación clínica real no tienen contrato cerrado | no ingresar datos reales; completar Slice 03 con asesoría legal y seguridad |
| P1 de release | hosting, URL privada, audiencia y Redirect URLs no están definidos/autorizados | seguir Slice 11 sólo tras decisión explícita del responsable |
| P2 | PDF sin evidencia E2E de descarga y apertura | solicitar autorización para una descarga sintética controlada |
| P2 | QA móvil/teclado/impresión anterior a gráficos/PDF | repetir esos controles para Slice 12 |
| P2 | bundle inicial 286.19 kB gzip; PDF 176.39 kB gzip bajo demanda | aceptar formalmente o diferir gráficos si se ampliará audiencia |
| P2 de producto | “Informe completo” es minimizado: no añade notas, adjuntos, tutores, DOB ni narrativa clínica | conservar el nombre con aclaración sintética o aprobar una política antes de ampliar contenido |

## Dirección recomendada

Primero cerrar QA de gráficos/PDF y la descarga sintética; después resolver o aceptar los P2 y
retomar Slice 11 para definir proveedor, URL privada y audiencia. Producción o datos reales siguen
dependiendo de Slice 03. NestJS se mantiene diferido: no hay evidencia actual que justifique una API
privilegiada.
