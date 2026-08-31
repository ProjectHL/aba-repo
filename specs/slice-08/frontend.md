# Slice 08 / Frontend

## Alcance

- Convertir `/clientes/:id` en un workspace con pestañas accesibles:
  `Información`, `Evaluación conductual`, `Programas de adquisición`, `Reducción de conductas` y
  `Sesiones`.
- Mostrar en cada pestaña estructura, formularios de referencia, estados vacíos y acciones observadas.
- Habilitar `/informes` desde la navegación principal.
- Mostrar vistas de gráficos, informe de evaluación e informe completo como cartografía visual.
- Mantener responsive móvil y escritorio con shadcn/ui.
- Señalar `Vista en construcción` donde aún no existe persistencia; no fingir guardados ni exportaciones.

## TDD

1. El detalle muestra las cinco pestañas.
2. Cada pestaña cambia el panel visible y conserva el cliente.
3. Evaluación muestra entrevista, preferencias y funcional.
4. Adquisición muestra programa y metas.
5. Reducción separa conductas y funciones.
6. Sesiones muestra adquisición y reducción de forma simultánea.
7. Informes se abre desde navegación y muestra tres superficies reportables.

