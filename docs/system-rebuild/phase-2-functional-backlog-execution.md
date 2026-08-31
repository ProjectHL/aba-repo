# Ejecución del backlog funcional S-ABA-03–S-ABA-10

Fecha: 2026-08-31  
Estado: **alcance completo solicitado; ejecución sujeta a aprobación atómica por spec**

## Alcance

La persona responsable solicitó completar todo el backlog funcional. El trabajo se ejecutará en
orden de dependencias, sin convertir esa autorización de alcance en aprobación automática de
reglas clínicas, persistencia, IA, chat, exportaciones u offline todavía no decididas.

| Orden | Slice | Resultado | Decisiones bloqueantes |
| --- | --- | --- | --- |
| 1 | S-ABA-03 | programas y ciclo de vida | edición/versionado y transiciones |
| 2 | S-ABA-04 | sesión guiada y porcentaje | DEC-ABA-06 |
| 3 | S-ABA-05 | frecuencia, duración, latencia y TER | DEC-ABA-04/05/06 |
| 4 | S-ABA-06 | intervalos diferenciados | DEC-ABA-04/05/06 |
| 5 | S-ABA-07 | gráficos por programa | DEC-ABA-04/05/09 |
| 6 | S-ABA-08 | solicitudes y chat | DEC-ABA-10 |
| 7 | S-ABA-09 | salidas y mapa de flujo | DEC-ABA-07/09 |
| 8 | S-ABA-10 | offline y sincronización | DEC-ABA-08 |

S-ABA-03 tiene implementación local verde y schema/contrato aplicado en `ABA_staging` mediante
018/019 + 006. Aún no está cerrada: faltan publicación del frontend y E2E autenticado por UI con
fixtures sintéticos persistentes.

S-ABA-01/02 permanecen implementadas en local y `ABA_staging`; su smoke visible de versión 13
sigue bloqueado externamente por OpenAI Auth 500 y se reintentará como gate independiente.

## Loop obligatorio por slice

1. candidata de frontend, backend, Supabase, publicación y BDD;
2. aprobación explícita de decisiones y alcance;
3. TDD rojo–verde–refactor con datos sintéticos;
4. regresión local y contratos SQL;
5. autorización separada antes de Supabase staging o publicación;
6. E2E autenticado y evidencia;
7. Brújula y siguiente slice.

## Definition of Ready

Una slice sólo entra a implementación si define sin ambigüedad: propietario, estados,
transiciones, payloads, validaciones, permisos, auditoría, errores, no-objetivos, BDD y efectos en
las cuatro capas. Toda inferencia debe aprobarse expresamente.

## Límites globales

- Exclusivamente identidades y datos sintéticos.
- Sin borrado; usar estados, versionado o archivado no destructivo.
- Sin producción, datos reales, VPS, ampliación de audiencia ni credenciales de producción.
- IA, offline, chat y exportaciones requieren su propia aprobación aunque pertenezcan al alcance
  completo solicitado.
