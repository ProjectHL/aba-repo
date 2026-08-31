# Especificación de frontend

## Estado

Aprobada para Slice 02 Supabase-first. El contrato ejecutable está en `specs/slice-02/frontend.md`; no depende de NestJS.

## Objetivo

Reconstruir la interfaz observada como una SPA accesible y responsiva. El primer corte cubre gestión de clientes y alta de cliente con datos familiares sintéticos.

## Stack obligatorio

- React + Vite + TypeScript.
- Tailwind CSS para tokens y composición visual.
- shadcn/ui como base de componentes.
- React Router para navegación.
- React Hook Form + Zod para formularios y validación compartible.
- Vitest + Testing Library para unidad/componentes.
- Playwright para recorridos y comparación visual.

## Arquitectura

- Ubicación futura: `apps/web`.
- Las páginas dependen de casos de uso, no de Supabase directamente.
- Un `ClientRepository` permite alternar entre fake, adaptador Supabase directo y un futuro adaptador HTTP NestJS.
- Los contratos de transporte viven en `packages/contracts`; la UI mantiene modelos de formulario separados cuando sea necesario.
- El navegador usa Supabase Auth, Data API y RPC mediante clave publicable y RLS. No contiene claves secretas ni `service_role`.

## Rutas del primer corte

| Ruta | Pantalla | Evidencia | Estado |
|---|---|---|---|
| `/clientes` | Gestión/listado de clientes y estado vacío | E-001, E-003 | parcialmente observada |
| `/clientes/nuevo` | Formulario/modal de alta de cliente | E-001, E-002 | observada |
| `/clientes/:id` | Placeholder posterior al guardado | sin evidencia directa; P-06 aprobada | aprobado para Slice 02 |

## shadcn/ui

Agregar componentes sólo cuando los requiera una pantalla aprobada. Inventario inicial:

- `Button`, `Card`, `Dialog`, `Input`, `Label`/`Field`, `Select`, `Separator` y `ScrollArea`.
- `Table` y `Empty` para el listado, cuando la evidencia confirme su composición.
- `Alert` o `Toast` para estados de error/éxito aprobados.
- `Calendar`/`Popover` sólo si la captura confirma un selector de fecha; de lo contrario usar `input[type=date]` accesible.

Los componentes generados se consideran código del proyecto: se adaptan con tokens propios y se prueban. No se instala un catálogo completo.

## Formulario de cliente

Campos confirmados: iniciales, ID de cliente, idioma principal, fecha de nacimiento, edad calculada, padres/tutores, hermanos y convivencia. Los nombres, reglas de obligatoriedad y persistencia no visibles permanecen como preguntas abiertas.

## Estados

- Observados: formulario inicial y edad calculada.
- Propuestos sujetos a aprobación: cargando, error de API, guardando, guardado, validación y conflicto de ID.
- Cada estado propuesto debe identificarse en el mapa de flujo y enlazarse a una prueba.

## Pruebas de aceptación

1. La ruta de clientes muestra el estado correspondiente sin datos personales reales.
2. La acción de alta abre/navega al formulario con todos los campos observados.
3. Una fecha válida calcula la edad de forma determinista usando una fecha de reloj controlada en pruebas.
4. Se pueden añadir bloques de tutor y hermano sin perder datos existentes.
5. El submit válido llama una sola vez al repositorio con un contrato tipado.
6. El recorrido completo funciona por teclado y los controles tienen nombres accesibles.
7. Las capturas Playwright se comparan en el viewport de referencia y al menos un viewport móvil.

## Fuera del primer corte

Informes, programas, objetivos, registro de sesiones, permisos administrativos y cualquier pantalla no catalogada.

## Revisión de evidencia del video

El catálogo completo está en `docs/system-rebuild/screen-catalog.md`. El primer corte implementable queda definido por `specs/client-slice.md`; aunque se observaron adaptaciones, escolarización, historia clínica, evaluaciones, programas, sesiones e informes, permanecen fuera de este slice para mantener trazabilidad y pruebas manejables.
