# Índice de especificaciones

| Especificación | Responsabilidad | Depende de | Bloquea |
|---|---|---|---|
| `frontend.md` | Pantallas, estados, shadcn/ui y pruebas de interacción | evidencia y contratos | implementación web |
| `backend.md` | Registro de API NestJS diferida | criterios de crecimiento | futura API propia |
| `supabase.md` | Auth, esquema, grants, RLS e índices | modelo aprobado | staging con registros |
| `web-publication.md` | entornos, despliegue y smoke/E2E | las tres specs anteriores | URL de prueba |
| `client-slice.md` | Primer corte frontend de Clientes | frontend | base visual verificable |
| `slice-02-auth-client-persistence.md` | Corte vertical autenticado React → Supabase | decisiones P-01 a P-06 | Clientes persistentes en staging |
| `slice-02/` | Specs ejecutables Supabase-first de frontend, Supabase y publicación | Slice 02 aprobada | implementación TDD por área |
| `slice-03/` | Preparación legal/técnica para datos clínicos en Chile | responsable, dictamen, DPIA y proveedores | cualquier uso de datos reales |
| `slice-04/` | Piloto profesional sintético publicado en privado | QA y Sites | onboarding de evaluadora |
| `slice-05/` | Onboarding individual y sesión profesional sintética | correo/rol aprobados | ejecución del piloto |
| `slice-06/` | Acceso público con Google y aprobación de membresía | proveedor OAuth + RLS | onboarding público seguro |
| `slice-07/` | Registro clásico con correo, doble contraseña y aprobación de membresía | Auth email + RLS | onboarding público alternativo |
| `slice-08/` | Cartografía frontend navegable de las vistas clínicas observadas | catálogo S-04 a S-13 | implementación funcional por módulo |
| `slice-09/` | Producción acelerada de pantallas con contratos Supabase validados por lote | Slice 08 + inventario real de staging | integración clínica persistente |
| `slice-10/` | Cierre guiado por evidencia E2E: confiabilidad, paridad de formularios, exportación y QA; gates 10A–10D verificados | E2E autenticado 2026-08-25 + catálogo S-01–S-13 | preparación de release |
| `slice-11/` | Preparación de release privado del MVP, sin despliegue | candidato local y QA 2026-08-25 | autorización separada de publicación |
| `slice-12/` | Gráficos de línea y progreso para Informes con Chart.js | informe derivado S-12 y datos sintéticos | nuevo candidato de release |
| `s-aba-01-student-authorization-access/` | Acceso y autorizaciones por estudiante | decisiones D01–D09 | publicación y smoke web |
| `s-aba-02-minimum-record-consent/` | Expediente mínimo, historia y consentimiento de referencia | S-ABA-01 + D02-01–D02-09 | publicación y smoke web |
| `s-aba-03-program-lifecycle/` | Diseño versionable y ciclo de vida de programas ABA | S-ABA-01/02 + D03-01–D03-08 | sesiones, mediciones y gráficos |
| `growth/nestjs-api.md` | Criterios y migración futura hacia NestJS | evidencia de crecimiento | API propia futura |
| docs/system-rebuild/phase-2-pm-epic.md | Roadmap único de planificación para Fase 2: specs, gates y preparación de piloto | estado actual, comparativo y decisiones pendientes | aprobación de organización Fase 2 |

Los Slices 02–15 continúan como línea base histórica. La declaración anterior de que la única
continuación activa era la planificación de Fase 2 fue superada el 2026-08-30 por la aprobación e
implementación autorizada de S-ABA-01 y S-ABA-02 en local/Supabase staging. Esto no autoriza VPS,
producción, datos reales, Storage, firma, despliegue Sites ni publicación web.
